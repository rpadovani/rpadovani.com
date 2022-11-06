---
layout: post
title:  "Why K8s deployments need `matchLabels` keyword"
date:   2022-10-27
description: "Kubernetes deployment want you to specify the `matchLabel` field. But why? It should be able to infer it on its own. Let's deep dive and understand how it works."
categories:
- kubernetes
permalink: kubernetes-deployments
cover: https://img.rpadovani.com/posts/k8s-deployment.png
---

To create a Kubernetes deployment, we must specify the `matchLabels` field, even though its value must match the one we specify in the template. But why? Cannot Kubernetes be smart enough to figure it out without us being explicit?

<figure>
    <img src="https://img.rpadovani.com/posts/k8s-deployment.png" alt="A deep dive in K8s deployment matchLabels field" />
    <figcaption>
      <p><span>Illustration by <a href="https://plus.undraw.co/" target="_blank">unDraw+</a>.</span></p>
    </figcaption>
</figure>

<small>Did you know? K8s is short for Kubernetes 'cause there are 8 letters between K and S.</small>

A Kubernetes (K8s) [Deployment] provides a way to define how many replicas of a [Pod] K8s should aim to keep alive. I'm especially bothered by the Deployment spec's requirement that we must specify a label selector for pods, and that label selector must match the same labels we have defined in the template. Why can't we just define them once? Why can't K8s infer them on its own? As I will explain, there is actually a good reason. However, to understand it, you would have to go down a rabbit hole to figure it out.

## A deployment specification

Firstly, let's take a look at a simple deployment specification for K8s:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx # Why can't K8s figure it out on its own?
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest

```

This is a basic deployment, taken from the [official documentation], and here we can already see that we need to fill the `matchLabels` field.

What happens if we drop the _“selector”_ field completely?

```bash
➜ kubectl apply -f nginx-deployment.yaml
The Deployment "nginx-deployment" is invalid:
* spec.selector: Required value
```

Okay, so we need to specify a selector. Can it be different from the _“label”_ field in the _“template”_? I will try with:

```yaml
matchLabels:
      app: nginx-different
```

```bash
➜ kubectl apply -f nginx-deployment.yaml
The Deployment "nginx-deployment" is invalid: spec.template.metadata.labels: Invalid value: map[string]string{"app":"nginx"}: `selector` does not match template `labels`
```

<small>There are usually good reasons behind what it seems a not well-thought implementation, and this is true here as well, as we'll see.</small>

As expected, K8s doesn't like it, it must match the template. So, we must fill a field with a well-defined value. It really seems that a computer could do that for us, why do we have to specify it manually? It drives me crazy having to do something a computer could do without any problem. **Or could it**?

## Behind a deployment

<small>Probably, you may never need to manipulate ReplicaSet objects: use a [Deployment] instead, and define your application in the spec section.</small>

How does a deployment work? Behind the curtains, when you create a new deployment, K8s creates two different objects: a [Pod] definition, using as its specification what is available in the _“template”_ field of the [Deployment], and a [ReplicaSet]. You can easily verify this using `kubectl` to retrieve pods and replica sets _after_ you have created a deployment.

> A ReplicaSet's purpose is to maintain a stable set of replica Pods running at any given time. As such, it is often used to guarantee the availability of a specified number of identical Pods.

A ReplicaSet needs a _selector_ that specifies how to identify Pods it can acquire and manage: however, this doesn't explain why we must specify it, and why K8s cannot do it on its own. In the end, a Deployment is a high-level construct that should hide ReplicaSet quirks: such details shouldn't concern us, and the Deployment should take care of them on its own.

## Digging deeper

Understanding how a Deployment works doesn't help us find the reason of this particular behavior. Given that Googling doesn't seem to bring any interesting result on this particular topic, it's time to go to the source (literally): luckily, K8s is open source, so we can check its history on [GitHub].

Going back in time, we find out that, actually, K8s used to infer it the `matchLabels` field! The behavior was removed with `apps/v1beta2` (released with Kubernetes 1.8), through Pull Request [#50164]. Such pull request links to issue [#50339], that, however, has a very brief description, and lacks the reasoning behind such a choice.

<small>The linked issues are rich of technical details, and they have many comments. If you want to understand exactly how kubectl apply works, take a look!</small>

Luckily, other issues provide way more context, as [#26202]: it turns out, the main problem with defaulting is when in subsequent updates to the resource, labels are mutated: the patch operation is somehow fickle, and `apply` breaks when you update a label that was used as default.

Many other concerns have been described by [Brian Grant] in deep in the issue [#15894].

Basically, assuming a default value, creates many questions and concerns: what's the difference between explicitly setting a label as null, and leaving it empty? How to manage all the cases where users left the default, and now they want to update the resource to manage themselves the label (or the other way around)?

## Conclusion

Given that in K8s everything intend to be **declarative**, developers have chosen that explicit is better than implicit, especially for corner cases: specifying things explicitly allows a more robust validation on creation and update time, and remove some possible bugs that existed due to uncertainties caused by lack of clarity.

Shortly after dropping the defaulting behavior, developers also [made the labels immutable], to make sure behaviors were well-defined. Maybe in the future labels will be mutable again, but to have that working, somebody needs to design a well-though document explaining how to manage all the possible edge cases that could happen when a controller is updated.

I hope you found this deep dive into the question interesting. I spent some time on it, since I was very curious, and I hope that the next person with the same question can find this article and get an answer quicker than what it took me.

If you have any question, or feedback, please leave a comment below, or write me an email at [hello@rpadovani.com][email].

  
Ciao,  
R.

[Deployment]: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
[Pod]: https://kubernetes.io/docs/concepts/workloads/pods/
[official documentation]: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#creating-a-deployment
[ReplicaSet]: https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/
[GitHub]: https://github.com/kubernetes/kubernetes
[#50164]: https://github.com/kubernetes/kubernetes/pull/50164
[#50339]: https://github.com/kubernetes/kubernetes/issues/50339
[#26202]: https://github.com/kubernetes/kubernetes/issues/26202
[#15894]: https://github.com/kubernetes/kubernetes/issues/15894#issuecomment-222194015
[made the labels immutable]: https://github.com/kubernetes/kubernetes/issues/50808
[Brian Grant]: https://github.com/bgrant0607

[email]: mailto:hello@rpadovani.com
