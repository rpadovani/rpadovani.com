---
layout: post
title:  "Fail a Gitlab pipeline when code coverage decreases"
date:   2020-11-18 09:00
description: "Testing is an important step of development - how to enforce a good code coverage through CI/CD?"
categories:
- gitlab
permalink: gitlab-code-coverage
cover: https://img.rpadovani.com/posts/gitlab/pankaj-patel-ZV_64LdGoao-unsplash.jpg
---
 
Automatic and continuous testing is a fundamental part of today's development cycle. Given a Gitlab pipeline that runs for each commit, we should enforce not only all tests are passing, but also that a sufficient number of them are present.

<figure>
    <img src="https://img.rpadovani.com/posts/gitlab/pankaj-patel-ZV_64LdGoao-unsplash.jpg" alt="cover" />
    <figcaption>
      <p><span>Photo by <a href="https://unsplash.com/@pankajpatel?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Pankaj Patel</a> on <a href="https://unsplash.com/s/photos/gitlab?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span></p>
    </figcaption>
  </figure>
  
<small>Aren't you convinced yet? Read [4 Benefits of CI/CD][benefits-ci-cd]!</small>
If you don't have a proper Gitlab pipeline to lint your code, run your test, and manage all that other annoying small tasks, you should definitely create one! I've written an [introductory guide to Gitlab CI][introduction-gitlab-ci], and many more are available on the [documentation website][gitlab-ci-documentation].

While there isn't (unfortunately!) a magic wand to highlight if the code is covered by enough tests, and, in particular, if these tests are of a sufficient good quality, we can nonetheless find some valuable KPI we can act on. Today, we will check **code coverage**, what indicates, what does not, and how it can be helpful.

# Code coverage

<section>
<blockquote cite="https://en.wikipedia.org/wiki/Code_coverage"><p>In computer science, test coverage is a measure used to describe the degree to which the source code of a program is executed when a particular test suite runs. A program with high test coverage, measured as a percentage, has had more of its source code executed during testing, which suggests it has a lower chance of containing undetected software bugs compared to a program with low test coverage.
</p></blockquote>
<cite>Wikipedia</cite>
</section>

Basically, code coverage indicates how much of your code has been executed while your tests were running. Personally, I don't find a high code coverage a significant measure: if tests are fallacious, or they run only on the happy path, the code coverage percentage will be high, but **the tests will not actually guarantee a high quality of the code**.

On the other hand, a **low code coverage is definitely worrisome**, because it means some parts of the code aren't tested at all. Thus, code coverage has to be taken, as every other KPI based only exclusively on lines of code, with a grain of salt.

<aside><p>High code coverage doesn't guarantee a high quality test suite, but a low code coverage definitely highlights a problem in the testing process.</p></aside>

# Code coverage and Gitlab

Gitlab allows collecting code coverage from test suites directly from pipelines. Major information on the setup can be found in the [pipelines guide][pipelines-guide] and in the [Gitlab CI reference guide][gitlab-ci-reference]. Since there are lots of different test suites out there, I cannot include how to configure them here. However, if you need any help, feel free to reach out to me at the contacts reported below.

<small>With Gitlab 13.5 there is also a Test Coverage Visualization tool, [check it out][test-coverage-visualization]!</small>
Gitlab will also report code coverage statistic for pipelines over time in nice graphs under *Project Analytics* > *Repository*. Data can also be exported as *csv*! We will use such data to check if, in the commit, the code coverage decreased comparing to the main branch.

This means that every new code written has to be tested at least as much as the rest of the code is tested. Of course, this strategy can be easily changed. The check is only one line of bash, and can be easily be replaced with a fixed number, or any other logic.
 
# The Gitlab Pipeline Job

The job that checks the coverage runs in a stage after the testing stage. It uses alpine as base, and curl and jq to query the APIs and read the code coverage.

<small>On self hosted instances, or on Gitlab.com Bronze or above, you should use a [project access token][project-access-token] to give access to the APIs. On Gitlab.com Free, use a [personal access token][personal-access-token]. If the project is public, the API are accessible without any token.</small>
It needs three variables: the name of the job which generates the code coverage percentage (`JOB_NAME`), the target branch to compare the coverage with (`TARGET_BRANCH`), and a private token to read the APIs (`PRIVATE_TOKEN`). The job will not run when the pipeline is running on the target branch, since it would be comparing the code coverage with itself, wasting minutes of runners for nothing.

The last line is the one providing the logic to compare the coverages.

```yaml
checkCoverage:
    image: alpine:latest
    stage: postTest
    variables:
        JOB_NAME: testCoverage
        TARGET_BRANCH: main
    before_script:
        - apk add --update --no-cache curl jq
    rules:
      - if: '$CI_COMMIT_BRANCH != $TARGET_BRANCH' 
    script:
        - TARGET_PIPELINE_ID=`curl -s "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/pipelines?ref=${TARGET_BRANCH}&status=success&private_token=${PRIVATE_TOKEN}" | jq ".[0].id"`
        - TARGET_COVERAGE=`curl -s "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/pipelines/${TARGET_PIPELINE_ID}/jobs?private_token=${PRIVATE_TOKEN}" | jq --arg JOB_NAME "$JOB_NAME" '.[] | select(.name==$JOB_NAME) | .coverage'`
        - CURRENT_COVERAGE=`curl -s "${CI_API_V4_URL}/projects/${CI_PROJECT_ID}/pipelines/${CI_PIPELINE_ID}/jobs?private_token=${PRIVATE_TOKEN}" | jq --arg JOB_NAME "$JOB_NAME" '.[] | select(.name==$JOB_NAME) | .coverage'`
        - if  [ "$CURRENT_COVERAGE" -lt "$TARGET_COVERAGE" ]; then echo "Coverage decreased from ${TARGET_COVERAGE} to ${CURRENT_COVERAGE}" && exit 1; fi;
```

This simple job works both on Gitlab.com and on private Gitlab instances, for it doesn't hard-code any URL.

Gitlab will now block merging merge requests without enough tests! Again, code coverage is not the magic bullet, and you shouldn't strive to have 100% of code coverage: better fewer tests, but with high quality, than more just for increasing the code coverage. In the end, a human is always the best reviewer. However, a small memo to write just one more test is, in my opinion, quite useful ;-)

Questions, comments, feedback, critics, suggestions on how to improve my English? Reach me on Twitter ([@rpadovani93][twitter]) or drop me an email at [riccardo@rpadovani.com][email].
  
Ciao,  
R.

[twitter]: https://twitter.com/rpadovani93
[email]: mailto:riccardo@rpadovani.com
[introduction-gitlab-ci]: http://localhost:4000/introduction-gitlab-ci
[benefits-ci-cd]: https://about.gitlab.com/blog/2019/06/27/positive-outcomes-ci-cd/
[gitlab-ci-documentation]: https://docs.gitlab.com/ee/ci/README.html
[pipelines-guide]: https://docs.gitlab.com/ee/ci/pipelines/settings.html#test-coverage-parsing
[gitlab-ci-reference]: https://docs.gitlab.com/ee/ci/yaml/#coverage
[test-coverage-visualization]: https://docs.gitlab.com/ee/user/project/merge_requests/test_coverage_visualization.html
[project-access-token]: https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html
[personal-access-token]: https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html
