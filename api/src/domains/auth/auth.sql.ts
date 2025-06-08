import { z } from 'zod';
import { sqlClient } from '../../services/database/client.sql.ts';
import { userSchema } from '../../models/business.models.ts';

export async function selectActiveUserByUsername(username: string) {
  const query = `
    SELECT
     user_id, username, email, password, user_status_id
    FROM users
    WHERE username = ? AND user_status_id = 10
  `;

  const user = (await sqlClient.query(query, [username]))[0];

  if (!user) {
    return null;
  }

  return userSchema.extend({ password: z.string() }).parse(user);
}
