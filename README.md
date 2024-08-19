# xpensemngr

This is a monorepo that contains all layers of the application.

## Local development

1. Install NodeJS, preferrably `v20.12`. For linux and macOS you can use `nvm`.
1. Install Docker.
1. Use a terminal where you have `openssl` available (for Windows you can use GitBASH).
1. Make sure ports 3033 (database), 3000 (api) and 5173 (webapp) are available.
   If you already have docker containers running, make sure there are no port conflicts.
1. Make sure the docker daemon is running.
1. Before running the setup script, you will need to have the following:

   - Sendgrid API Key

1. Run the `setup-devenv-local.sh` script to configure the project.
1. Run the `start-devenv-local.sh` script to start developing.
