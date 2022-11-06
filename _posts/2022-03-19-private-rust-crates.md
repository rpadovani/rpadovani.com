---
layout: post
title:  "Managing Rust crates in private Git repositories"
date:   2022-03-19
description: "How to host private Rust crates in a Git repository, in an easily accessible way both from automatic systems and developers?"
categories:
- rust
- gitlab
permalink: private-rust-crates
cover: https://img.rpadovani.com/posts/rustacean-flat-happy.png
---

Rust is all hot these days, and it is indeed a nice language to work with. In this blog post, I take a look at a small challenge: how to host private crates in the form of Git repositories, making them easily available both to developers and CI/CD systems.

<figure>
    <img src="https://img.rpadovani.com/posts/rustacean-flat-happy.png" alt="cover" />
    <figcaption>
      <p><span>Ferris the crab, unofficial mascot for Rust.</span></p>
    </figcaption>
</figure>

A Rust crate can be hosted in different places: on a public registry on [crates.io], but also in a private Git repo hosted somewhere. In this latter case, there are some challenges on how to make the crate easily accessible to both engineers and CI/CD systems.

Developers usually authenticate through [SSH keys]: given humans are terrible at remembering long passwords, using SSH keys allow us to do not memorize credentials, and having authentication methods that just works. The security is quite high as well: each device has a unique key, and if a device gets compromised, deactivating the related key solves the problem.

On the other hand, it is better avoiding using SSH keys for CI/CD systems: such systems are highly volatile, with dozens, if not hundreds, instances that get created and destroyed hourly. For them, a short-living token is a way better choice. Creating and revoking SSH keys on the fly can be tedious and error-prone.

This arises a challenge with Rust crates: if hosted on a private repository, the dependency can be reachable through SSH, such as

```toml
[dependencies]
my-secret-crate = { git = "ssh://git@gitlab.com/rpadovani/my-secret-crate.git", branch = "main" }
```

or through HTTPS, such as

```toml
[dependencies]
my-secret-crate = { git = "https://gitlab.com/rpadovani/my-secret-crate", branch = "main" }
```

<small>In the future, I hope we don't need to host private crates on Git repositories, [GitLab should add] a native implementation of a private registry for crates.</small>


The former is really useful and simple for engineers: authentication is the same as always, so no need to worry about it. However, it is awful for CI/CD: now there is need to manage the lifecycle of SSH keys for automatic systems.

The latter is awful for engineers: they need a new additional authentication method, slowing them down, and of course there will be authentication problems. On the other hand, it is great for automatic systems.

How to conciliate the two worlds?

Well, let's use them both! In the `Cargo.toml` file, use the SSH protocol, so developers can simply clone the main repo, and they will be able to clone the dependencies without further hassle.

Then, configure the CI/CD system to clone every dependency through HTTPS, thanks to a neat feature of Git itself: `insteadOf`.

From the [Git-SCM website]:

> `url.<base>.insteadOf`:  
> Any URL that starts with this value will be rewritten to start, instead, with <base>. In cases where some site serves a large number of repositories, and serves them with multiple access methods, and some users need to use different access methods, this feature allows people to specify any of the equivalent URLs and have Git automatically rewrite the URL to the best alternative for the particular user, even for a never-before-seen repository on the site. When more than one insteadOf strings match a given URL, the longest match is used.

Basically, it allows rewriting part of the URL automatically. In this way, it is easy to change the protocol used: developers will be happy, and the security team won't have to scream about long-lived credentials on CI/CD systems.

<small>Do you need an introduction to GitLab CI/CD? I've [written something about it]!</small>

An implementation example using GitLab, but it can be done on any CI/CD system:

```yaml
my-job:
  before_script:
    - git config --global credential.helper store
    - echo "https://gitlab-ci-token:${CI_JOB_TOKEN}@gitlab.com" > ~/.git-credentials
    - git config --global url."https://gitlab-ci-token:${CI_JOB_TOKEN}@gitlab.com".insteadOf ssh://git@gitlab.com
  script:
    - cargo build
```

The `CI_JOB_TOKEN` is a [unique token] valid only for the duration of the GitLab pipeline. In this way, also if a machine got compromised, or logs leaked, the code is still sound and safe.

What do you think about Rust? If you use it, have you integrated it with your CI/CD systems? Share your thoughts in the comments below, or drop me an email at [riccardo@rpadovani.com][email].
  
Ciao,  
R.

[email]: mailto:riccardo@rpadovani.com

[crates.io]: https://crates.io/
[Git-SCM website]: https://git-scm.com/docs/git-config
[SSH keys]: https://docs.gitlab.com/ee/ssh/
[Gitlab should add]: https://gitlab.com/gitlab-org/gitlab/-/issues/33060
[written something about it]: https://rpadovani.com/introduction-gitlab-ci
[unique token]: https://docs.gitlab.com/ee/ci/jobs/ci_job_token.html
