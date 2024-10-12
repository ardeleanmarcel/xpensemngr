import { Knex } from 'knex';

export const up = function (knex: Knex) {
  return knex.raw(`
    CREATE TABLE IF NOT EXISTS expenses_labels (
      expense_id BIGINT NOT NULL
        CONSTRAINT expense_id_fk REFERENCES expenses (expense_id),
      label_id BIGINT NOT NULL
        CONSTRAINT label_id_fk REFERENCES labels (label_id),
      PRIMARY KEY (expense_id, label_id)
    )
  `);
};

export const down = function (knex: Knex) {
  return knex.raw(`
    DROP TABLE IF EXISTS expenses_labels
  `);
};
