---
layout: post
title:  "A gentle guide to deploy a PyTorch model in production over AWS ECS with CI/CD."
date:   2020-11-01 17:30
description: "A step by step guide on how to properly deploy a PyTorch model in production 
over AWS Elastic Container Service."
categories:
- aws
- pytorch
permalink: pytorch-production-aws
---
 
Your team has provided you a PyTorch model, and they have asked you to make it available online, so their magic can be
used all around the world! How to do so? 

In this three parts tutorial we will see how to deploy such a model on AWS ECS, discussing different approaches, which
 technologies are available and what are our options. We will gather some best practices, based on real word
  experience in deploying models to production.

The first tutorial is about how to properly package the model inside a Docker image thanks to PyTorch Serve. While it
is not a hard task, there are some tricks and optimizations that are worth sharing, to make the Docker image as small
 as possible, and to make it faster to build.
 
The second tutorial is about how to configure AWS ECS with Fargate to host the Docker image: since there is no silver
 bullet, we analyze different setups, based on the kind of workload you are expecting. We minimize expenses, following AWS best practices about networking and security.
 
The third tutorial is about building a CI/CD system, and being able to have an always up-to-date testing environment, and a one-click deployment process for production. We use Gitlab CI, since I'm a huge fan, but it is easy to adapt the tutorial to other CI/CD tools.

Each tutorial is independent of the others, so if you are interested in just one of the topics, feel free to skip directly to it. 

No approach to a problem is perfect, so I'm eager to discuss with you about possible improvements to the workflow, or if you have a total different strategy, I'd be happy to have a talk with you. Feel free to reach me by email at [riccardo@rpadovani.com][email] or leave a comment below, for any kind of feedback, critic, or suggestion!
 
Ciao,  
R.

[email]: mailto:riccardo@rpadovani.com

