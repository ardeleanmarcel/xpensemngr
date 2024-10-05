import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class XpmBucketWebapp extends s3.Bucket {
  constructor(scope: Construct, id: string) {
    const bucketId = `xpm-bucket-${id}`;

    super(scope, bucketId, {
      bucketName: bucketId,
      versioned: false,
      blockPublicAccess: new s3.BlockPublicAccess({
        blockPublicAcls: false,
        restrictPublicBuckets: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
      }),
      publicReadAccess: true,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
      websiteRoutingRules: [
        {
          condition: {
            httpErrorCodeReturnedEquals: "404",
          },
          replaceKey: s3.ReplaceKey.with("index.html"),
        },
        {
          condition: {
            httpErrorCodeReturnedEquals: "403",
          },
          replaceKey: s3.ReplaceKey.with("index.html"),
        },
      ],
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
  }
}
