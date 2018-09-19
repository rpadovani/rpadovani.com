---
layout: post
title:  "AWS S3 + GitLab CI = automatic deploy for every branch of your static website"
date:   2018-04-23 14:30
description: "How to use AWS S3 and GitLab CI to automatize deployment of every branch of your static website "
categories:
- gitlab
- aws
permalink: aws-s3-gitlab
---

You have a static website and you want to share to your team the last changes
you have done, before going online! How to do so?

If you use [GitLab][gitlab] and you have an account AWS, it's time to step up
your game and automatize everything. We are going to setup a system which will
deploy every branch you create to S3, and clean up after yourself when the
branch is merged or deleted.

AWS S3 is just a storage container, so of course you can't host in this way a
dynamic website, but for a static one (as this blog), it is perfect.

Also, please note that AWS S3 buckets for hosting a website **are public**, and
while you need to know the URL to access it, there are way to list them. So do
**not set up this system if you have private data on your website**.

Of course, standard [S3 prices][s3-prices] will apply.

We will use [GitLab CI][gitlabci], since it is shipped with GitLab and deeply
integrated with it.

Gitlab CI is a very powerful system of Continuous Integration, with a lot of
different features, and with every new releases, new features land. It has a
rich technical [documentation][cidoc] that I suggest you reading.

If you want to know why Continuous Integration is important I suggest reading
[this article][why-ci], while for finding the reasons for using Gitlab CI
specifically, I leave the job to [Gitlab.com][gitlabci] itself. I've also
written [another article][introduction-ci] with a small introduction to Gitlab
CI.

I suppose you already have an AWS account and you know a bit how GitLab CI
works. If not, please create an account and read some of the links above to
learn about GitLab CI.

## Setting up AWS

First thing is setting up AWS S3 and a dedicated IAM user to push to S3.

Since every developer with permissions to push to the repository will have
access to the tokens of the IAM use, it is better to limit its permissions as
much as possible.

### Setting up S3

To set up S3, go to [S3 control panel](s3), create a new bucket, choose a name
(from now on, I will use **example-bucket**) and a region, and finish the
creation leaving the default settings.

After that, you need to enable the website management: go to **Bucket** ->
**Properties** and enable *Static website hosting*, selecting *Use this bucket
to host a website* as in the image. As index, put `index.html` - you can then
upload a landing page there, if you want.

Take note of the bucket's URL, we will need it.

![s3 bucket creation][s3-bucket-image]

We now grant permissions to read objects to everybody; we will use the policy
described in the [AWS guide][s3-doc-permissions]. For other information on how
to host a static website, please follow [the official documentation][s3-doc-host-website].

To grant the read permissions, go to **Permissions**->**Bucket policy** and insert:

```json
{
  "Version":"2012-10-17",
  "Statement":[{
    "Sid":"PublicReadGetObject",
    "Effect":"Allow",
	  "Principal": "*",
    "Action":["s3:GetObject"],
    "Resource":["arn:aws:s3:::example-bucket/*"]
  }]
}
```

Of course, you need to insert your bucket's name in the `Resource` line.

### Creating the IAM user

Now we need to create the IAM user that will upload content to the S3 bucket,
with a policy that allows only upload to our GitLab bucket.

