# Infrastructure

- Project was created using `npx cdk init app --language=typescript`
- Run commands using `AWS_PROFILE=<your profile> npm run cdk <command>`

### Connecting to the main-api ec2 instance (using WSL)

- You will need to have the private key in a file, i.e. `main-api-prod-ssh-key`, for the key that was configured during deployment.
- Place the file in the linux file system by copying into `~/.ssh/`
- Run `ssh -i ~/.ssh/main-api-prod-ssh-key ec2-user@ec2-3-65-218-75.eu-central-1.compute.amazonaws.com` to connect.
- Warning! If the machine restarts, the URL will change. Find it in AWS web console.
- To avoid permission issues, use `sudo bash` before running commands.

Good to know for ec2 management

- github key is also found on valle's pc
- fresh instance will not have git installed
- installing packages is done with `dnf`
- start ssh agent using `eval "$(ssh-agent -s)"`
- access level for ssh key should be 600 `chmod 600 ~/.ssh/github-key`
- nvm is installed with `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash`
- don't forget to update `.env`
