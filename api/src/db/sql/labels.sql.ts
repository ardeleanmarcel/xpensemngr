import { sqlClient } from '@src/adapters/sqlClient.ts';
import { LabelCreateType, LabelType } from '@src/models/label.models.ts';
import { Filter } from '../db.utils.ts';
import { composeWhereClause } from './utils/sql.utils.ts';
import { throwHttpError } from '@src/errors/error.utils.ts';
import { HTTP_ERR } from '@errors';

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
        description
  `;

  const bindings = labels.reduce((bindings, label) => {
    const { name, description } = label;
    return [...bindings, name, description ?? null, user_id];
  }, []);

  // TODO (Valle) -> replace passing a type to the function with a parse operation
  // Should I createa a helper function that gets query name and parser function?
  return await sqlClient.query<LabelType>(query, bindings);
}

export type AllowedLabelsFilters = 'added_by_user_id';
export async function selectLabels(filters: Filter<AllowedLabelsFilters>[]) {
  const { whereClauses, bindings } = composeWhereClause(filters);

  const query = `SELECT * FROM labels ${whereClauses}`;

  const res = await sqlClient.query<LabelType>(query, bindings);

  return res;
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

  const foundLabels = (await sqlClient.query<{ label_id: number }>(query, [...label_ids, user_id])).map(
    ({ label_id }) => label_id
  );

  for (const label_id of label_ids) {
    if (!foundLabels.includes(label_id)) {
      throwHttpError(HTTP_ERR.e400.BadRequest(`Label ${label_id} does not belong to user ${user_id}`));
    }
  }

  return true;
}
