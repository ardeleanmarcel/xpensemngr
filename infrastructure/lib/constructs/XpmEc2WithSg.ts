import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

type Ec2WithSecurityGroupProps = {
  vpc: ec2.IVpc;
};

export class Ec2WithSecurityGroup extends Construct {
  public readonly ec2Instance: ec2.Instance;
  public readonly securityGroup: ec2.SecurityGroup;
  constructor(scope: Construct, id: string, props: Ec2WithSecurityGroupProps) {
    const ec2Id = `xpm-ec2-${id}`;
    const sgName = `xpm-ec2-${id}--sg`;
    const sshKeyId = `xpm-ec2-${id}--ssh-key`;

    super(scope, ec2Id);

    this.securityGroup = new ec2.SecurityGroup(this, sgName, {
      securityGroupName: sgName,
      vpc: props.vpc,
    });

    this.securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.HTTPS,
      "Allow inbound HTTPS traffic"
    );

    this.securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.HTTP,
      "Allow inbound HTTP traffic"
    );

    this.securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.SSH,
      "Allow inbound SSH traffic"
    );

    const keyPair = new ec2.KeyPair(this, `${sshKeyId}--manual`, {
      publicKeyMaterial:
        "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDfsCDobn2s8NLPisQtjrFR33hvrVMVvEILHoLbExqxBL92d+9Zra8pYuYpqDX3TaHJ3ZrYYlB8ta2hxBjiizf0HI4uSG8tz9uEv1GPJPVWmQbrLUhLNfX1HEtesKl38/VihiSWF3Fi8n0gFHnFGLxyal8uELRt+NtPnk9pIITGnPp73d09k2yjWaH+KZTS/+SfGnTdLvT/JOCxCOYvhp0PSmg+zJQhs2q0cWSxZebRNFvNqUaCqF0DNVE+BSi6lWjVzFnw/bAYsN84hfAj+hbKpFmIsmeEbWI4TfK/CmGU/EtxzqUuNRYayJkPt67+Py34wHXV2b3LXWm0z0i63yFS2eeLnfiyod0KnaUcMSOd3oBOl4wGi8pYh+3o0FwvAPmDTSPWKk9J0saz9yUxJRUCPvGPwuOSU8ng3MYog5UTEBLkp5E7IZa2R3r8gBZ91Jyus6Tw9ebZmpLWDnLZESV5kKoUPY64SEo/8H/fjkUIujlMvXPF8FoMvjPuAU0d0kDhYxioNYxk8C2ISnrpwEUkB50EGD0osj98UFcGOIIZo0Xw5Ub40g9/nQs0MX7hCwoSUDBNqbhMFttS72G3Kf9illJ7Ew8iI3PEHMKoyGgbuXsPNiQf9MJhoZ3TY/9LafLlYXEIgkiXpOGeIxmPb4kMKAmTQcx6n/e0uoFPBxRnGw== valle@Vallelica",
    });

    this.ec2Instance = new ec2.Instance(this, ec2Id, {
      vpc: props.vpc,
      vpcSubnets: {
        subnets: props.vpc.publicSubnets,
      },
      instanceType: new ec2.InstanceType("t3.micro"),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023,
      }),
      securityGroup: this.securityGroup,
      instanceName: ec2Id,
      keyPair,
    });
  }
}
