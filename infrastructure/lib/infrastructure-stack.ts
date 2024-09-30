import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { XpmVpc } from "./constructs/XpmVpc";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new XpmVpc(this, "xpm-vpc-main-prod");
  }
}
