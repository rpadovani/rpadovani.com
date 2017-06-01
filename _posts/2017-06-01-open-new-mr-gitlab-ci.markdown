---
layout: post
title:  "How to automatically create new MR on Gitlab with Gitlab CI"
date:   2017-06-01 12:00
description: "How to use Gitlab CI to open new MR for every new branch"
categories:
- gitlab
- gitlab ci
permalink: open-mr-gitlab-ci
---

At Fleetster we have our own instance of Gitlab and we rely a lot on Gitlab CI.
How can be otherwise? We are a small team, with a lot of different projects
(only in last month, we had more than 13.000 commits over 25 different projects,
and we are only 10 - and I work part time).

Automatizing as many development steps as possible (from build to QA to deploy)
is helping us a lot, but sometimes we do some work and then forget about it.
This is a disaster! We have some bugfix or some new feature ready, but it is
forgotten in some branch somewhere.

This is why we have, as policy, to push as soon as possible an to open a new MR,
mark it as WIP, and assign to ourself; in this way Gitlab will remember to
ourself we have a MR.

You need to do 3 steps to achieve that:

- Push the code
- Click on the link that appears on your terminal
- Fill a form

But we are nerd. We are lazy. So one night, after a couple of beers, Alberto
Urbano and I spent some hours to automatize a tasks that requires 10 seconds.

Actually, the experience was quite fun, it was the first time we used Gitlab
APIs and we learned things we will apply to others scripts as well.

![automation][automation]

## The script

With this script, every time we push a commit, Gitlab CI takes a look if the branch that
commit belongs to has already a opened MR and, if not, it creates it. It then
assigns the MR to you, and put WIP in the title to mark it as work in progress.

In this way you cannot forget about that branch, and when you've finished
writing code on it, you just need to remove the WIP from the title and assign to
the right person to review it.

In the end, this is the script we came out with:

```sh
#!/usr/bin/env bash
TARGET_BRANCH="develop";

# Extract the host where the server is running, and add the URL to the APIs
[[ $HOST =~ ^https?://[^/]+ ]] && HOST="${BASH_REMATCH[0]}/api/v4/projects/"

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
LISTMR=`curl --silent -X GET "${HOST}${CI_PROJECT_ID}/merge_requests?state=opened" --header "PRIVATE-TOKEN:${PRIVATE_TOKEN}"`;
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

Gitlab ci

Way to improve

Do you want to work in Fleetster?

Kudos to the Gitlab team (and others guys who help in their free time) for their
awesome work!

If you have any question or feedback about this blog post, please drop me an
email at [riccardo@rpadovani.com](mailto:riccardo@rpadovani.com) :-)

Bye for now,<br/>
A. & R.

[0]: http://www.archon.ai/
[1]: http://gitlab.com/
[2]: https://about.gitlab.com/gitlab-ci/
[3]: https://jekyllrb.com/
[4]: https://gitlab.com/gitlab-org/gitlab-ci-multi-runner
[5]: http://docs.gitlab.com/ce/ci/yaml/README.html
[6]: https://img.rpadovani.com/posts/gitlab/1.png
[7]: https://nextcloud.com/
[8]: https://img.rpadovani.com/posts/gitlab/2.png
[9]: https://gitlab.com/help/web_hooks/web_hooks
[10]: https://gitlab.com/profile/personal_access_tokens
[11]: https://gitlab.com/gitlab-org/gitlab-ce/issues/4255
[3b]: https://gitlab.com/rpadovani/rpadovani.com
