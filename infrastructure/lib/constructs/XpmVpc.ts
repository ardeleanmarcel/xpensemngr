import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

export class XpmVpc extends ec2.Vpc {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      vpcName: id,
      maxAzs: 2,
      createInternetGateway: true,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "private",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
        {
          cidrMask: 24,
          name: "public",
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });
  }
}
