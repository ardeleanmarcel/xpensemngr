import { Knex } from 'knex';

export const up = function (knex: Knex) {
  return knex.raw(`
    CREATE TABLE IF NOT EXISTS expenses (
      "expense_id"        BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,
      "description"       VARCHAR           NOT NULL,
      "amount"            NUMERIC(12,2)     NOT NULL,
      "added_by_user_id"  BIGINT            NOT NULL
                          CONSTRAINT user_id_fk REFERENCES users (user_id),
      "date_expended_at"  DATE              NOT NULL
    );
  `);
};

export const down = function (knex: Knex) {
  return knex.raw(`
    DROP TABLE IF EXISTS expenses;
  `);
};
