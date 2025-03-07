import { z } from 'zod';
import { randomUUID } from 'crypto';
import { sqlClient } from '@src/adapters/sqlClient.ts';
import { userActivationSchema } from '../../models/user_activation.models.ts';

export async function createUserActivations(userIds: number[]) {
  const values = new Array(userIds.length)
    .fill(null)
    .map(() => `( ?, ? )`)
    .join(',\n');

  const bindings = userIds.map((u) => [u, randomUUID()]).reduce((b, u) => [...b, ...u], []);

  const query = `
    INSERT INTO user_activations
      (user_id, activation_code)
    VALUES
      ${values}
    RETURNING
      user_id,
      activation_code,
      expires_at,
      is_used
    `;

  const result = await sqlClient.query(query, bindings);

  return z.array(userActivationSchema.extend({ expires_at: z.date() })).parse(result);
}

export async function selectUserActivations(activationCodes: string[]) {
  const query = `
    SELECT
      user_id,
      activation_code,
      expires_at,
      is_used
    FROM user_activations ua
    WHERE ua.activation_code IN ( ${activationCodes.map(() => '?').join(',  ')} )
  `;

  const result = await sqlClient.query(query, activationCodes);

  return z.array(userActivationSchema.extend({ expires_at: z.date() })).parse(result);
}

export async function updateUserActivations(activationCodes: string[]) {
  // TODO (Valle) -> add RETURNING in statement
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

  await sqlClient.query(query, activationCodes);
}
