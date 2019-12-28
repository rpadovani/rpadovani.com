---
layout: post
title:  "My year on HackerOne"
date:   2019-12-28 19:00
description: "This year I spent some of my free time doing bug bounties over HackerOne. Here a summary of what I did, how did it go, and what I want to do in the future."
categories:
- security
permalink: 2019-hackerone
---
 
Last year, totally by chance, I found a [security issue over Facebook][fb] - I reported it, and it was fixed quite fast. In 2018, I also found a [security issue over Gitlab][gitlab-bug], so I signed up to HackerOne, and reported it as well. That first experience with Gitlab was far from ideal, but after that first report I’ve started reporting more, and Gitlab has improved its program a lot.


# 2019
 
Since June 2019, when I opened [my first report of the year][first-report], I reported 27 security vulnerabilities: 4 has been marked as duplicated, 3 as informative, 2 as not applicable, 9 have been resolved, and 9 are currently confirmed and the fix is ongoing. All these 27 vulnerabilities were reported to Gitlab. 

Especially in October and November I had a lot of fun testing the implementation of ElasticSearch over Gitlab. Two of the issues I have found on this topic have already been disclosed:

- [Group search leaks private MRs, code, commits][es-1]
- [Group search with Elastic search enable leaks unrelated data][es-2]
 
# Why just Gitlab?
 
I have an amazing daily job as Solutions Architect at [Nextbit][nextbit] that I love. I am not interested in becoming a full-time security researcher, but I am having fun dedicating some hours every month in looking for securities vulnerabilities. 
 
However, since I don’t want it to be a job, I focus on a product I know very well, also because sometimes I contribute to it and I use it daily.
 
I also tried to target some program I didn’t know anything about, but I get bored quite fast: to find some interesting vulnerability you need to spend quite some time to learn how the system works, and how to exploit it. 

Last but not least, Gitlab nowadays manages its HackerOne program in a very cool way: they are very responsive, kind, and I like they are very transparent! You can read a lot about how their security team works in their [handbook][handbook].

# Can you teach me?

Since I have shared a lot of the disclosed reports on Twitter, some people came and asked me to teach them how to start in the bug bounties world. Unfortunately, I don't have any useful suggestion: I haven't studied on any specific resource, and all the issues I reported this year come from a deep knowledge of Gitlab, and from what I know thanks to my daily job.
There are definitely more interesting people to follow on Twitter, just check over some common hashtags, such as [TogetherWeHitHarder][hashtag].
 
# Gitlab's Contest

I am writing this blog post from my new keyboard: a custom-made WASD VP3, generously donated by Gitlab after I won a [contest][contest] for their first year of public program on HackerOne. I won the best written report category, and it was a complete surprise; I am not a native English speaker, 5 years ago my English was a monstrosity (if you want to have some fun, just go reading my old blog posts), and still to this day I think is quite poor, as you can read here.

<small>Indeed, if you have any suggestion on how to improve this text, please write me!</small>

![custom keyboard][img-keyboard]

Congratulations to Gitlab for their first year on HackerOne, and keep up the good work! Your program rocks, and in the last months you improved a lot!

# HackeOne Clear

HackerOne started a new program, called [HackerOne Clear][clear], only on invitation, where they vet all researchers. I was invited and I thought about accepting the invitation. However, the scope of the data that has to be shared is definitely too wide, and to be honest I am surprised so many people accepted the invitation. HackerOne doesn't perform the check, but delegates to a 3rd party. This company asks a lot of things.

<aside>
<p>
T&Cs for joining HackerOne Clear ask to hand over a lot of personal data. I totally don't feel comfortable in doing so, and I wonder why so many people, that should be very aware of the importance of privacy, accepted.
</p>
</aside>

I totally understand the need of background checks, and I'd be more than happy to provide my criminal record. It wouldn't be the first time I am vetted, and I am sure it wouldn't be the last

I am a bit more puzzled about these requirements:

- Financial history, including credit history, bankruptcy and financial judgments;
- Employment or volunteering history, including fiduciary or directorship responsibilities;
- Gap activities, including travel;
- Health information, including drug tests;
- Identity, including identifying numbers and identity documents;

Not only the scope is definitely too wide, but also all these data will be stored and processed outside EU!
Personal information will be stored in the United States, Canada and Ireland. Personal information will be processed in the United States, Canada, the United Kingdom, India and the Philippines.

As European citizen who wants to protect his privacy, I cannot accept such conditions. I really hope HackerOne will require fewer data in the future, preserving privacy of their researchers.

# 2020

In these days I've though a lot about what I want to do in my future about bug bounties, and for the 2020 I will continue as I've done in the last months: assessing Gitlab, dedicating not more than a few hours a month. I don't feel ready to step up my game at the moment. I have a lot of other interests I want to pursue in 2020 (travelling, learning German, improve my cooking skills), so I will not prioritize bug bounties for the time being.

That's all for today, and also for the 2019! It has been a lot of fun, and I wish to you all a great 2020!
For any comment, feedback, critic, write to me on Twitter ([@rpadovani93][twitter])
or drop an email at [riccardo@rpadovani.com](mailto:riccardo@rpadovani.com).
 
Ciao,  
R.
 
[handbook]: https://about.gitlab.com/handbook/engineering/security/
[hashtag]: https://twitter.com/hashtag/togetherwehitharder?src=hashtag_click
[gitlab-bug]: https://rpadovani.com/gitlab-responsible-disclosure
[clear]: https://www.hackerone.com/product/clear
[fb]: https://rpadovani.com/facebook-responsible-disclosure
[first-report]: https://hackerone.com/reports/614355
[es-1]: https://hackerone.com/reports/692252
[es-2]: https://hackerone.com/reports/708820
[nextbit]: https://www.nextbit.it/
[contest]: https://about.gitlab.com/blog/2019/12/12/bugs-bounties-and-cherry-browns/
[img-keyboard]: https://img.rpadovani.com/posts/2019-hackerone/keyboard.jpg
[twitter]: https://twitter.com/rpadovani93
 
 
 

