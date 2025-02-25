import { Knex } from 'knex';
import { TEST_USER_ID } from '../constants.ts';

// TODO (Valle) -> generate passwords as they would be in the actual app
// TODO (Valle) -> the id is generated always. to use specific ids "Use OVERRIDING SYSTEM VALUE to override."
export async function seed(knex: Knex): Promise<void> {
  // Inserts seed entries
  // await knex('users')
  //   .insert([{ username: 'test_user_1', email: 'test_user_1@test_email.com', password: 'encrypt-me' }])
  //   .returning('user_id');
  await knex.raw(`
    INSERT INTO users
      (user_id, username, email, password)
    OVERRIDING SYSTEM VALUE
    VALUES
      (${TEST_USER_ID}, 'test_user_1', 'test_user_1@test_email.com', 'encrypt-me')
    RETURNING
      user_id;`);
}
