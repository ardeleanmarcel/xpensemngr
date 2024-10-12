import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class XpmBucketWebapp extends Construct {
  public readonly bucket: s3.IBucket;
  public readonly policy: iam.PolicyStatement;

  constructor(scope: Construct, id: string) {
    const bucketId = `xpm-bucket-${id}`;

    super(scope, `${bucketId}-with-policy`);

    this.bucket = new s3.Bucket(scope, bucketId, {
      bucketName: bucketId,
      versioned: false,
      publicReadAccess: true,
      blockPublicAccess: {
        blockPublicPolicy: false,
        blockPublicAcls: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // TODO (Valle) -> check if this policy is really needed
    this.policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:GetObject"],
      principals: [new iam.AnyPrincipal()],
      resources: [`arn:aws:s3:::${bucketId}/*`],
    });

    this.bucket.addToResourcePolicy(this.policy);
  }
}
