import { Knex } from 'knex';

export const up = function (knex: Knex) {
  return knex.raw(`
    CREATE TABLE IF NOT EXISTS labels (
      "label_id"          BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,
      "name"              VARCHAR           NOT NULL,
      "description"       VARCHAR           DEFAULT NULL,
      "added_by_user_id"  BIGINT            NOT NULL
                          CONSTRAINT user_id_fk REFERENCES users (user_id)
    );
  `);
};

export const down = function (knex: Knex) {
  return knex.raw(`
    DROP TABLE IF EXISTS labels;
  `);
};
