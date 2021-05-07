---
layout: post
title:  "Understand, plan, explain, execute"
date:   2021-02-14 09:00
description: "4 necessary steps to obtain results in software related projects."
categories:
- development
permalink: understand-plan-explain-execute
cover: https://img.rpadovani.com/posts/upee/scott-graham-5fNmWej4tAA-unsplash.jpg
---
 
After years working in software related projects, both as developer and as consultant, I came to the conclusion these four steps are always necessary, from making your own software in free time to deliver a huge multi-year project to a customer.

<figure>
    <img src="https://img.rpadovani.com/posts/upee/scott-graham-5fNmWej4tAA-unsplash.jpg" alt="cover" />
    <figcaption>
      <p><span>Photo by <a href="https://unsplash.com/@homajob?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Scott Graham</a> on <a href="https://unsplash.com/s/photos/planning?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
  </span></p>
    </figcaption>
  </figure>
  
While these four steps seems quite easy and straightforward, I've seen projects fail due rushing or skipping some of them, or not investing the right amount of time and concentration. I'm writing down this as a personal note, reminding me to apply all of them all the time, but I hope it can be useful to any of the three readers this blog has.

# Introduction

There is no universal truth in software development, and, as everything, you should take this as a _guideline_, definitely not as word of law. However, I found myself or some colleague over and over skipping one of these steps, and having problems down the road. While, of course, there can be a lot of different approaches, this one is the one that works best for me.

# Understand

I personally find this step the most challenging one: we don't act in a bubble, so every bug we fix, feature we implement, change we bring, comes from an external request. It could be an explicit customer's request, a feedback from a user, a new design from the UI team, or something else; even when we are creating our own script we are solving a problem that we first need to understand.

Understanding doesn't mean only listening to the customer / designer / user: listening is, of course, the first step, but it is not the only one. Often, people conflate explaining the problem with proposing a solution. You need to split the two things, and focusing on one of them at the time.

Failing to understand which is the problem, and all its implications, often brings to implement a half-baked solution, meaning it has to be redone, or to ignore some corner cases, which will be found only after the thing went to production, thus having to build workaround on the newly deployed solution.

## The perceived problem

<small>From now on, I'll use the term customer referring to whom we are solving a problem for, no matter if they are a manager, a designer team, our boss, or whoever else: while they have different motivations, they still want only one thing from us: to fix their problem.</small>

Whoever your customer are, they will probably come to you with a problem they think they have. While often they actually know what the problem is, especially if their job is understanding the problem (e.g., a QA team), sometime they haven't fully comprehended it. I find very useful trying to reason with people about their problem, and what's their goal. It's important to note here that we don't know their problem better than them, and for sure we don't have their business knowledge. Asking questions helps both the customer understanding better what they want to do, and us to fully get the picture about the context they are operating in.

Some questions here can be quite standard, like "_What are we trying to achieve?_", "_How we act right now?_", "_Is this really the problem, or is just a consequence of another problem?_". 

<small>Priority management is a huge topic, and this blog post is already long enough. There are multiple resources on the web about it, and since how priorities are determined changes by the project, you should talk to your project manager to know more about it.</small>
Another important topic while talking about the problem, it's understanding how **urgent** it is. Of course, everything is urgent and should be ready for yesterday, but nothing is more frustrating that working hard and fast on something, and then find out that doesn't matter at least until next year. Defining priorities is difficult, and explain them to stakeholders is almost impossible: however, we should always strive to understand what really matters, and then we should being able to explain those choices.  

## The suggested solution

Customers have often an idea of which could be a good solution, at least according to their opinion. Unfortunately, they often have no idea of the technological constraints, the limits of the already implemented solution, the consequences of what they propose, or the way to cover every corner case: and rightly so, they are experts on their business, not on the stack!

Listening 

# Plan

# Explain

# Execute

# Conclusion

While I was younger, I was eager to **execute** immediately, start writing code to show I know how to code. With time, tho, I learned is better to have a plan. This is why I force myself to go through all these steps every time. No size fits all: this is my receipt, and I don't think is particularly original, but I hope it can be useful to somebody else to think on how to approach problems: take it, and adapt it to yourself and to your style of working.

Also, writing down this piece, and especially reviewing it over and over, helped me a lot in clarify the steps, and reflect upon them and improve them. This is a very good reason to blog ;-)

We never finish learning, so I'm sure I will improve my approach, and one day, change after change, we'll be completely different again. Meanwhile, if you have any question, comment, feedback, critic, suggestion on how to improve my English, or you would simply like to chat with me, reach me on Twitter ([@rpadovani93][twitter]), or drop me an email at [riccardo@rpadovani.com][email].
  
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
