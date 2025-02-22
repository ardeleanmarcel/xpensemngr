import * as cdk from "aws-cdk-lib";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { GithubOidcProvider } from "./GithubOidcProvider";

interface WebappDeploymentProps {
  bucketName: string;
  awsAccountId: string;
  cloudfrontDistributionId: string;
  ec2Api: ec2.IInstance;
}

// TODO (Valle) -> this should NOT be part of XpmSinglePageWebapp. It should be an independent construct
// TODO (Valle) -> could have some IF statements for (if ec2 ...) (if cloudronft & bucket)
export class WebappDeployment extends Construct {
  constructor(scope: Construct, id: string, props: WebappDeploymentProps) {
    super(scope, id);

    const account = cdk.Stack.of(this).account;
    const region = cdk.Stack.of(this).region;

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
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ["ssm:SendCommand", "ssm:GetCommandInvocation"],
          resources: [
            `arn:aws:ssm:${region}::document/AWS-RunShellScript`,
            `arn:aws:ec2:${region}:${account}:instance/${props.ec2Api.instanceId}`,
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
