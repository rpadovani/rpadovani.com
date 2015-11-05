---
layout: post
title:  "Why opensource model rocks"
date:   2015-01-10 12:50
description: A little example of why opensource model rocks. This time the example is by DuckDuckGo
categories:
- DuckDuckGo
- DiscerningDuck
permalink: why-opensource-rocks
---

This post is mainly to say thanks to [DuckDuckGo][ddg] team.

As many of you know, **DuckDuckGo (DDG)** is an Internet search engine that
emphasizes protecting searchers' privacy and avoiding filter bubble of
personalized search results (Wikipedia dixit).

A couple of months ago I published a [scope][scope] for Ubuntu Touch, called
[Discerning Duck][discerning]: it's like a personal assistent, based on DDG
[Instant Answers][ia]. The scope it's still limited, because only few of these
Instant Answers are available via API (only *goodies* and *fathead*. *Spice*,
the most interactive, will be available in next months).

So, every scope has an homepage, and I put in the homepage one of the available
goodies: sunrise and sunset in your location.

![discerning duck homepage](https://img.rpadovani.com/posts/ddg.png)

Unfortunately, DuckDuckGo tries to understand your location from your IP
address, and there is no way to set a location by yourself, so I can't use
device location to look for sunrise. How long this worked well for me, someone
has wrong location in his homepage, so some days ago someone opened an
[issue][issue] on Discernig Duck GitHub project to complain about this. I
couldn't do anything but open a bug [upstream][upstream].

And you know what? In less than 4 days the bug has been fixed, and in next days
will be live. I will fix Discerning Duck to use phone location to look for
sunrise, that is more accurate than IP address lookup, and everyone will be
happy :-)

And this is possible because both Discerning Duck and DuckDuckGo Instant Answers
are opensource, and everyone can reports bugs! So, remember, everytime you find
something doesn't work in an opensource project, report it and, if you want, you
can also try to fix it!

Ciao, <br/>
R.

As usual, I do all this in my spare time, at night because during the day I
have to study. Do you mind to [buy me a coffee][coffee] to help me to stay
awake? :-)

[ddg]: https://duckduckgo.com/
[scope]: http://www.ubuntu.com/phone/scopes
[discerning]: https://github.com/rpadovani/discerning-duck
[ia]: https://duck.co/ia
[issue]: https://github.com/rpadovani/discerning-duck/issues/3
[upstream]: https://github.com/duckduckgo/zeroclickinfo-goodies/issues/901
[coffee]: http://rpadovani.com/donations/
