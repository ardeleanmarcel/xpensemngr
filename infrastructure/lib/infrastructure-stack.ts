import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { XpmVpc } from "./constructs/XpmVpc";
import { RdsInstanceWithSecurityGroup } from "./constructs/XpmRds";
import { Ec2WithSecurityGroup } from "./constructs/XpmEc2WithSg";
import { XpmBucketWebapp } from "./constructs/XpmBucketWebapp";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new XpmVpc(this, "main-prod");

    const mainRelDb = new RdsInstanceWithSecurityGroup(this, "main-prod", {
      vpc,
      ingressPeers: [ec2.Peer.anyIpv4()],
    });

    const mainApi = new Ec2WithSecurityGroup(this, "main-api-prod", {
      vpc,
    });

    mainRelDb.rdsInstance.connections.allowDefaultPortFrom(
      mainApi.securityGroup
    );

    new XpmBucketWebapp(this, "webapp-prod");
  }
}
