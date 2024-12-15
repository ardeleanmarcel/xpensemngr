# Infrastructure

- Project was created using `npx cdk init app --language=typescript`
- Run commands using `AWS_PROFILE=<your profile> npm run cdk <command>`

### Connecting to the main-api ec2 instance (using WSL)

- You will need to have the private key in a file, i.e. `main-api-prod-ssh-key`, for the key that was configured during deployment.
- Place the file in the linux file system by copying into `~/.ssh/`
- Run `ssh -i ~/.ssh/main-api-prod-ssh-key ec2-user@ec2-18-158-59-56.eu-central-1.compute.amazonaws.com` to connect.
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

### Steps for setting up EC2 and starting server

First you need to access the instance. This can be done from the AWS web console.

<!-- TODO (Valle) -> Create a shell script that does most of this in one run -->
<!-- TODO (Valle) -> Have the script run a node file that creates the .env required for the app -->

1. `sudo bash`
1. `dnf install git`
1. `touch ~/.ssh/github-key`
1. `nano ~/.ssh/github-key` Add the key found in Valle's ssh folder
1. `chmod 600 ~/.ssh/github-key`
1. `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash`
1. Restart bash by `exit` and `sudo bash` to let it load the required paths for NVM (Node Version Manager)
1. `nvm install 20.12.2`
1. `eval "$(ssh-agent -s)"` Should show the agent process id to confirm
1. `ssh-add ~/.ssh/github-key`
1. `cd ~`
1. `git clone git@github.com:ardeleanmarcel/xpensemngr.git`
1. `cd ~/xpensemngr/api`
1. `npm install`
1. `cp .env.example .env` and `nano .env` Fill these in with production values
1. Use the `nohup npm run start &` command to launch a server process and keep it running.
1. run `netstat -ntlp` to identify to process id (PID).
1. run `kill <PID>` to kill the process if needed.
