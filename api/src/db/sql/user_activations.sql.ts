import { randomUUID } from 'crypto';
import { sqlClient } from '@src/adapters/sqlClient.ts';
import { UserActivationDbData } from '../../models/user_activation.models.ts';

export function createUserActivations(userIds: number[]) {
  const values = new Array(userIds.length)
    .fill(null)
    .map(() => `( ?, ? )`)
    .join(',\n');

  const bindings = userIds.map((u) => [u, randomUUID()]).reduce((b, u) => [...b, ...u]);

  const query = `
    INSERT INTO user_activations
      (user_id, activation_code)
    VALUES
      ${values}
    RETURNING *
  `;

  return sqlClient.queryWithParams<UserActivationDbData>(query, bindings);
}

export function selectUserActivations(activationCodes: string[]) {
  const query = `
    SELECT * FROM user_activations ua
    WHERE ua.activation_code IN ( ${activationCodes.map(() => '?').join(',  ')} )
  `;

  return sqlClient.queryWithParams<UserActivationDbData>(query, activationCodes);
}

export function updateUserActivations(activationCodes: string[]) {
  const query = `
    WITH activations AS (
      UPDATE user_activations
      SET is_used = true
      WHERE user_activations.activation_code IN ( ${activationCodes.map(() => '?').join(',  ')} )
      RETURNING user_activations.user_id
    )
    UPDATE users
    SET user_status_id = 10
    WHERE user_id IN ( select user_id from activations);
  `;

  return sqlClient.queryWithParams<UserActivationDbData>(query, activationCodes);
}
