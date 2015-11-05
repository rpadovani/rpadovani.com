---
layout: post
title:  "Ubuntu Calculator App Reboot"
date:   2014-12-24 19:12:00
description: The default calculator installed on Ubuntu for Phones is quite old... It's time for a reboot!
categories:
- ubuntu phone
permalink: ubuntu-calculator-app-reboot
---

With the word *core apps*, we define a collection of apps installed by default
on Ubuntu for Phones. I'm involved in their development, mainly in Calculator
and Reminders apps.

In past few months some of them had a *reboot*, so now they have a new superb
design. The first one was the [Clock App][nik90], and now it's time for
Calculator App \o/

We're working on it since the start of December, and we already have something
usable, I hope to publish it on the store in the second week of January. But
first of all, let me show you what will look like the new app, and which
features we will implement.

## The design document

*Next screenshots are prototypes*

So, this is the initial state of the app:

![initial state](https://img.rpadovani.com/posts/initial_state.png)

As you can see, it's all clean and essential.

One of the new feature we're going to implement is the **scientific mode**. We
didn't have that in the old app, and we think could be a very useful feature:

![landscape](https://img.rpadovani.com/posts/scientific-mode.png)

Another interesting feature is the **favourite history**. You can mark a calc as
favourite and set a label, so you can easily access to it in a second moment,
and remember why you saved it in first place.

![favourite](https://img.rpadovani.com/posts/favorites.png)

The file with the new design specs is available [online][new-design].

## Current implementation

We started to work on this at the end of November, and we do it in our free
time, so we're a bit slow, but we are quite happy with results. We found a
Javascript library, named [MathJs][mathjs], that is very powerful. Indeed, we
have already implemented scientific mode, and storage, so the base of the app is
ready. We need to work a bit on some bugs we have before we could publish it,
but I hope we're able to put on the store a working preview in the first week of
January.

## Help us

If you want to start to collaborate with us we will be more than happy to help
you in your first step :-) We need both developers and autopilot hackers. If you
want to write autopilot tests, we have a [list of bugs][autopilot] for you. If
you prefer to write code and fix bugs, [take the branch][branch], test it and
check what is missing! If you need help, or have feedback, write me a
[mail](mailto:riccardo@rpadovani.com) or join *#ubuntu-app-devel* on Freenode
and ping me (rpadovani) or Bartosk (gang65) or Mihir (mihir).

If you want to support my contributions to open source world, please consider to
[buy me a coffee][donation] to work all night long ;-)

Ciao,<br/>
R.

[nik90]: http://nik90.com/clock-app-reboot-backstory/
[new-design]: https://docs.google.com/presentation/d/1EiIELGizPHrd0TY7JdNwULbiqPYfOyEEI5CS87n7QlY/edit#slide=id.p
[mathjs]: http://mathjs.org/
[autopilot]: https://bugs.launchpad.net/ubuntu-calculator-app/+bugs/?field.tag=needs-autopilot-test
[branch]: https://code.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot
[donation]: http://rpadovani.com/donations/
