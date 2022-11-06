---
layout: post
title:  "Exploring Gitlab Visual Reviews"
date:   2019-11-03 14:35
description: "With Visual Reviews, you can provide a feedback form to your Review Apps so that reviewers can post comments directly from the app back to the merge request that spawned the Review App."
categories:
- gitlab
permalink: gitlab-visual-reviews
---

With version 12.0 Gitlab [has introduced][gitlab-12] a new interesting feature: Visual Reviews! You can now leave comments to Merge Requests directly from the page you are visiting over your stage environment, without having to change tab.

If you already have Continuous Integration and Continuous Delivery enabled for your websites, adding this feature is blazing fast, and will make life of your reviewers easier!
<small>If you want to start with CI/CD in Gitlab, [I've written about it][past-blog-post] in the past.</small>

# The feature

While the [official documentation][official-doc] has a good overview of the feature, we can take a deeper look with some screenshots:

![Inserting a comment][img-visual-review]
<small>We can comment directly from the staging environment! And additional metadata will be collected and published as well, making easier to reproduce a bug.</small>

![Comment appears in the MR][img-mr-comment]
<small>Our comment (plus the metadata) appears in the merge request, becoming actionable.

<aside>
<p>
With Visual Reviews, you can provide a feedback form to your Review Apps so that reviewers can post comments directly from the app back to the merge request that spawned the Review App.
</p>
</aside>

# Implementing the system

Adding the snippet isn't complicate, you only need some information about the MR. Basically, this is what you should add to the head of your website for every merge request:

```html
<script
  data-project-id="CI_PROJECT_ID"
  data-merge-request-id="CI_MERGE_REQUEST_IID"
  data-mr-url='https://gitlab.example.com'
  data-project-path="CI_PROJECT_PATH"
  id='review-app-toolbar-script'
  src='https://gitlab.example.com/assets/webpack/visual_review_toolbar.js'>
</script>
```

Of course, asking your team to add the HTML snippet, and filling it with the right information isn't feasible. We will instead take advantage of [Gitlab CI/CD][gitlab-ci] to inject the snippet and autocomplete it with the right information for every merge request.

First we need the definition of a Gitlab CI job to build our client:

```yaml
buildClient:
  image: node:12
  stage: build
  script:
    - ./scripts/inject-review-app-index.sh
    - npm ci
    - npm run build
  artifacts:
    paths:
      - build
  only:
    - merge_requests
  cache:
    paths:
      - .npm
```

The important bit of information here is `only: merge_requests`. When used, Gitlab injects in the job a environment variable, called `CI_MERGE_REQUEST_IID`, with the unique ID of the merge request: we will fill it in the HTML snippet.
<small>The [official documentation][doc] of Gitlab CI explains in detail all the other keywords of the YAML.</small>

# The script

The other important bit is the script that actually injects the code: it's a simple bash script, which looks for the `</title>` tag in the HTML, and append the needed snippet:

```shell
#!/bin/sh

repl() {
  PATTERN=$1 REPL=$2 awk '
    {gsub(ENVIRON["PATTERN"], ENVIRON["REPL"]); print}'
}

TEXT_TO_INJECT=$(cat <<-HTML
</title>
<script
  data-project-id="${CI_PROJECT_ID}"
  data-merge-request-id="${CI_MERGE_REQUEST_IID}"
  data-mr-url='${CI_SERVER_URL}'
  data-project-path="${CI_PROJECT_PATH}"
  id='review-app-toolbar-script'
  src='${CI_SERVER_URL}/assets/webpack/visual_review_toolbar.js'>
</script>
HTML
)

repl "</title>" "${TEXT_TO_INJECT}" < public/index.html > tmpfile && mv tmpfile public/index.html

``` 

Thanks to the Gitlab CI environment variables, the snippet has already all the information it needs to work. Of course you should customize the script with the right path for your `index.html` (or any other page you have).

Now everything is ready! Your team needs only to generate [personal access tokens][pat] to login, and they are ready to go!
<small>You should store your personal access token in your password manager, so you don't need to generate it each time.</small>

# Future features

One of the coolest things in Gitlab is that everything is always a work in progress, and each feature has some new goodies in every release. This is true for the Visual Reviews App as well. There is an [epic][epic] that collects all the improvements they want to do, including [removing the need for an access token][issue-0], and [adding ability to take screenshots][issue-1] that will be inserted in the MR comments as well.

That's all for today, I hope you found this article useful! For any comment, feedback, critic, leave a comment below,
or drop an email at [riccardo@rpadovani.com](mailto:riccardo@rpadovani.com).

I have also changed the blog theme to a custom version of [Rapido.css][rapido]. I think it increases the readability, but let me know what you think! 

Ciao,  
R.

[gitlab-12]: https://about.gitlab.com/blog/2019/06/22/gitlab-12-0-released/
[past-blog-post]: https://rpadovani.com/aws-s3-gitlab
[official-doc]: https://docs.gitlab.com/ee/ci/review_apps/#visual-reviews-starter
[img-visual-review]: https://img.rpadovani.com/posts/visual-reviews/gitlab-visual-review.png
[img-mr-comment]: https://img.rpadovani.com/posts/visual-reviews/mr-comment.png
[gitlab-ci]: https://about.gitlab.com/product/continuous-integration/
[doc]: https://docs.gitlab.com/ee/ci/yaml/README.html
[pat]: https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html
[epic]: https://gitlab.com/groups/gitlab-org/-/epics/960
[issue-0]: https://gitlab.com/gitlab-org/gitlab/issues/29067
[issue-1]: https://gitlab.com/gitlab-org/gitlab/issues/10765
[rapido]: https://nextbitlabs.github.io/Rapido/

