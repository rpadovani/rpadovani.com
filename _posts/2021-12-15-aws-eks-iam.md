---
layout: post
title:  "The inconsistencies of AWS EKS IAM permissions"
date:   2021-12-15 10:00
description: "IAM permissions on AWS EKS are broken, and do not allow you to control access in a fine-grained way. How so?"
categories:
- aws
- security
permalink: eks-iam-permissions
cover: https://img.rpadovani.com/posts/undraw_bug_fixing_oc7a.png
---
 
AWS [EKS] is a remarkable product: it manages Kubernetes for you, letting you focussing on creating and deploying applications. However, if you want to manage permissions accordingly to the shared responsibility model, you are in for some wild rides.

<figure>
    <img src="https://img.rpadovani.com/posts/undraw_bug_fixing_oc7a.png" alt="cover" />
    <figcaption>
      <p><span>Image courtesy of <a href="https://undraw.co" target="_blank">unDraw.</a></span></p>
    </figcaption>
</figure>

## The shared responsibility model

First, what's the shared responsibility model? Well, to design a [well-architected application], AWS suggests following six pillars. Among these six pillars, one is **[security]**. Security includes sharing responsibility between AWS and the customer. In particular, and I [quote],

> Customers are responsible for managing their data (including encryption options), classifying their assets, and using IAM tools to apply the appropriate permissions.

Beautiful, isn't it? AWS gives us a powerful tool, IAM, to manage permissions; we have to configure things in the best way, and AWS gives us the way to do so. Or does it? Let's take a look together.

## Our goal

<small>I would say the goal is simple, but since we are talking about Kubernetes, things cannot be _just_ simple.</small>

Our goal is quite straightforward: setting up a Kubernetes cluster for our developers. Given that AWS offers AWS EKS, a managed Kubernetes service, we only need to configure it properly, and we are done. Of course, we will follow best practices to do so.


## A proper setup

<small>Infrastructure as code is out of scope for this post, but if you have never heard about it before, I strongly suggest taking a look into it.</small>

Of course, we don't use the AWS console to manually configure stuff, but [Infrastructure as Code]: basically, we will write some code that will call the AWS APIs on our behalf to set up AWS EKS and everything correlated. In this way, we can have a reproducible setup that we could deploy in multiple environments, and countless other advantages.

Moreover, we want to avoid launching scripts that interact with our infrastructure from our PC: we prefer not to have permissions to destroy important stuff! [Separation of concerns] is a fundamental, and we want to write code without worrying about having consequences on the real world. All our code should be vetted from somebody else through a merge request, and after being approved and merged to our _main_ branch, a runner will pick it up and apply the changes.

<small>A runner is any CI/CD that will execute the code on your behalf. In my case, it is a GitLab runner, but it could be any continuous integration system.</small>

We are at the core of the problem: our runner should follow the [principle of least privilege]: it should be able to do only what it needs to do, and nothing more. This is why we will create a IAM role only for it, with only the permissions to manage our EKS cluster and everything in it, but nothing more.

<small>I would have a massive rant about how bad is the AWS documentation for IAM in general, not only for EKS, but I will leave it to some other day.</small>

The first part of creating a role with minimum privileges is, well, understanding what _minimum_ means in our case. A starting point is the AWS documentation: unfortunately, it is always a **bad** starting point concerning IAM permissions, 'cause it is always too generous in allowing permissions.

## The “minimum” permission accordingly to AWS

According to the [guide], the minimum permissions necessary for managing a cluster is being able to do any action on any EKS resource. A bit farfetched, isn't it?

Okay, hardening this will be fun, but hey, do not let bad documentations get in the way of a proper security posture.

<aside><p>Do not let bad documentations get in the way of a proper security posture.</p></aside>

You know what will get in the way? Bugs! A ton of bugs, with absolutely useless error messages.

I started limiting access to only the namespace of the EKS cluster I wanted to create. I ingenuously thought that we could simply limit access to the resources belonging to the cluster. But, oh boy, I was mistaken!

Looking at the documentation for IAM resources and actions, I created this policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "eks:ListClusters",
                "eks:DescribeAddonVersions",
                "eks:CreateCluster"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": "eks:*",
            "Resource": [
                "arn:aws:eks:eu-central-1:123412341234:addon/my-cluster/*/*",
                "arn:aws:eks:eu-central-1:123412341234:fargateprofile/my-cluster/*/*",
                "arn:aws:eks:eu-central-1:123412341234:identityproviderconfig/my-cluster/*/*/*",
                "arn:aws:eks:eu-central-1:123412341234:nodegroup/my-cluster/*/*",
                "arn:aws:eks:eu-central-1:123412341234:cluster/my-cluster"
            ]
        }
    ]
}
```

Unfortunately, if a role with these permissions try to create a cluster, this error message appears:

```
Error: error creating EKS Add-On (my-cluster:kube-proxy): AccessDeniedException: User: arn:aws:sts::123412341234:assumed-role/<role>/<iam-user> is not authorized to perform: eks:TagResource on resource: arn:aws:eks:eu-central-1:123412341234:/createaddon
```

I have to say that at least the error message gives you a hint: the `/createddon` action is not scoped to the cluster.

After fighting with different polices for a while, I asked DuckDuckGo for a help, and indeed somebody reported this problem to AWS before, in [this GitHub issue].

What the issue basically says is that if we want to give an IAM role permission to manage an add-on inside a cluster, we must give it permissions over all the EKS add-ons in our AWS account.

This of course breaks the AWS shared responsibility principle, 'cause they don't give us the tools to upheld our part of the deal. This is why it is a real and urgent issue, as they also mention in the ticket: 

> Can't share a timeline in this forum, but it's a high priority item.

And indeed it is so high priority, that it has been reported the **3rd December 2020**, and today, more than one year later, the issue is still there.

To add insult to the injury, you have to write the right policy manually because if you use the IAM interface to select “Any resource” for the add-ons as in the screenshot below, it will generate the wrong policy! If you check carefully, the generated resource name is `arn:aws:eks:eu-central-1:123412341234:addon/*/*/*`, which of course doesn't match the ARN expected by AWS EKS. Basically, also if you are far too permissive, and you use the tools that AWS provides you, you still will have some broken policy.

![generate-addons-policy]

Do you have some horror story about IAM yourself? I have a lot of them, and I am thinking about a more general post. What do you think? Share your thoughts in the comments below, or drop me an email at [riccardo@rpadovani.com][email].
  
Ciao,  
R.

[email]: mailto:riccardo@rpadovani.com

[EKS]: https://aws.amazon.com/eks/
[this GitHub issue]: https://github.com/aws/containers-roadmap/issues/1172
[well-architected application]: https://aws.amazon.com/architecture/well-architected/
[security]: https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/welcome.html
[quote]: https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/shared-responsibility.html
[Infrastructure as Code]: https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/infrastructure-as-code.html
[Separation of concerns]: https://en.wikipedia.org/wiki/Separation_of_concerns
[principle of least privilege]: https://en.wikipedia.org/wiki/Principle_of_least_privilege
[guide]: https://docs.aws.amazon.com/eks/latest/userguide/security_iam_id-based-policy-examples.html#security_iam_id-based-policy-examples-console
[inspect it]: https://console.aws.amazon.com/iam/home#/policies/arn:aws:iam::aws:policy/AmazonEKSClusterPolicy%24jsonEditor
[generate-addons-policy]: https://img.rpadovani.com/posts/generate-eks-addons-policy.png
