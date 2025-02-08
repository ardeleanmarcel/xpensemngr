import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { BackendForFrontend } from "./constructs/BackendForFrontend/BackendForFrontend";
import { XpmVpc } from "./constructs/XpmVpc";
import { RdsInstanceWithSecurityGroup } from "./constructs/XpmRds";
import { XpmSinglePageWebapp } from "./constructs/XpmSinglePageWebapp";

// TODO (Valle) ->  use this: constructA.node.addDependency(constructB)
export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // TODO (Valle) -> replace "-prod" with "-${env}"
    const vpc = new XpmVpc(this, "main-prod");

    const mainRelDb = new RdsInstanceWithSecurityGroup(this, "main-prod", {
      vpc,
      ingressPeers: [ec2.Peer.anyIpv4()],
    });

    const mainApi = new BackendForFrontend(this, "main-api-prod", {
      vpc,
    });

    mainRelDb.rdsInstance.connections.allowDefaultPortFrom(
      mainApi.securityGroup
    );

    new XpmSinglePageWebapp(this, "spa-prod");
  }
}
