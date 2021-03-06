---
layout: post
title:  "A generic introduction to Gitlab CI"
date:   2017-11-28 21:00
description: "A generic introduction to Gitlab CI and an overview on its features"
categories:
- gitlab
- gitlab ci
permalink: introduction-gitlab-ci
---

At [fleetster][fleetster] we have our own instance of [Gitlab][gitlab] and we
rely a lot on [Gitlab CI][gitlabci]. Also our designers and QA guys use (and
love) it, thanks to its advanced features.

Gitlab CI is a very powerful system of Continuous Integration, with a lot of
different features, and with every new releases, new features land. It has a
very rich technical documentation, but it lacks a generic introduction for whom
want to use it in an already existing setup. A designer or a tester doesn't need
to know how to autoscale it with Kubernetes or the difference between an `image`
or a `service`.

But still, they need to know what is a **pipeline**, and how to see a branch
deployed to an **environment**. In this article therefore I will try to cover as
many features as possible, highlighting how the end users can enjoy them; in the
last months I explained such features to some members of our team, also
developers: not everyone knows what Continuous Integration is or has used Gitlab
CI in a previous job.

If you want to know why Continuous Integration is important I suggest to read
[this article][why-ci], while for finding the reasons for using Gitlab CI
specifically, I leave the job to [Gitlab.com][gitlabci] itself.

## Introduction

Every time developers change some code they save their changes in a **commit**. 
They can then push that commit to Gitlab, so other developers can review the code.

Gitlab will also start some work on that commit, if the Gitlab CI has been
configured. This work is executed by a **runner**. A runner is basically a
server (it can be a lot of different things, also your PC, but we can simplify
it as a server) that executes instructions listed in the `.gitlab-ci.yml` file,
and reports the result back to Gitlab itself, which will show it in his
graphical interface.

When developers have finished implementing a new feature or a bugfix (activity
that usual requires multiple commits), can open a **merge request**, where other
member of the team can comment on the code and on the implementation.

As we will see, also designers and testers can (and really should!) join this
process, giving feedbacks and suggesting improvements, especially thanks to two
features of Gitlab CI: **environments** and **artifacts**.

## Pipelines

Every commit that is pushed to Gitlab generates a **pipeline** attached to that
commit. If multiple commits are pushed together the pipeline will be created
only for the last of them. A pipeline is a collection of **jobs** split in
different **stages**.

All the jobs in the same stage run in concurrency (if there are enough runners)
and the next stage begins only if all the jobs from the previous stage have
finished with success.

As soon as a job fails, the entire pipeline fails. There is an exception for
this, as we will see below: if a job is marked as _manual_, then a failure
will not make the pipeline fails.

The stages are just a logic division between batches of jobs, where doesn't make
sense to execute next jobs if the previous failed. We can have a `build` stage,
where all the jobs to build the application are executed, and a `deploy` stage,
where the build application is deployed. Doesn't make much sense to deploy
something that failed to build, does it?

Every job shouldn't have any dependency with any other job in the same stage,
while they can expect results by jobs from a previous stage.

Let's see how Gitlab shows information about stages and stages' status.

![pipeline-overview][pipeline-overview]

![pipeline-status][pipeline-status]

## Jobs

A job is a collection of instructions that a runner has to execute. You can see
in real time what's the output of the job, so developers can understand why a
job fails.

A job can be automatic, so it starts automatically when a commit is pushed, or
manual. A manual job has to be triggered by someone manually. Can be useful, for
example, to automatize a deploy, but still to deploy only when someone manually
approves it. There is a way to limit who can run a job, so only trustworthy
people can deploy, to continue the example before.

A job can also build **artifacts** that users can download, like it creates an
APK you can download and test on your device; in this way both designers and
testers can download an application and test it without having to ask for help
to developers.

Other than creating artifacts, a job can deploy an **environment**, usually
reachable by an URL, where users can test the commit.

Job status are the same as stages status: indeed stages inherit theirs status
from the jobs.

![running-job][running-job]

## Artifacts

As we said, a job can create an artifact that users can download to test. It can
be anything, like an application for Windows, an image generated by a PC, or an
APK for Android.

So you are a designer, and the merge request has been assigned to you: you need
to validate the implementation of the new design!

But how to do that?

You need to open the merge request, and download the artifact, as shown in the
figure.

Every pipeline collects all the artifacts from all the jobs, and every job can
have multiple artifacts. When you click on the download button, it will appear a
dropdown where you can select which artifact you want. After the review, you can
leave a comment on the MR.

You can always download the artifacts also from pipelines that do not have a
merge request open ;-)

I am focusing on merge request because usually is where testers, designer, and
shareholder in general enter the workflow.

But merge requests are not linked to pipelines: while they integrate nice one in
the other, they do not have any relation.

![download-artifacts][download-artifacts]

## Environments

In a similar way, a job can deploy something to an external server, so you can
reach it through the merge request itself.

As you can see the environment has a name and a link. Just clicking the link you
to go to a deployed version of your application (of course, if your team has
setup it correctly).

You can click also on the name of the environment, because Gitlab has also other
cool features for environments, like [monitoring][monitoring].

![environment][environment]

## Conclusion

This was a small introduction to some of the features of Gitlab CI: it is very
powerful, and using it in the right way allows all the team to use just one tool
to go from planning to deploying. A lot of new features are introduced every
month, so keep an eye on the [Gitlab blog][gitlab-blog].

For setting it up, or for more advanced features, take a look to the
[documentation][documentation-ci].

In fleetster we use it not only for running tests, but also for having automatic
versioning of the software and automatic deploys to testing environments. We
have automatized other jobs as well (building apps and publish them on the Play
Store and so on).

Speaking of which, **do you want to work in a young and dynamically office with
me and a lot of other amazing guys?** Take a look to the [open positions][jobs]
at fleetster!

Kudos to the Gitlab team (and others guys who help in their free time) for their
awesome work!

If you have any question or feedback about this blog post, please drop me an
email at [riccardo@rpadovani.com](mailto:riccardo@rpadovani.com) or [tweet me][twitter] :-)
Feel free to suggest me to add something, or to rephrase paragraphs in a clearer
way (English is not my mother tongue).

Bye for now,<br/>
R.

P.S: if you have found this article helpful and you'd like we write others, do
you mind to help us reaching the [Ballmer's peak][ballmer] and [buy me][donation] a beer?

[donation]: https://rpadovani.com/donations
[gitlab]: https://gitlab.com/
[gitlabci]: https://about.gitlab.com/gitlab-ci/
[fleetster]: https://www.fleetster.net
[jobs]: https://www.fleetster.net/fleetster-team.html
[why-ci]: https://about.gitlab.com/2015/02/03/7-reasons-why-you-should-be-using-ci/
[ballmer]: https://www.xkcd.com/323/
[gitlab-blog]: https://about.gitlab.com/
[documentation-ci]: https://docs.gitlab.com/ee/ci/README.html
[twitter]: https://twitter.com/rpadovani93
[pipeline-overview]: https://img.rpadovani.com/posts/pipeline-overview.png
[pipeline-status]: https://img.rpadovani.com/posts/pipeline-status.png
[running-job]: https://img.rpadovani.com/posts/running-job.png
[environment]: https://img.rpadovani.com/posts/environment.png
[download-artifacts]: https://img.rpadovani.com/posts/download-artifacts.png
[monitoring]: https://gitlab.com/help/ci/environments.md
