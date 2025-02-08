import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cfOrigins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";
import { WebappDeployment } from "./WebappDeployment";

export class XpmSinglePageWebapp extends Construct {
  hostedZone: route53.IHostedZone;
  certificate: acm.ICertificate;
  distribution: cloudfront.IDistribution;
  webBucket: XpmS3BucketPublic;
  deployment: WebappDeployment;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.webBucket = new XpmS3BucketPublic(this, `${id}-webapp`);

    // The certificate needs to be in us-east-1 region due to AWS limitations
    // Because we are hosting the app in eu-central-1, the certificate is deployed with the DnsStack
    const certificateArn =
      "arn:aws:acm:us-east-1:571600868208:certificate/7f17d2b7-0745-4651-a571-23338ad22db4";
    this.certificate = acm.Certificate.fromCertificateArn(
      this,
      "domainCert",
      certificateArn
    );

    this.distribution = new cloudfront.Distribution(
      this,
      `${id}-cf_distribution`,
      {
        comment: `${id}-cf_distribution`,
        defaultBehavior: {
          origin: new cfOrigins.S3StaticWebsiteOrigin(this.webBucket.bucket),
        },
        priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
        domainNames: ["www.xpensemngr.com", "xpensemngr.com"],
        certificate: this.certificate,
      }
    );

    this.deployment = new WebappDeployment(this, `${id}-webapp-deployment`, {
      bucketName: this.webBucket.bucket.bucketName,
      awsAccountId: cdk.Stack.of(this).account,
      cloudfrontDistributionId: this.distribution.distributionId,
    });
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
