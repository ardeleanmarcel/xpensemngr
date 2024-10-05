# Infrastructure

- Project was created using `npx cdk init app --language=typescript`
- Run commands using `AWS_PROFILE=<your profile> npm run cdk <command>`

### Connecting to the main-api ec2 instance (using WSL)

- You will need to have the private key in a file, i.e. `main-api-prod-ssh-key`, for the key that was configured during deployment.
- Place the file in the linux file system by copying into `~/.ssh/`
- Run `ssh -i ~/.ssh/main-api-prod-ssh-key ec2-user@ec2-18-193-86-48.eu-central-1.compute.amazonaws.com` to connect.
- Warning! If the machine restarts, the URL will change. Find it in AWS web console.
