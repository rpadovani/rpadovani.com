---
layout: post
title:  "Integrating JetBrains Qodana with GitLab pipelines"
date:   2021-02-14 09:00
description: "The new JetBrains Qodana can be easily integrated in GitLab pipelines, let's see how!"
categories:
- gitlab
permalink: gitlab-jetbrains-qodana
cover: https://img.rpadovani.com/posts/qodana/qodana-gitlab-pages.png
---
 
JetBrains Qodana is a new product, still in early access, that brings the "Smarts" of JetBrains IDEs into your CI pipeline, and it can be easily integrated in GitLab.

<figure>
    <img src="https://img.rpadovani.com/posts/qodana/qodana-gitlab-pages.png" alt="cover" />
    <figcaption>
      <p><span>Qodana on Gitlab Pages</span></p>
    </figcaption>
  </figure>
  
In this blog post we will see how to integrate this new tool by JetBrains in our GitLab pipeline, including having a dedicated website to see the cool report it produces.

<small>Aren't you convinced yet? Read [4 Benefits of CI/CD][benefits-ci-cd]!</small>
If you don't have a proper GitLab pipeline to lint your code, run your test, and manage all that other annoying small tasks, you should definitely create one! I've written an [introductory guide to GitLab CI][introduction-gitlab-ci], and many more are available on the [documentation website][gitlab-ci-documentation].

# JetBrains Qodana

<section>
<blockquote cite="https://blog.jetbrains.com/idea/2021/02/early-access-program-for-qodana-a-new-product-that-brings-the-smarts-of-jetbrains-ides-into-your-ci-pipeline/"><p>Qodana comprises two main parts: a nicely packaged GUI-less IntelliJ IDEA engine tailored for use in a CI pipeline as a typical “linter” tool, and an interactive web-based reporting UI.

It makes it easy to set up workflows to get an overview of the project quality, set quality targets, and track progress on them. You can quickly adjust the list of checks applied for the project and include or remove directories from the analysis.
</p></blockquote>
<cite><a href="https://blog.jetbrains.com/idea/2021/02/early-access-program-for-qodana-a-new-product-that-brings-the-smarts-of-jetbrains-ides-into-your-ci-pipeline/">Qodana launching post.</a></cite>
</section>

I'm a huge fun of JetBrains products, and I happily pay their license every year: my productivity using their IDEs is through the roof. This very blog post has been written using WebStorm :-)

Therefore, when they announced a new product to bring the smartness of their IDE on CI pipelines, I was super enthusiastic! In [their documentation][qodana-doc] there is also a small paragraph about GitLab, and we'll improve the example to have a nice way to browse the output.

At the moment, Qodana has support for **Java**, **Kotlin**, and **PHP**. With time, Qodana will support all languages and technologies covered by JetBrains IDEs.

Remember: **Qodana is in an early access version**. Using it, you expressly acknowledge that the product may not be reliable, work as not intended, and may contain errors. Any use of the EAP product is at your own risk.

I suggest you to also taking a look to the [official GitHub page][qodana-github] of the project, to see licenses and issues.

<aside><p>Qodana has support for Java, Kotlin, and PHP. With time, Qodana will support all languages and technologies covered by JetBrains IDEs.</p></aside>

# Integrating Qodana in GitLab

The basic example provided by JetBrains is the following:

```yaml
qodana:
  image: 
    name: jetbrains/qodana
    entrypoint: [sh, -c]
  script:
    - /opt/idea/bin/entrypoint --results-dir=$CI_PROJECT_DIR/qodana --save-report --report-dir=$CI_PROJECT_DIR/qodana/report
  artifacts:
    paths:
      - qodana
```

While this works, it doesn't provide a way to explore the report without firstly downloading it on your PC. If we have [GitLab Pages][gitlab-pages] enabled, we can publish the report and explore it online, thanks to the [`artifacts:expose_as`][expose-as] keyword.

We also need GitLab to upload the right directory to Pages, so we change the artifact path as well:

```yaml
qodana:
  image: 
    name: jetbrains/qodana
    entrypoint: [sh, -c]
  script:
    - /opt/idea/bin/entrypoint --results-dir=$CI_PROJECT_DIR/qodana --save-report --report-dir=$CI_PROJECT_DIR/qodana/report
  artifacts:
    paths:
      - qodana/report/
    expose_as: 'Qodana report'
```

Now in our merge requests page we have a new button, as soon as the Qodana job finishes, to explore the report! You can see such a merge request [here][merge-request], with the button **"View exposed artifact"**, while [here][pages-report] you can find an interactive online report, published on GitLab Pages!

# Configuring Qodana

<small>Full reference for the Qodana config file can be found on [GitHub][qodana-conf].</small>
Qodana can be easily customized: we only need to create a file called `qodana.yaml`, and enter our preferences! 

There are two options I find extremely useful: one is `exclude`, that we can use to skip some checks, or to skip some directories, so we can focus on what is important and save some time. The other is `failThreshold`. When this number of problems is reached, the container would exit with error 255. In this way, we can fail the pipeline, and enforce a high quality of the code!

<aside><p>Qodana shows already a lot of potential, also if it only at the first version.</p></aside>

Qodana shows already a lot of potential, also if it only at the first version! I am really looking forward to support for other languages, and to improvements that JetBrains will do in the upcoming releases!


Questions, comments, feedback, critics, suggestions on how to improve my English? Reach me on Twitter ([@rpadovani93][twitter]) or drop me an email at [riccardo@rpadovani.com][email].
  
Ciao,  
R.

[twitter]: https://twitter.com/rpadovani93
[email]: mailto:riccardo@rpadovani.com
[introduction-gitlab-ci]: https://rpadovani.com/introduction-gitlab-ci
[benefits-ci-cd]: https://about.gitlab.com/blog/2019/06/27/positive-outcomes-ci-cd/
[gitlab-ci-documentation]: https://docs.gitlab.com/ee/ci/README.html
[qodana-github]: https://github.com/JetBrains/Qodana
[qodana-doc]: https://github.com/JetBrains/Qodana/blob/main/Docker/README.md
[expose-as]: https://docs.gitlab.com/ee/ci/yaml/#artifactsexpose_as
[merge-request]: https://gitlab.com/rpadovani/qodana-test/-/merge_requests/1
[pages-report]: https://gitlab.com/rpadovani/qodana-test/-/jobs/1028883758/artifacts/file/qodana/report/index.html
[gitlab-pages]: https://docs.gitlab.com/ee/user/project/pages/
[qodana-conf]: https://github.com/JetBrains/Qodana/blob/main/General/qodana-yaml.md
