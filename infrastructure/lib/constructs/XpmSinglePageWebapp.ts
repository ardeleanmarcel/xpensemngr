import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cfOrigins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

export class XpmSinglePageWebapp extends Construct {
  hostedZone: route53.IHostedZone;
  certificate: acm.ICertificate;
  distribution: cloudfront.IDistribution;
  webBucket: XpmS3BucketPublic;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.webBucket = new XpmS3BucketPublic(this, `${id}-webapp`);

    // this.hostedZone = new route53.HostedZone(this, `${id}-hosted_zone`, {
    //   zoneName: "xpensemngr.com",
    //   comment: `${id}-hosted_zone for xpensemngr.com`,
    // });

    // this.certificate = new acm.Certificate(this, `${id}-acm_cert`, {
    //   domainName: "*.xpensemngr.com",
    //   validation: acm.CertificateValidation.fromDns(this.hostedZone),
    // });

    this.distribution = new cloudfront.Distribution(
      this,
      `${id}-cf_distribution`,
      {
        comment: `${id}-cf_distribution`,
        defaultBehavior: {
          origin: new cfOrigins.S3StaticWebsiteOrigin(this.webBucket.bucket),
        },
        priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
        // TODO (Valle) -> certificate needs to be in us-east-1
        // domainNames: ["www.xpensemngr.com"],
        // certificate: this.certificate,
      }
    );
  }
}

export class XpmS3BucketPublic extends Construct {
  public readonly bucket: s3.IBucket;
  public readonly policy: iam.PolicyStatement;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const bucketId = `${id}-bucket`;
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

    this.policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ["s3:GetObject"],
      principals: [new iam.AnyPrincipal()],
      resources: [`${this.bucket.bucketArn}/*`],
    });

    this.bucket.addToResourcePolicy(this.policy);
  }
}
