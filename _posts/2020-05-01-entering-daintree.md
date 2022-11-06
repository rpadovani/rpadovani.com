---
layout: post
title:  "Introducing Daintree.app: an opensource alternative implementation of the AWS console."
date:   2020-05-01 17:30
description: "Daintree is a website to manage some of your AWS resources: since this is an early preview, at the moment, it supports a subset of Networking, EC2, SQS, and SNS. Daintree does not aim to replace the original console, but would like to improve the user experience"
categories:
- aws
- daintree.app
permalink: introducing-daintree
---
 
[Daintree.app][daintree] is a website to manage some of your AWS resources: since this is an early preview, at the 
moment, it supports a subset of Networking, EC2, SQS, and SNS

The AWS Console is an amazing piece of software: it has hundreds of thousands of features, it is reliable, and it is 
the front end of an incredible world. However, as any software, it is not perfect: sometimes is a bit slow, so many 
features can be confusing, and it is clear it has evolved over time, so there are a lot of different styles, 
and if it would be made from scratch today, some choices would probably be different.

[Daintree][daintree] has born wanting to fix one particular problem of the AWS Console: the impossibility to see resources from 
multiple regions in the same view. 

I've starting working on it last month, and now I'm ready to publish a first version: it's still quite young and 
immature, but I'm starting using it to check some resources on AWS accounts I have access to.
A lot of features are still missing, of course, and if you like, [you can contribute to its development][contribute].

# Multiple region support

The main reason Daintree exists is to display resources from multiple regions in the same screen: why limiting to one, 
when you can have 25?

Also, changing enabled regions doesn't require a full page reload, but just a click on a flag: Daintree will smartly 
require resources from the freshly enabled regions. 

![multiple-regions](https://www.daintree.app/assets/features/multiple-regions.gif)

# Fast role switching

If you belong to an AWS organization, and you have multiple accounts, you probably switch often role: such operation 
on the original AWS console requires a full page reload, and it always brings you to the homepage.

On Daintree, changing roles will only reload the resources in the page you are currently in, without having to wait for 
a full page reload! 

![fast-role](https://www.daintree.app/assets/features/switch-role.gif)

# Coherent interface

Beauty is in the eye of the beholder, so claiming Daintree is more beautiful than the original console would be silly: 
however, Daintree has been built to be coherent: all the styling is made thanks to the [Gitlab UI project][gitlab-ui], 
and the illustrations are made by Katerina Limpitsouni from [unDraw][undraw].

This guarantees a coherent and polished experience all over the application. 

# Free software

Daintree is licensed under AGPL-3.0, meaning is truly free software: this way, everyone can contribute improving the 
experience of using it. The full source code is available over [Gitlab][gitlab-daintree].

The project doesn't have any commercial goal, and as explained in [the page about security][security], no trackers are 
present on the website. To help Daintree, you [can contribute][contribute] and spread the word! 

# Fast navigation

Daintree heavily uses Javascript (with Vue.js) to do not have to reload the page: also, it tries to perform as few 
operations as possible to keep always updated on your resources. In this way, you don't waste your precious time 
waiting for the page to load. 

# And much more!
 
While implementing Daintree, new features have been introduced to make life easier to whoever uses it. As an example, 
you can create Internet Gateway and attach them to a VPC in the same screen, without having to wait for the gateway to 
be created. Or, while visualizing a security groups, you can click on the linked security groups, without having to 
look for them or remember complicated IDs. If you have any idea on how to improve workflows, please [share it with 
developers][contribute]! 

# Supported components

Daintree is still at early stages of development, so the number of supported resources is quite limited. 
[You can report which feature you'd like to see to the developers, or you can implement them!][contribute]

Daintree allows to view VPCs, Subnets, Internet Gateways, Nat Gateways, Route Tables, Elastic IPs, Security Groups, 
Instances, SNS, and SQS. You can also create, delete, and edit some of these resources. 
Development is ongoing, so remember to check the [changelog][changelog] from time to time. 

What are you waiting? Go to [https://daintree.app][daintree] and enjoy your AWS resources in a way you haven't before!

Needless to say, Daintree website is not affiliated to Amazon, or AWS, or any of their subsidiaries. ;-)

For any comment, feedback, critic, suggestion on how to improve my English, leave me a comment below,
or drop an email at [riccardo@rpadovani.com](mailto:riccardo@rpadovani.com).
 
Ciao,  
R.

[gitlab-ui]: https://gitlab.com/gitlab-org/gitlab-ui
[daintree]: https://daintree.app
[contribute]: https://www.daintree.app/#/contribute
[undraw]: https://undraw.co/
[gitlab-daintree]: https://gitlab.com/rpadovani/daintree
[security]: https://www.daintree.app/#/security
[changelog]: https://www.daintree.app/#/changelog

