import { Knex } from 'knex';
import { hash } from 'bcrypt';

import { TEST_USER_ID } from '../constants.ts';
import { log } from '../utils.ts';

export async function seed(knex: Knex): Promise<void> {
  try {
    const pass = 'T3stP@ssw0rd!';
    const hashedPass = await hash(pass, 5);

    await knex.raw(
      `
      INSERT INTO users
        (user_id, password, username, email, user_status_id)
      OVERRIDING SYSTEM VALUE
      VALUES
        (
          ? , ? ,
          'test_user_1',
          'test_user_1@test_email.com',
          10                                  -- Value for "Active"
        )
      RETURNING
        user_id;`,
      [TEST_USER_ID, hashedPass]
    );
  } catch (error: any) {
    if (typeof error.message === 'string' && error.message.includes('duplicate key value violates unique constraint')) {
      log.warn('Users table already seeded!');
    } else {
      log.error('Error seeding users');
      throw error;
    }
  }
}
