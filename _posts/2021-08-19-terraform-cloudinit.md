---
layout: post
title:  "How to make Terraform waiting for cloud-init to finish on EC2 without SSH"
date:   2021-08-19 18:30
description: "Terraform is a powerful tool, but it doesn't have a way to wait for EC2 instances to be ready, instead of just created. We will see how to use AWS SSM to do just that."
categories:
- aws
- terraform
permalink: terraform-cloudinit
cover: https://img.rpadovani.com/posts/terraform_logo.png
---
 
[Terraform][terraform] is a powerful tool. However, it has some limitations: since it uses AWS APIs, it doesn't have a native way to check if an EC2 instance has completed to run [_cloud-init_][cloud-init] before marking it as ready. A possible workaround is asking Terraform to SSH on the instance, and wait until it is able to perform a connection before marking the instance as ready.

<figure>
    <img src="https://img.rpadovani.com/posts/terraform_logo.png" alt="cover" />
    <figcaption>
      <p><span>Terraform logo, courtesy of HashiCorp.</span></p>
    </figcaption>
</figure>

I find using SSH in Terraform quite problematic: you need to distribute a private SSH key to anybody that will launch the Terraform script, including your CI/CD system. This is a no-go for me: it adds the complexity to manage SSH keys, including their rotation. There is a huge [issue][github-issue] on the Terraform repo on GitHub about this functionality, and the most voted solution is indeed connecting via SSH to run a check:

```terraform
provisioner "remote-exec" {
  inline = [
    "cloud-init status --wait"
  ]
}
```

# AWS Systems Manager Run Command

The idea of using `cloud-init status --wait` is indeed quite good. The only problem is **how** do we ask Terraform to run such command. Luckily for us, AWS has a service, [AWS SSM Run Command][aws-ssm] that allow us to run commands on an EC2 instance through AWS APIs! In this way, our CI/CD system needs only an appropriate [IAM role][aws-iam], and a way to invoke AWS APIs. I use the [AWS CLI][aws-cli] in the examples below, but you can adapt them to any language you prefer.

## Prerequisites

<small>If you don't know AWS SSM yet, go and take a look to their [introductory guide.][aws-ssm-intro]</small>
There are some prerequisites to use AWS SSM Run Command: we need to have AWS SSM Agent installed on our instance. It is preinstalled on _Amazon Linux 2_ and _Ubuntu 16.04_, _18.04_, and _20.04_. For any other OS, we need to install it manually: it is supported on [Linux][aws-ssm-linux], [macOS][aws-ssm-mac], and [Windows][aws-ssm-windows].

The user or the role that executes the Terraform code needs to be able to create, update, and read AWS SSM Documents, and run SSM commands. A possible policy could be look like this:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "Stmt1629387563127",
      "Action": [
        "ssm:CreateDocument",
        "ssm:DeleteDocument",
        "ssm:DescribeDocument",
        "ssm:DescribeDocumentParameters",
        "ssm:DescribeDocumentPermission",
        "ssm:GetDocument",
        "ssm:ListDocuments",
        "ssm:SendCommand",
        "ssm:UpdateDocument",
        "ssm:UpdateDocumentDefaultVersion",
        "ssm:UpdateDocumentMetadata"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
```

If we already know the name of the documents, or the instances where we want to run the commands, it is better to lock down the policy specifying the resources, accordingly to the [principle of least privilege][least-privilege].

Last but not least, we need to have the AWS CLI installed on the system that will execute Terraform.

## The Terraform code

After having set up the prerequisites as above, we need two different Terraform resources. The first will create the AWS SSM Document with the command we want to execute on the instance. The second one will execute such command while provisioning the EC2 instance.

The AWS SSM Document code will look like this:

```terraform
resource "aws_ssm_document" "cloud_init_wait" {
  name = "cloud-init-wait"
  document_type = "Command"
  document_format = "YAML"
  content = <<-DOC
    schemaVersion: '2.2'
    description: Wait for cloud init to finish
    mainSteps:
    - action: aws:runShellScript
      name: StopOnLinux
      precondition:
        StringEquals:
        - platformType
        - Linux
      inputs:
        runCommand:
        - cloud-init status --wait
    DOC
}
```

We can refer such document from within our EC2 instance resource, with a local provisioner:

```terraform
resource "aws_instance" "example" {
  ami           = "my-ami"
  instance_type = "t3.micro"

  provisioner "local-exec" {
    interpreter = ["/bin/bash", "-c"]

    command = <<-EOF
    set -Ee -o pipefail
    export AWS_DEFAULT_REGION=${data.aws_region.current.name}

    command_id=$(aws ssm send-command --document-name ${aws_ssm_document.cloud_init_wait.arn} --instance-ids ${self.id} --output text --query "Command.CommandId")
    if ! aws ssm wait command-executed --command-id $command_id --instance-id ${self.id}; then
      echo "Failed to start services on instance ${self.id}!";
      echo "stdout:";
      aws ssm get-command-invocation --command-id $command_id --instance-id ${self.id} --query StandardOutputContent;
      echo "stderr:";
      aws ssm get-command-invocation --command-id $command_id --instance-id ${self.id} --query StandardErrorContent;
      exit 1;
    fi;
    echo "Services started successfully on the new instance with id ${self.id}!"

    EOF
  }
}
```

From now on, Terraform will wait for cloud-init to complete before marking the instance ready.

# Conclusion

AWS Session Manager, AWS Run Commands, and the others tools in the AWS Systems Manager family are quite powerful, and in my experience they are not widely use. I find them extremely useful: for example, they also allows connecting via [SSH to the instances][aws-ssm-ssh] without having any port open, included the 22! Basically, they allow managing and running commands inside instances only through AWS APIs, with a lot of benefits, as [they explain][session-manager]:

> Session Manager provides secure and auditable instance management without the need to open inbound ports, maintain bastion hosts, or manage SSH keys. Session Manager also allows you to comply with corporate policies that require controlled access to instances, strict security practices, and fully auditable logs with instance access details, while still providing end users with simple one-click cross-platform access to your managed instances.


DO you have any questions, feedback, critics, request for support? Leave a comment below, reach me on Twitter ([@rpadovani93][twitter]) or drop me an email at [riccardo@rpadovani.com][email].
  
Ciao,  
R.

[twitter]: https://twitter.com/rpadovani93
[email]: mailto:riccardo@rpadovani.com

[github-issue]: https://github.com/hashicorp/terraform/issues/4668
[aws-ssm]: https://docs.aws.amazon.com/systems-manager/latest/userguide/execute-remote-commands.html
[aws-cli]: https://aws.amazon.com/cli/
[aws-ssm-intro]: https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html
[aws-ssm-linux]: https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-ssm-agent.html
[aws-ssm-mac]: https://docs.aws.amazon.com/systems-manager/latest/userguide/install-ssm-agent-macos.html
[aws-ssm-windows]: https://docs.aws.amazon.com/systems-manager/latest/userguide/sysman-install-ssm-win.html
[least-privilege]: https://en.wikipedia.org/wiki/Principle_of_least_privilege
[aws-ssm-ssh]: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-getting-started-enable-ssh-connections.html
[session-manager]: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html
[terraform]: https://www.terraform.io/
[cloud-init]: https://cloud-init.io/
[aws-iam]: https://aws.amazon.com/iam/
