import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { Duration, RemovalPolicy } from "aws-cdk-lib";
import { kebabCaseToCamelCase } from "../utils";

type ContructProps = {
  vpc: ec2.IVpc;
  ingressPeers: ec2.IPeer[];
};

export class RdsInstanceWithSecurityGroup extends Construct {
  public readonly rdsInstance: rds.DatabaseInstance;
  public readonly securityGroup: ec2.SecurityGroup;

  constructor(scope: Construct, id: string, props: ContructProps) {
    const dbId = `xpm-rds-${id}`;
    super(scope, dbId);

    const sgName = `xpm-rds-${id}--sg`;

    this.securityGroup = new ec2.SecurityGroup(this, sgName, {
      securityGroupName: sgName,
      vpc: props.vpc,
    });

    props.ingressPeers.forEach((peer) => {
      this.securityGroup.addIngressRule(peer, ec2.Port.tcp(5432));
    });

    this.rdsInstance = new rds.DatabaseInstance(this, dbId, {
      // "databaseName" must begin with a letter and contain only alphanumeric characters
      databaseName: kebabCaseToCamelCase(dbId),
      instanceIdentifier: `xpm-rds-instance-${id}`,
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_4,
      }),
      port: 5432,
      // credentials "username" must be between 1 and 16 characters in length.
      // It must contain only letters, numbers, and underscores.
      // It must start with a letter.
      credentials: rds.Credentials.fromUsername("xpm_rds_admin", {
        secretName: dbId,
      }),
      vpc: props.vpc,
      vpcSubnets: {
        subnets: props.vpc.publicSubnets,
      },
      availabilityZone: props.vpc.publicSubnets[0].availabilityZone,
      publiclyAccessible: true,
      securityGroups: [this.securityGroup],
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.MICRO
      ),
      allocatedStorage: 10,
      maxAllocatedStorage: 10,
      backupRetention: Duration.days(1),
      removalPolicy: RemovalPolicy.SNAPSHOT,
      deleteAutomatedBackups: true,
    });
  }
}
