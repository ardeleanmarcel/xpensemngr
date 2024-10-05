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

type AllowedUserFilters = 'username' | 'user_status_id' | 'user_id';
export async function selectUsers(filters: Filter<AllowedUserFilters>[]) {
  const { whereClauses, bindings } = composeWhereClause(filters);

  const query = `SELECT * FROM users ${whereClauses}`;

  const res = await sqlClient.queryWithParams<UserType>(query, bindings);

  return res;
}

export async function updateUserPassword(userId: number, hashedPassword: string) {
  const query = `
    UPDATE users
    SET password = ?
    WHERE user_id = ?
    RETURNING
      user_id,
      username,
      email
  `;

  const bindings = [hashedPassword, userId];

  try {
    const result = await sqlClient.queryWithParams<UserType>(query, bindings);
    if (result.length === 0) {
      throw new Error('User not found or password update failed');
    }
    return result[0];
  } catch (error) {
    throw new Error(`Failed to update password for user ${userId}: ${error.message}`);
  }
}

export async function hardDeleteAccount(userId: number) {
  const deleteExpensesQuery = `
    DELETE FROM expenses WHERE added_by_user_id = ?;
  `;
  const deleteActivationsQuery = `
    DELETE FROM user_activations WHERE user_id = ?;
  `;
  const deleteUserQuery = `
    DELETE FROM users WHERE user_id = ?;
  `;

  const bindings = [userId];

  try {
    await sqlClient.query('BEGIN');
    await sqlClient.queryWithParams(deleteExpensesQuery, bindings);
    await sqlClient.queryWithParams(deleteActivationsQuery, bindings);
    await sqlClient.queryWithParams(deleteUserQuery, bindings);
    await sqlClient.query('COMMIT');

    return { success: true };
  } catch (error) {
    await sqlClient.query('ROLLBACK');
    throw new Error(`Failed to delete account for user ${userId}: ${error.message}`);
  }
}