Go to [IAM][iam] and create a new policy, with the name you prefer:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::example-bucket/*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "s3:ListObjects",
            "Resource": "*"
        }
    ]
}
```

Of course, again, you should change the `Resource` field to the name of your
bucket. If you know the GitLab runners' IPs, you can restrict the policy to that
IPs.

Now you can create a new user granting it **Programmatic access**. I will call
it **gitlabs3uploader**. Assign it the policy we just created.

![iam user creation][iam-user-pic]

For more information on how to manage multiple AWS accounts for security
reasons, I leave you to the [official guide][aws-guide].

## Setting up GitLab CI

We need to inject the credentials in the GitLab runner. Go to your project,
**Settings** -> **CI / CD** -> **Secret variables** and set two variables:

- **AWS_ACCESS_KEY_ID** with the new user's access key
- **AWS_SECRET_ACCESS_KEY** with the new user's access secret key

Since we want to publish every branch, we do not set them as `protected`,
because they need to be available in every branch.

![secret variables config][cd-config-pic]

### .gitlab-ci.yml

We now need to explain GitLab how to publish the website. If you need to build
it before, you can do so. `rpadovani.com` uses Jekyll, so my `.gitlab-ci.yml`
file is like this:

```yml
image: "registry.gitlab.com/rpadovani/rpadovani.com:latest" # Custom Ruby image, replace with whatever you want
stages:
  - build
  - deploy

variables:
  AWS_DEFAULT_REGION: eu-central-1 # The region of our S3 bucket
  BUCKET_NAME: bucket-name         # Your bucket name

cache:
  paths:
    - vendor

buildJekyll:  # A job to build the static website - replace it with your build methods
  stage: build
  script:
    - bundle install --path=vendor/
    - bundle exec jekyll build --future # The server is in another timezone..
  artifacts:
    paths:
      - _site/  # This is what we want to publish, replace with your `dist` directory

deploys3:
  image: "python:latest"  # We use python because there is a well-working AWS Sdk
  stage: deploy
  dependencies:
    - buildJekyll      # We want to specify dependencies in an explicit way, to avoid confusion if there are different build jobs
  before_script:
    - pip install awscli # Install the SDK
  script:
    - aws s3 cp _site s3://${BUCKET_NAME}/${CI_COMMIT_REF_SLUG} --recursive # Replace example-bucket with your bucket
  environment:
    name: ${CI_COMMIT_REF_SLUG}
    url: http://${BUCKET_NAME}.s3-website.${AWS_DEFAULT_REGION}.amazonaws.com/${CI_COMMIT_REF_SLUG}  # This is the url of the bucket we saved before
    on_stop: clean_s3 # When the branch is merged, we clean up after ourself

clean_s3:
  image: "python:latest"
  stage: deploy
  before_script:
    - pip install awscli
  script:
    - aws s3 rm s3://${BUCKET_NAME}/${CI_COMMIT_REF_SLUG} --recursive # Replace example-bucket with your bucket
  environment:
    name: ${CI_COMMIT_REF_SLUG}
    action: stop
  when: manual
```

For more information about dynamic environments, see the [documentation][env-doc].

To verify your `.gitlab-ci.yml` is correct, go to your project on GitLab, then
**CI / CD** -> **Pipelines**, and in the top right of the page there is a **CI
Lint** link. It does not only lint your code, but it also creates a nice
overview of all your jobs.

![ci lint][ci-lint-pic]

Thanks to the environments, we will have the link to the test deployment
directly in the merge request, so your QA team, and every other stakeholder
interested in seeing the website before going to production, can do it directly
from GitLab.

![Merge request overview][env-pic]

Also, after you merge your branch, GitLab will clean after itself, so you do not
have useless websites in S3.

You can also see all the deployments in **CI / CD** -> **Environments**, and
trigger new deploys.

## Conclusion

They say 2018 is [the year for DevOps][devops-blog]. I am not sure about that,
but I am sure that a well configured Continuous Integration and Continuous
Delivery system save you and your company a lot of time and headaches.

If your builds are [perfectly reproducibly][rep-builds], and everything is
automatic, you can focus on what really matters: developing solutions for your
customers.

This was a small example on how to integrate AWS and GitLab, but you know the
only limit is your fantasy. Also, a lot of new features are introduced every
month in Gitlab and GitLab CI, so keep an eye on the [Gitlab blog][gitlab-blog].

Kudos to the Gitlab team (and others guys who help in their free time) for their
awesome work!

If you have any question or feedback about this blog post, please drop me an
email at [riccardo@rpadovani.com](mailto:riccardo@rpadovani.com) or [tweet me][twitter] :-)
Feel free to suggest me to add something, or to rephrase paragraphs in a clearer
way (English is not my mother tongue).

Bye for now,<br/>
R.

## Updates

This post has been last updated on the 19th September 2018 to fix the S3 bucket 
URL in the `.gitlab-ci.yml` file, thanks to [James Delaney][james]

[james]: https://www.overflowingcubby.com/
[donation]: https://rpadovani.com/donations
[gitlab]: https://gitlab.com/
[gitlabci]: https://about.gitlab.com/gitlab-ci/
[cidoc]: https://docs.gitlab.com/ce/ci/
[why-ci]: https://about.gitlab.com/2015/02/03/7-reasons-why-you-should-be-using-ci/
[introduction-ci]: https://rpadovani.com/introduction-gitlab-ci
[ballmer]: https://www.xkcd.com/323/
[gitlab-blog]: https://about.gitlab.com/
[aws-guide]: https://aws.amazon.com/answers/account-management/aws-multi-account-security-strategy/
[twitter]: https://twitter.com/rpadovani93
[pipeline-overview]: https://img.rpadovani.com/posts/pipeline-overview.png
[pipeline-status]: https://img.rpadovani.com/posts/pipeline-status.png
[s3-bucket-image]: https://img.rpadovani.com/posts/s3-creation.png
[iam-user-pic]: https://img.rpadovani.com/posts/iamuser.png
[cd-config-pic]: https://img.rpadovani.com/posts/cd-config.png
[ci-lint-pic]: https://img.rpadovani.com/posts/ci-lint.png
[env-pic]: https://img.rpadovani.com/posts/mr-overview-env.png
[monitoring]: https://gitlab.com/help/ci/environments.md
[s3]: https://s3.console.aws.amazon.com/s3/home?region=eu-central-1#
[s3-doc-host-website]: https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html
[s3-doc-permissions]: https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteAccessPermissionsReqd.html
[iam]: https://console.aws.amazon.com/iam/home?region=eu-central-1#/users
[env-doc]: https://docs.gitlab.com/ce/ci/yaml/#dynamic-environments
[s3-prices]: https://aws.amazon.com/s3/pricing/
[devops-blog]: https://about.gitlab.com/2018/03/07/2018-global-developer-report/
[rep-builds]: https://reproducible-builds.org/
