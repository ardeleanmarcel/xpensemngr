import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { GithubOidcProvider } from "./GithubOidcProvider";

interface WebappDeploymentProps {
  bucketName: string;
  awsAccountId: string;
  cloudfrontDistributionId: string;
}

export class WebappDeployment extends Construct {
  constructor(scope: Construct, id: string, props: WebappDeploymentProps) {
    super(scope, id);

    const githubOidc = new GithubOidcProvider(this, "GithubOidcProvider");

    const deploymentPolicy = new iam.Policy(this, "WebappDeployment", {
      policyName: "WebappDeploymentPolicy",
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["s3:ListBucket"],
          resources: [`arn:aws:s3:::${props.bucketName}`],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: [
            "s3:GetObject",
            "s3:PutObject",
            "s3:DeleteObject",
            "s3:ListBucket",
            "s3:ListMultipartUploadParts",
            "s3:AbortMultipartUpload",
          ],
          resources: [`arn:aws:s3:::${props.bucketName}/*`],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["cloudfront:CreateInvalidation"],
          resources: [
            `arn:aws:cloudfront::${props.awsAccountId}:distribution/${props.cloudfrontDistributionId}`,
          ],
        }),
      ],
    });

    const githubActionsRole = new iam.Role(this, "deploy-webapp-role", {
      assumedBy: new iam.FederatedPrincipal(
        githubOidc.oidcProvider.openIdConnectProviderArn,
        {
          StringLike: {
            "token.actions.githubusercontent.com:sub":
              "repo:ardeleanmarcel/xpensemngr:ref:refs/heads/main",
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
      description: "Role for GitHub Actions to deploy using OIDC",
    });

    githubActionsRole.attachInlinePolicy(deploymentPolicy);
  }
}
