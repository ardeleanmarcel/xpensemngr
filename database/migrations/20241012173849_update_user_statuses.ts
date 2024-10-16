import { Knex } from 'knex';

export const up = function (knex: Knex) {
  return knex.raw(`
    INSERT INTO user_statuses
      (user_status_id, user_status_name)
    VALUES
      (30, 'Suspended');
  `);
};

export const down = function (knex: Knex) {
  return knex.raw(`
    DELETE FROM user_statuses WHERE user_status_id = 30;
  `);
};
