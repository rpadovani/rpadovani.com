---
layout: post
title:  "Auto deploy a Jekyll website with Gitlab CI"
date:   2016-08-04 17:45
description: "How I autodeploy this website with Gitlab CI"
categories:
- jekyll
- gitlab
permalink: jekyll-autodeploy-gitlab-ci
---

In last three months one of the task I had at [archon.ai][0] was to implement a
pipeline to autodeploy our services. We use an instance of [Gitlab][1] to host
our code, so after some proof of concept we chose to use [Gitlab CI][2] to test
and deploy our code.

Gitlab CI is amazing (as Gitlab is), Gitlab team is doing a great work and they
implement new features every month. So today I choose to move also this blog to
Gitlab CI.

This blog is based on [Jekyll][3]. It was already hosted on Gitlab but, until
yesterday, it didn't use Gitlab CI: every time I pushed something, a webhook
called a script on my server, the server downloaded the source code, compiled it
and then published it.

The bad in this approach is the same server which runs the website (and other
services as well), wasted CPU, storage and time doing compilation.

I have others servers at well (but if you do not, don't worry, Gitlab offers
free runners for Gitlab CI if you host your project on Gitlab.com), so I
installed a Gitlab runner as explained [here][4] and set it to run tests via
docker.

## gitlab-ci.yml

The first thing to do after enabling the runner was to create a *gitlab-ci.yml*
file to explain to the runner how to do its job. The fact Gitlab uses a file to
configure runners it's a winning choice: developers can have it versioned in the
source and each branch can have its own rules.

Anyway, at the end my configuration file is this:

```
image: ruby:2.3
stages:
  - deploy

cache:
  paths:
    - vendor
  key: "$CI_BUILD_REPO"

before_script:
  - gem install bundler

deploy_site:
  stage: deploy
  only:
    - master
  script:
    - bundle install --path=vendor/
    - bundle exec jekyll build
  artifacts:
    paths:
      - _site/
```

Quite simple, isn't it?

At the end I need only to deploy the website, I do not have tests, so I have
only one stage, the deploy one.

There are however few interesting things to highlight:

- I install gems in `vendor/` instead of the default directory, so I can cache them and reuse in others run, to save time and bandwidth
- The cache is shared between all the repo (*key: "$CI_BUILD_REPO"*) because, for my use, it is always the same. By default it is shared only between branches
- The deploy step is executed only when I push to *master* branch
- The site is build in *_site/* directory, so I need to specify in in the `artifacts` section

If you want to see how to tune these settings, or learn about others (there are
a lot of them, it is a very versatile system), take a look to the official
[guide][5].

The *Gemfile* for bundler is very basic:

```
source 'https://rubygems.org'
gem "github-pages"
gem "pygments.rb"
```

It is important to add *vendor* directory to the *exclude* section in
*_config.yml*, otherwise Jekyll will publish it as well.

## Deploy

Ok, if you push these files on your Gitlab's repo, and if you have done a good
job setting up the runner, you will have an artifact in your repo to download.

![artifact][6]

Next step is to deploy it to the server. There are tons of different possible
solutions to do that. I created a *sh script* which is invoked by an hook.

Since I already have PHP-fpm installed on the server due my [Nextcloud][7]
installation, I choose to invoke the *sh script* through a php script.

When you create a webhook in your Gitlab project (*Settings->Webhooks*) you can
specify for which kind of events you want the hook (in our case, a new build),
and a secret token so the script can be called only by Gitlab.

![webhook][8]

Unfortunately, the [documentation about webhooks][9] is very poor, and there
isn't any mention about builds payload.

Anyway, after a couple of tries, I created this script:

```
<?php
// Check token
$security_file = parse_ini_file("../token.ini");
$gitlab_token = $_SERVER["HTTP_X-GITLAB-TOKEN"];

if ($gitlab_token !== $security_file["token"]) {
    echo "error 403";
    exit(0);
}

// Get data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// We want only success build on master
if ($data["ref"] !== "master" ||
    $data["build_stage"] !== "deploy" ||
    $data["build_status"] !== "success") {
  exit(0);
}

// Execute the deploy script:
shell_exec("/usr/share/nginx/html/deploy.sh 2>&1");
```

Since the repo of this blog is public, I cannot insert the token in the script
itself (and I cannot insert it in the script on the server, because it is
overwritten at every deploy).

So I created a *token.ini* file outside the webroot, which is just one line:

```
token = supersecrettoken
```

In this way the endpoint can be called only by Gitlab itself. The script then
checks some param of the build, and if everything is ok runs the deploy script.

Also this deploy script is very very basic, but there are a couple of
interesting things:

```
#!/bin/bash
# See 'Authentication' section here: http://docs.gitlab.com/ce/api/
SECRET_TOKEN=$PERSONAL_TOKEN

# The path where to put the static files
DEST="/usr/share/nginx/html/"

# The path to use as temporary working directory
TMP="/tmp/"

# Where to save the downloaded file
DOWNLOAD_FILE="site.zip";

cd $TMP;
wget --header="PRIVATE-TOKEN: $SECRET_TOKEN" "https://gitlab.com/api/v3/projects/774560/builds/artifacts/master/download?job=deploy_site" -O $DOWNLOAD_FILE;
ls;
unzip $DOWNLOAD_FILE;

# Whatever, do not do this in a real environment without any other check
rm -rf $DEST;
cp -r _site/ $DEST;
rm -rf _site/;
rm $DOWNLOAD_FILE;
```

First of all, the script has to be executable (`chown +x deploy.sh`) and it has
to belong to the webserver's user (usually *www-data*).

The script needs to have an access token (which you can create [here][10]) to
access the data. Again, I cannot put it in the script itself, so I inserted it
as environment variable:

`sudo vi /etc/environment`

in the file you have to add something like:

`PERSONAL_TOKEN="supersecrettoken"`

and then remember to reload the file:

`source /etc/environment`

You can check everything is alright doing `sudo -u www-data echo PERSONAL_TOKEN`

Now, the other interesting part of the script is where is the artifact. The last
available of a branch is reachable only through API; [they are working][11] on
implementing the API in the web interface so you can always download the last
version from the web.

The url of the API is

*https://gitlab.example.com/api/v3/projects/{{projectid}}/builds/artifacts/{{branchname}}/download?job={{jobname}}*

While you can imagine what branchname and jobname are, the project id is a bit
more tricky to find.

It is included in the body of the webhook as *projectid*, but if you do not want
to intercept the hook, you can go to the settings of your project, section
**Triggers**, and there examples of APIs calls: you can determine the project id
from there.

Kudos to the Gitlab team (and others guys who help in their free time) for their
awesome work!

If you have any question or feedback on this blog post, please drop me an email
at [riccardo@rpadovani.com](mailto:riccardo@rpadovani.com) :-)

Bye for now,<br/>
R.

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
