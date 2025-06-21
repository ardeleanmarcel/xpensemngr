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

## AWS CLI and Web Console access

Request an administrator to create an account within AWS IAM Identity Center and give
you appropriate permissions by adding your user to a group (i.e. Administrators).

### CLI Access

1. Make sure you have the AWS CLI installed
1. In a terminal, run `aws configure sso`
1. When asked for a profile name, use `xpm-admin`, because some of the scripts in this
   repository are configured to use this aws profile name
1. When asked for the SSO start URL, use `https://d-996764b2bf.awsapps.com/start`
1. For region, use `eu-central-1`
1. For SSO registration scopes, the default `sso:account:access` is the correct choice.
1. A browser tab should open asking for permission to connect (sign in might be required)
1. For CLI default client Region, type in eu-central-1
1. Choose any output format you like, or press enter for default (json).

### Web Console access

For accessing the web console, go to `https://d-996764b2bf.awsapps.com/start` and sign in
using the credentials you have been provided.

<!-- TODO add a "common constants" package, which can include things such as XPM_ENV -->

<!-- TODO add mechanism for identifying the deployed version for webapp or api -->

<!-- TODO check all sql queries that they use the getSqlQueryBindings function -->

<!-- TODO check that the "console" object is not used to log anything, and add a lint rule to prevent it -->

<!-- TODO make a PR github action that makes sure all projects compile and all lint rules are respected -->

### TODO

1. Disallow having multiple labels with the same name
