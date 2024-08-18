import { UserCreateType, UserType } from '../../models/user.models';
import { sqlClient } from '@src/adapters/sqlClient';
import { Filter } from '../db.utils';
import { composeWhereClause } from './utils/sql.utils';

export async function createUsers(users: UserCreateType[]) {
  // TODO (Valle) -> wrap DB requests in a try-catch and throw an HttpError if the query fails
  const queryValues = new Array(users.length)
    .fill(null)
    .map(() => `( ?, ?, ?, 20 )`)
    .join(',\n');

  const query = `
      INSERT INTO users
        (username, password, email, user_status_id)
      VALUES
        ${queryValues}
      RETURNING
        user_id,
        username,
        password,
        email
  `;

  const bindings = users.reduce((bindings, user) => {
    const { username, password, email } = user;
    return [...bindings, username, password, email];
  }, []);

  return await sqlClient.queryWithParams<UserType>(query, bindings);
}

// TODO (Valle) -> add "created_at" column to users table
// TODO (Valle) -> add seed script for root admin

type AllowedUserFilters = 'username' | 'user_status_id';
export async function selectUsers(filters: Filter<AllowedUserFilters>[]) {
  const { whereClauses, bindings } = composeWhereClause(filters);

  const query = `SELECT * FROM users ${whereClauses}`;

  const res = await sqlClient.queryWithParams<UserType>(query, bindings);

  return res;
}
