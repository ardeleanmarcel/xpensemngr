# database

## Local Environment

<span style="color: orange;">**WARNING!**</span>
This _Local Development_ reference is **ONLY** if you want to work on the the DB by itself!<br>
If you want to work on the entire project, refer to the [PROJECT LEVEL README](../README.md).

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

- When a new env is made, if using Postgres, the schema must be created using `npm run bootstrap`.
  Make sure the correct values are set in your `.env` file and also that `knexfile.ts` is configured correctly.

## Databse Operations

Warning! A local database connection must be available to be able to perform operations such as creating migrations or seeds!

### Creating Migrations

- Use command `npm run create:migration <your_snake_case_name>`

### Running DDL Migrations

If making changes to an AWS hosted environment (i.e. production), you will need to first configure the CLI
by running `npm run aws:login`. Make sure the `xpm-admin` profile is set up by following the project-level readme.

- Use command `npm run migrate:local:all` to run all migrations.
- Use command `npm run migrate:local:down` to reverse last migration.

### Creating & Running Seeds

- Use command `npm run create:seed <your_snake_case_name>` to create a new seed. It needs to be manually added to
  the file running the seeds as well, in order for it to get run. See `perform_seed_operations.ts`.
- Use command `npm run seed:local:all` to seed your local DB.
