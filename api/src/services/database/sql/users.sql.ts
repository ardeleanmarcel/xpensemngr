import { z } from 'zod';
import { sqlClient } from '@src/services/database/client.sql.ts';
import { throwHttpError } from '@src/errors/error.utils.ts';
import { HTTP_ERR } from '@errors';
import { Filter } from '../database.utils.ts';
import { composeWhereClause } from './utils/sql.utils.ts';
import { UserCreateType, userSchema } from '../../models/user.models.ts';

export async function createUsers(users: UserCreateType[]) {
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
        email,
        user_status_id
  `;

  // TODO (Valle) -> use helper function
  const bindings = users.reduce((bindings, user) => {
    const { username, password, email } = user;
    return [...bindings, username, password, email];
  }, []);

  const result = await sqlClient.query(query, bindings);

  return userSchema.array().parse(result);
}

// TODO (Valle) -> add "created_at" column to users table
type AllowedUserFilters = 'username' | 'user_status_id' | 'user_id';
export async function selectUsers(filters: Filter<AllowedUserFilters>[]) {
  const { whereClauses, bindings } = composeWhereClause(filters);

  const query = `SELECT user_id, username, email, password, user_status_id FROM users ${whereClauses}`;

  const res = await sqlClient.query(query, bindings);

  return userSchema.extend({ password: z.string() }).array().parse(res);
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

  const rawResult = await sqlClient.query(query, bindings);
  const result = userSchema.array().parse(rawResult);

  if (result.length === 0) {
    throwHttpError(HTTP_ERR.e404.NotFound('User', userId.toString()));
  }

  return result[0];
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

  const rawResult = await sqlClient.query(query, bindings);
  const result = userSchema.array().parse(rawResult);

  if (result.length === 0) {
    throwHttpError(HTTP_ERR.e404.NotFound('user', userId.toString()));
  }

  return result[0];
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

  const rawResult = await sqlClient.query(query, bindings);
  const result = userSchema.array().parse(rawResult);

  if (result.length === 0) {
    throwHttpError(HTTP_ERR.e404.NotFound('User', userId.toString()));
  }

  return result[0];
}

export async function hardDeleteAccount(userId: number) {
  const deleteExpensesQuery = `DELETE FROM expenses WHERE added_by_user_id = ?;`;
  const deleteUserActivationsQuery = `DELETE FROM user_activations WHERE user_id = ?;`;
  const deleteUsersQuery = `DELETE FROM users WHERE user_id = ?;`;

  const bindings = [userId];

  try {
    const result1 = await sqlClient.query(deleteExpensesQuery, bindings);
    const result2 = await sqlClient.query(deleteUserActivationsQuery, bindings);
    const result3 = await sqlClient.query(deleteUsersQuery, bindings);
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
