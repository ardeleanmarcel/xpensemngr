import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { XpmVpc } from "./constructs/XpmVpc";
import { RdsInstanceWithSecurityGroup } from "./constructs/XpmRds";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new XpmVpc(this, "main-prod");

    const rds = new RdsInstanceWithSecurityGroup(this, "main-prod", {
      vpc,
      ingressPeers: [ec2.Peer.anyIpv4()],
    });
  }
}
