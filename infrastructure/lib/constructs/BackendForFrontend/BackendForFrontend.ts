import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import * as fs from "fs";
import * as path from "path";

type BackendForFrontendProps = {
  vpc: ec2.IVpc;
};

// TODO (Valle)  -> configure cloudwatch
// TODO (Valle) -> use pm2 for managing the running node process
export class BackendForFrontend extends Construct {
  public readonly ec2Instance: ec2.Instance;
  public readonly securityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: BackendForFrontendProps) {
    const ec2Id = `xpm-ec2-${id}`;
    const sgName = `xpm-ec2-${id}--sg`;
    const sshKeyId = `xpm-ec2-${id}--ssh-key`;
    const roleId = `xpm-ec2-${id}--role`;

    super(scope, ec2Id);

    this.securityGroup = new ec2.SecurityGroup(this, sgName, {
      securityGroupName: sgName,
      vpc: props.vpc,
    });

    this.securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.HTTPS,
      "Allow inbound HTTPS traffic"
    );

    this.securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.HTTP,
      "Allow inbound HTTP traffic"
    );

    this.securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.SSH,
      "Allow inbound SSH traffic"
    );

    const startScript = fs.readFileSync(
      path.join(__dirname, "start-script.sh"),
      "utf8"
    );

    // TODO -> move keypair to secrets manager
    const keyPair = new ec2.KeyPair(this, sshKeyId, {
      keyPairName: sshKeyId,
      publicKeyMaterial:
        "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDhWiZVTIOFkqyLnX2xvXrMc/mnxn2t7lls6+DE4aW09gUH1PXsRcygCXt/1vkOb/CaCNK6JpCc/7rOj1HtlA+rpgzyr6PI/YXMj0NmSGLLTymamNHa5vheeXp8F4YnetZhyp3zhX6J4vChAX9Hn6Sb9Z4QP42MftTrmIHWTDCoDpJxGgaa25t1v6XF2FcWBMy7zcKDOfYTUCrpuCOnEid1OAafis/uCHVXUVkgkP9w08fd4txVa63tic4lwEjgNwkI1HHzkuVkpTIIjhrvr0q5Bm6bUjjNHsr9KQej8oBsye5BwrGRwBfmr6AonRf1Sa7Lp2CfGxzfmvjXE3rhYyZirngwOCUuYdESmhpZ0Upbf4e5+6Qz1lgy1kw4ujgP+ee1KKy8w9nnjew9APt54yYMEB3Ow1gC7UWCqhKAB38Hpim4QFpdtCwEn2nO1RFBcMbKEjSPXq2lDmFevNtsH8iaEYj6uuMP70KiPYrNbiijozaUJw4EI4LLBTl0xwHih5E= ahara@Vallelica",
    });

    const instanceRole = new iam.Role(this, roleId, {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "AmazonSSMManagedInstanceCore"
        ),
      ],
    });

    this.ec2Instance = new ec2.Instance(this, ec2Id, {
      vpc: props.vpc,
      vpcSubnets: {
        subnets: props.vpc.publicSubnets,
      },
      instanceType: new ec2.InstanceType("t3.micro"),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023,
      }),
      securityGroup: this.securityGroup,
      instanceName: ec2Id,
      keyPair,
      role: instanceRole, // Attach the IAM role here
      userData: ec2.UserData.custom(startScript),
    });

    // Attach secrets manager permissions
    const instanceEnvConfigSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "backend-for-frontend-env-config",
      "xpm-backend-for-frontend-env-var-prod"
    );

    instanceEnvConfigSecret.grantRead(this.ec2Instance);

    const databaseSecret = secretsmanager.Secret.fromSecretNameV2(
      this,
      "backend-for-frontend-database-config",
      "xpm-rds-main-prod"
    );

    databaseSecret.grantRead(this.ec2Instance);
  }
}
