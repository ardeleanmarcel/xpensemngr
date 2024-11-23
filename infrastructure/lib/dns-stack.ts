import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";

export class DnsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const hostedZone = new route53.HostedZone(this, `${id}-hosted_zone`, {
      zoneName: "xpensemngr.com",
      comment: `${id}-hosted_zone for xpensemngr.com`,
    });

    const certificate = new acm.Certificate(this, `${id}-acm_cert`, {
      domainName: "*.xpensemngr.com",
      subjectAlternativeNames: [
        "*.xpensemngr.com",
        "www.xpensemngr.com",
        "xpensemngr.com",
      ],
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });
  }
}
