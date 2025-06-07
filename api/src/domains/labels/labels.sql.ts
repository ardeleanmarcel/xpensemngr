import { z } from 'zod';
import { sqlClient } from '@src/services/database/client.sql.ts';
import { LabelCreateType, labelSchema } from '@src/domains/labels/label.models.ts';
import { Filter } from '../../services/database/database.utils.ts';
import { composeWhereClause } from '../../services/database/sql.utils.ts';
import { log } from '@xpm/logging';

export async function createLabels(labels: LabelCreateType, user_id: number) {
  const queryValues = new Array(labels.length)
    .fill(null)
    .map(() => `( ?, ?, ? )`)
    .join(',\n');

  const query = `
      INSERT INTO labels
        (name, description, added_by_user_id)
      VALUES
        ${queryValues}
      RETURNING
        label_id,
        name,
        description,
        added_by_user_id
  `;

  const bindings = labels.reduce((bindings, label) => {
    const { name, description } = label;
    return [...bindings, name, description ?? null, user_id];
  }, []);

  const dbQueryResult = await sqlClient.query(query, bindings);

  return labelSchema.array().parse(dbQueryResult);
}

export type AllowedLabelsFilters = 'added_by_user_id';
export async function selectLabels(filters: Filter<AllowedLabelsFilters>[]) {
  const { whereClauses, bindings } = composeWhereClause(filters);

  const query = `SELECT label_id, name, description, added_by_user_id FROM labels ${whereClauses}`;

  const res = await sqlClient.query(query, bindings);

  return labelSchema.array().parse(res);
}

export async function checkLabelsBelongToUser(label_ids: number[], user_id: number) {
  if (label_ids.length === 0) {
    return true;
  }

  const query = `
    SELECT label_id FROM labels
    WHERE label_id IN (${label_ids.map(() => '?').join(', ')})
    AND added_by_user_id = ?
  `;

  const rawResult = await sqlClient.query(query, [...label_ids, user_id]);
  const result = z.array(labelSchema.pick({ label_id: true })).parse(rawResult);

  const userLabelsIds = result.map((label) => label.label_id);

  for (const label_id of label_ids) {
    if (!userLabelsIds.includes(label_id)) {
      log.error(`Label ${label_id} does not belong to user ${user_id}`);
      return false;
    }
  }

  return true;
}
