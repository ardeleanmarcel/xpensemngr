import { sqlClient } from '@src/adapters/sqlClient.ts';
import { throwHttpError } from '@src/errors/error.utils.ts';
import { HTTP_ERR } from '@errors';
import { Filter } from '../db.utils.ts';
import { composeWhereClause } from './utils/sql.utils.ts';
import { UserCreateType, UserType } from '../../models/user.models.ts';

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
      password,
      email,
      user_status_id;
  `;

  const bindings = [hashedPassword, userId];

  try {
    const result = await sqlClient.queryWithParams<UserType>(query, bindings);
    if (result.length === 0) {
      throwHttpError(HTTP_ERR.e404.NotFound('User', userId.toString()));
    }
    return result[0];
  } catch (error) {
    console.log('error', error);
    throwHttpError(HTTP_ERR.e500.Unavailable);
  }
}

export async function updateUserEmail(userId: number, email: string) {
  const query = `
    UPDATE users
    SET email = ?
    WHERE user_id = ?
    RETURNING
      user_id,
      username,
      password,
      email,
      user_status_id;
  `;

  const bindings = [email, userId];

  try {
    const result = await sqlClient.queryWithParams<UserType>(query, bindings);
    if (result.length === 0) {
      throwHttpError(HTTP_ERR.e404.NotFound('user', userId.toString()));
    }
    return result[0];
  } catch (error) {
    console.log('error', error);
    throwHttpError(HTTP_ERR.e500.Unavailable);
  }
}

export async function softDeleteAccount(userId: number) {
  const query = `UPDATE users SET user_status_id = 30 WHERE user_id = ? 
  RETURNING
    user_id,
    username,
    password,
    email,
    user_status_id;`;

  const bindings = [userId];

  try {
    const result = await sqlClient.queryWithParams<UserType>(query, bindings);
    console.log('🚀 ~ softDeleteAccount ~ result:', result);
    if (result.length === 0) {
      throwHttpError(HTTP_ERR.e404.NotFound('User', userId.toString()));
    }
    return result[0];
  } catch (error) {
    console.log('error', error);
    throwHttpError(HTTP_ERR.e500.Unavailable);
  }
}

export async function hardDeleteAccount(userId: number) {
  const deleteExpensesQuery = `DELETE FROM expenses WHERE added_by_user_id = ?;`;
  const deleteUserActivationsQuery = `DELETE FROM user_activations WHERE user_id = ?;`;
  const deleteUsersQuery = `DELETE FROM users WHERE user_id = ?;`;

  const bindings = [userId];

  try {
    const result1 = await sqlClient.queryWithParams<UserType>(deleteExpensesQuery, bindings);
    const result2 = await sqlClient.queryWithParams<UserType>(deleteUserActivationsQuery, bindings);
    const result3 = await sqlClient.queryWithParams<UserType>(deleteUsersQuery, bindings);
    if (result1.length === 0 || result2.length === 0 || result3.length === 0) {
      throwHttpError(HTTP_ERR.e404.NotFound('User', userId.toString()));
    }
    // TODO -> fix this function (the result1,2,3 is always null because the query does not have RETURNING)
    return { success: true };
  } catch (error) {
    console.log('error', error);
    throwHttpError(HTTP_ERR.e500.Unavailable);
  }
}
