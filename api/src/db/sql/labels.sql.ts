import { sqlClient } from '@src/adapters/sqlClient';
import { LabelCreateType, LabelType } from '@src/models/label.models';
import { Filter } from '../db.utils';
import { composeWhereClause } from './utils/sql.utils';

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
  return await sqlClient.queryWithParams<LabelType>(query, bindings);
}

export type AllowedLabelsFilters = 'added_by_user_id';
export async function selectLabels(filters: Filter<AllowedLabelsFilters>[]) {
  const { whereClauses, bindings } = composeWhereClause(filters);

  const query = `SELECT * FROM labels ${whereClauses}`;

  const res = await sqlClient.queryWithParams<LabelType>(query, bindings);

  return res;
}
