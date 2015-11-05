---
layout: post
title:  "My new bazaar workflow"
date:   2015-05-25 16:52
description: How to (almost) use bzr as git
categories:
- ubuntu
permalink: my-new-bzr-workflow
---


This weekend I went to [DUCC-IT][duccit], an italian event about Debian, Ubuntu and all the opensource world.

The event was great with a lot of interesting talks. But the best part of this kind of meetings is meet old and new friends, drink a beer together and learn something new.

![Blank][img0]

I was talking with [3v1n0][3v1n0] (Unity 7 dev) about my last contributions in the Ubuntu world, and about how was my bzr workflow: a directory, a branch. While I was contributing to little projects, like calculator app, it was a good approach: codebase is few megabytes, so it doesn't take too much space on hard disk, there is nothing to compile (or in other projects, like reminders, compilation time is very short, so I can compile all the app every time I do a new branch).

But when I started to contribute to webbrowser app this approach started to have some problems: it tooks like 10 minutes to compile all the code, and it uses too much space on hard disk. But it was okay, it didn't bother me too much so I continued using a different directory for each different branch I had.

When I started to contribute to oxide, I understood I had to change approach: every branch is about 15GB, and it takes like 40 minutes to compile from scratch (or maybe more, I did only one) all the code.

Anyway, I'm very lazy, so I postponed the resolution of the problem (and, consequently, new oxide contributions) until this weekend, when 3v1n0 showed me the solution.

I report it here, hoping could be useful for someone else. It's based on bzr *light checkouts*, and it works very similary to *git checkouts*: you will have only 1 directory with all your branches, and when you switch from one to another you have only to recompile what's different.

It requires another directory, so to don't have it in the project directory I create a main directory for the project, with inside a directory called like the project itself and a directory for branches.

I know I'm not good to explain myself in english, so let's see an example. A last thing before starting: I use [oh-my-zsh][zsh] with [Numix][numix] theme, at the end of the post I'll explain how to add bzr support to zsh, because could be very useful.

## Bzr setup

So, as example, let's take the webbrowser-app. You want to contribute, so the first thing you do is creating a directory for the code:

`mkdir webbrowser-app`

then, you enter the directory and take the code from Launchpad:

`cd webbrowser-app && bzr branch lp:webbrowser-app && cd webbrowser-app`

Now, you need to choose a directory where you will save the branches: as I explained, I'll use one in the parent directory, and I'll call it bzr-repo, but you can call it as you wish.

`bzr init-repo --no-trees ../bzr-repo`

This first command will init a repo in the bzr-repo directory, and the *--no-trees* tells to don't create a copy of the working tree to don't waste too much space.

Now we create the main branch, and we call it *trunk*:

`bzr branch . ../bzr-repo/trunk`

We need only to reconfigure the local directory to use the trunk we just created as base for checkouts:

`bzr reconfigure --lightweight-checkout --bind-to ../bzr-repo/trunk .`

Now some useful commands:
- to create a new branch, type `bzr switch -b new-branch`
- to list all branches, type `bzr branches`
- to change branch, use `bzr switch branch-name`
- to remove a local branch, use `bzr remove-branch branch-name`

Taking a remote branch and deleting one is a bit more complicated (but I created a couple of alias, so it becomes really simple).

To take a remote branch, we need to indicates we want to download it in the ../bzr-repo directory, so you've to use:

`bzr branch lp:~rpadovani/webbrowser-app/remove-404-history ../bzr-repo/remove-404-history`

To delete it, just use rm -r:

`rm -r ../bzr-repo/remove-404-history`

## Aliases

To don't have to type so much to create, take and delete branches I created 3 alias:  

`alias init-repo='bzr init-repo --no-trees ../bzr-repo && bzr branch . ../bzr-repo/trunk && bzr reconfigure --lightweight-checkout --bind-to ../bzr-repo/trunk .'
take-branch() {bzr branch "$@" ../bzr-repo/$(echo "$@" | cut -d "/" -f3) }
delete-branch() {rm -rf ../bzr-repo/"$@"}`

To enable lightweight-checkout take the code, and do `init-repo`.
Then, use `take-branch lp:~username/project/branch` to take a branch and `delete-branch branch` to delete a branch (before deleting a branch, switch out of it, otherwise you'll break the world).

They use `../bzr-repo` as directory, but you can easily change it.

## Zsh
To have bzr support in zsh, as in the above image, you need to use one of the few themes that implement it or **implement by yourself and contribute to zsh**. It's very easy to do, [take a look to my implementation][bzrsupport] for the theme I use.

If you like my contributions to Ubuntu and want to support me, just send me a *Thank you!* by [email](mailto:riccardo@rpadovani.com) or [offer me][donation] a beer:-)

Ciao,<br/>
R.

[donation]: http://rpadovani.com/donations/
[duccit]: http://www.ducc.it
[3v1n0]: http://www.3v1n0.net/
[zsh]: https://github.com/robbyrussell/oh-my-zsh
[numix]: https://numixproject.org/
[bzrsupport]: https://github.com/robbyrussell/oh-my-zsh/pull/3884
[img0]: https://img.rpadovani.com/posts/bzr-improve.png
