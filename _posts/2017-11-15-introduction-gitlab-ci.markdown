---
layout: post
title:  "A generic introduction to Gitlab CI"
date:   2017-11-15 23:00
description: "A generic introduction to Gitlab CI and its terms"
categories:
- gitlab
- gitlab ci
permalink: introduction-gitlab-ci
---

As someone maybe know, we at [fleetster][fleetster] we have our own instance  of
[Gitlab][gitlab] and we rely a lot on [Gitlab CI][gitlabci]. Also our designers
and QA guys use (and love) it.

Gitlab CI is a very powerful system of Continuous Integration, with a lot of
different features, and with every new releases, new features land. It has a
very rich technical documentation, but it lacks a generic introduction for whom
want to use it in an already existing setup. A designer or a tester doesn't need
to know how to autoscale it with Kubernetes or the difference between an `image`
or a `service`.

But still, he needs to know what is a **pipeline**, and how to see a branch
deployed to an **environment**. In this article therefore I will try to cover as
many features as possible, highlighting how the end users can enjoy them; in the
last months I explained such features to some members of our team, also
developers: not everyone knows what Continuous Integration is or has used Gitlab
CI in a previous job.

If you want to know why Continuous Integration is important I suggest to read
[this article][why-ci], while for finding the reasons for using Gitlab CI
specifically, I leave the job to [Gitlab.com][gitlabci] itself.

## Introduction

With this script, every time we push a commit, Gitlab CI takes a look if the
branch that commit belongs to has already a opened MR and, if not, it creates
it. It then assigns the MR to you, and put **WIP** in the title to mark it as
work in progress.

In this way you cannot forget about that branch, and when you've finished
writing code on it, you just need to remove the WIP from the title and assign to
the right person to review it.

In the end, this is the script we came out with (when you add to your project,
remember to make it executable):

```sh
#!/usr/bin/env bash
# Extract the host where the server is running, and add the URL to the APIs
[[ $HOST =~ ^https?://[^/]+ ]] && HOST="${BASH_REMATCH[0]}/api/v4/projects/"

# Look which is the default branch
TARGET_BRANCH=`curl --silent "${HOST}${CI_PROJECT_ID}" --header "PRIVATE-TOKEN:${PRIVATE_TOKEN}" | python3 -c "import sys, json; print(json.load(sys.stdin)['default_branch'])"`;

# The description of our new MR, we want to remove the branch after the MR has
# been closed
BODY="{
    \"id\": ${CI_PROJECT_ID},
    \"source_branch\": \"${CI_COMMIT_REF_NAME}\",
    \"target_branch\": \"${TARGET_BRANCH}\",
    \"remove_source_branch\": true,
    \"title\": \"WIP: ${CI_COMMIT_REF_NAME}\",
    \"assignee_id\":\"${GITLAB_USER_ID}\"
}";

# Require a list of all the merge request and take a look if there is already
# one with the same source branch
LISTMR=`curl --silent "${HOST}${CI_PROJECT_ID}/merge_requests?state=opened" --header "PRIVATE-TOKEN:${PRIVATE_TOKEN}"`;
COUNTBRANCHES=`echo ${LISTMR} | grep -o "\"source_branch\":\"${CI_COMMIT_REF_NAME}\"" | wc -l`;

# No MR found, let's create a new one
if [ ${COUNTBRANCHES} -eq "0" ]; then
    curl -X POST "${HOST}${CI_PROJECT_ID}/merge_requests" \
        --header "PRIVATE-TOKEN:${PRIVATE_TOKEN}" \
        --header "Content-Type: application/json" \
        --data "${BODY}";

    echo "Opened a new merge request: WIP: ${CI_COMMIT_REF_NAME} and assigned to you";
    exit;
fi

echo "No new merge request opened";
```

## Gitlab CI

The variables used in the script are passed to it by our *.gitlab_ci.yml* file:

```
stages:
    - openMr
    - otherStages

openMr:
    before_script: []   # We do not need any setup work, let's remove the global one (if any)
    stage: openMr
    only:
      - /^feature\/*/   # We have a very strict naming convention
    script:
        - HOST=${CI_PROJECT_URL} CI_PROJECT_ID=${CI_PROJECT_ID} CI_COMMIT_REF_NAME=${CI_COMMIT_REF_NAME} GITLAB_USER_ID=${GITLAB_USER_ID} PRIVATE_TOKEN=${PRIVATE_TOKEN} ./utils/autoMergeRequest.sh # The name of the script

```


All these environment variables are set by Gitlab itself, but the PRIVATE-TOKEN.
A master of the project has to create it in its own profile and add to the
project settings.

To create the personal token you can go to `/profile/personal_access_tokens` on
your Gitlab instance, and then you add to your pipeline following [this
guide][secrettoken]

## Way to improve

The script is far from perfect.

First of all, it has 2 APIs calls, one to take the list of MR and one to take
the default branch, to use it as target. Of course you can hardcode the value
(in the end it shouldn't change often), but hardcoding is always bad.

Also, it uses python3 to extract the name of the target branch - this is just
one of many possible solutions, just use what is available on your system.
Apart from that, the script doesn't have any external dependency.

The other thing is how you need to set up the secret token to call the APIs.
Luckily, Gitlab's developers are working on a [new way][newway] to manage secret
token.

## Conclusion

This was a very small and very simple example about how much powerful the
Continuous Integration can be. It takes some time to setup everything, but in
the long run it will save your team a lot of headache.

In fleetster we use it not only for running tests, but also for having automatic
versioning of the software and automatic deploys to testing environments. We are
working to automatize other jobs as well (building apps and publish them on the
Play Store and so on).

Speaking of which, **do you want to work in a young and dynamically office with
me and a lot of other amazing guys?** Take a look to the [open positions][jobs]
at fleetster!

Kudos to the Gitlab team (and others guys who help in their free time) for their
awesome work!

If you have any question or feedback about this blog post, please drop me an
email at [riccardo@rpadovani.com](mailto:riccardo@rpadovani.com) :-)

Bye for now,<br/>
A. & R.

P.S: if you have found this article helpful and you'd like we write others, do
you mind to help us reaching the Ballmer's peak and [buy us][donation] a beer?

[donation]: https://rpadovani.com/donations
[gitlab]: https://gitlab.com/
[gitlabci]: https://about.gitlab.com/gitlab-ci/
[fleetster]: https://www.fleetster.net
[automation]: https://img.rpadovani.com/posts/automation.png
[alberto]: https://www.linkedin.com/in/alberto-urbano-047a4b19
[secrettoken]: http://docs.gitlab.com/ce/ci/variables/README.html#secret-variables
[newway]: https://gitlab.com/gitlab-org/gitlab-ce/issues/12729
[jobs]: https://www.fleetster.net/fleetster-team.html
[why-ci]: https://about.gitlab.com/2015/02/03/7-reasons-why-you-should-be-using-ci/
