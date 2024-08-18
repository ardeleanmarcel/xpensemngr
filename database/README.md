# mye-database

## TODO

- add confirmation message before migrating down
- add user seed

## Local Environment

- Create `.env` file based on `.env.example`
- Start the DB using `docker compose up`
- Set the user's schema search by running `ALTER ROLE <user> SET search_path TO <schema name>`

## Conventions

- Table names should have plural names i.e. "users", NOT "user"!
- Unique ID primary key columns should follow the pattern `<table_entity_name>_id`;<br>I.e. for table `users` the primary key column is `user_id`
- foreign key constraint columns should have the **same name** as the original column in the referenced table. and the constraint name should follow the pattern `<column_name>_fk`;<br>I.e. a constraint on column `user_status_id` should be written as `CONSTRAINT user_status_id_fk REFERENCES user_statuses (user_status_id)`
- Timestamp columns should be defined as `TIMESTAMP WITHOUT TIME ZONE` and should contain the timestamp at **UTC**.
- Timestamp and date column names should be suffixed with `_at`, following the pattern `<entity>_at`, i.e. `expired_at`.
- Boolean column should be prefixed with `is_`, named using the pattern `is_<entity>`, i.e. `is_used`.

## Adding environments

- When a new env is made, if using Postgres, the schema must be manually created.

## Creating Migrations

- Use command `npm run make:migration -- <your_snake_case_name>`

## Running Migrations

- Use command `npm run migrate:all` to run all migrations.
- Use command `npm run migrate:down` to reverse last migration.
