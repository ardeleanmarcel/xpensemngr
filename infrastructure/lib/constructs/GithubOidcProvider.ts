import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class GithubOidcProvider extends Construct {
  oidcProvider: iam.IOpenIdConnectProvider;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.oidcProvider = new iam.OpenIdConnectProvider(this, "Github", {
      url: "https://token.actions.githubusercontent.com",
      clientIds: ["sts.amazonaws.com"],
    });
  }
}
