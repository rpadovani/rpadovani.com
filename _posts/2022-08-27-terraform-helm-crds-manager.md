---
layout: post
title:  "Managing Helm CRDs with Terraform"
date:   2022-08-27
description: "Introducing a Terraform module to manage Helm Custom Resource Definitions (CRDs) through code, to being able to manage Kubernetes deployments completely through GitOps."
categories:
- terraform
- helm
- kubernetes
permalink: terraform-helm-crds-manager
cover: https://img.rpadovani.com/posts/terraform-helm-crds-manager.png
---

Helm is a remarkable piece of technology to manage your Kubernetes deployments, and used along Terraform is perfect for deploying following the GitOps strategy.

<figure>
    <img src="https://img.rpadovani.com/posts/terraform-helm-crds-manager.png" alt="Terraform Helm CRDs manager" />
    <figcaption>
      <p><span>Illustration by <a href="https://plus.undraw.co/" target="_blank">unDraw+</a>.</span></p>
    </figcaption>
</figure>

<small>What's GitOps? Great question! As <a href="https://about.gitlab.com/topics/gitops/" target="_blank"> this helpful, introductory article summarize</a>, it is Infrastructure as Code, plus Merge Requests, plus Continuous Integration. Follow the link to explore further the concept.</small>

However, Helm has a limitation: [it doesn't manage the lifecycle of Custom Resource Definitions] (CRDs), meaning it will only install the CRD during the first installation of a chart. Subsequent chart upgrades will not add or remove CRDs, even if the CRDs have changed.

This can be a huge problem for a GitOps approach: having to update CRDs manually isn't a great strategy, and makes it very hard to keep in sync with deployments and rollbacks.

For this very reason, I created [a small Terraform module] that will read from some online manifests of CRDs, and apply them. When parametrizing the version of the chart, it is simple to keep Helm Charts and CRDs in sync, without having to do anything manually.

## Example

<small>Karpenter is an incredible open-source Kubernetes node provisioner built by AWS. If you haven't tried it yet, take some minutes to read about it.</small>

Let's use [Karpenter] as an example on how to use the module. We want to deploy the chart with the [Helm provider], and we use this new Terraform module to manage its CRDs as well:

```terraform
resource "helm_release" "karpenter" {
  name            = "karpenter"
  namespace       = "karpenter"
  repository      = "https://charts.karpenter.sh"
  chart           = "karpenter"
  version         = var.chart_version

  // ... All the other parameters necessary, skipping them here ...
}

module "karpenter-crds" {
  source  = "rpadovani/helm-crds/kubectl"
  version = "0.1.0"
  
  crds_urls = [
    "https://raw.githubusercontent.com/aws/karpenter/v${var.chart_version}/charts/karpenter/crds/karpenter.sh_provisioners.yaml",
    "https://raw.githubusercontent.com/aws/karpenter/v${var.chart_version}/charts/karpenter/crds/karpenter.k8s.aws_awsnodetemplates.yaml"
  ]
}
```

As you can see, we parametrize the version of the chart, so we can be sure to have the same version for CRDs as the Helm chart. Behind the curtains, Terraform will download the raw file, and apply it with `kubectl`. Of course, the operator running Terraform needs to have enough permissions to launch such scripts, so you need to [configure] the kubectl provider.

The URLs must point to just the Kubernetes manifests, and this is why we use the raw version of the GitHub URL.

The source code of the module is [available on GitHub], so you are welcome to chime in and open any issue: I will do my best to address problems and implement suggestions.

## Conclusion

I use this module in production, and I am very satisfied with it: it brings under GitOps the last part I missed: the CRDs. Now, my only task when I install a new chart is finding all the CRDs, and build a URL that contains the chart version. Terraform will take care of the rest.

I hope this module can be useful to you as it is to me. If you have any question, or feedback, or if you would like some help, please leave a comment below, or write me an email at [hello@rpadovani.com][email].

  
Ciao,  
R.

[it doesn't manage the lifecycle of Custom Resource Definitions]: https://helm.sh/docs/chart_best_practices/custom_resource_definitions/
[a small Terraform module]: https://registry.terraform.io/modules/rpadovani/helm-crds/kubectl/latest
[Karpenter]: https://github.com/aws/karpenter
[configure]: https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs#configuration
[available on GitHub]: https://github.com/rpadovani/terraform-kubectl-helm-crds
[Helm provider]: https://registry.terraform.io/providers/hashicorp/helm/latest/docs

[email]: mailto:hello@rpadovani.com

