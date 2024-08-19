# xpensemngr

This is a monorepo that contains all layers of the application.

## Local development

1. Install NodeJS, preferrably `v20.12`.
1. Install Docker.
1. Use a terminal wher you have `openssl` available.
1. Make sure ports 3033 (database), 3000 (api) and 5173 (webapp) are available.
1. Make sure the docker daemon is running.
1. Before running the setup script, you will need to have the following:

   - Sendgrid API Key

1. Run the `setup-devenv-local.sh` script to configure and start the project.
