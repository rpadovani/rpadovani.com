---
layout: post
title:  "My vps configuration"
date:   2015-04-12 21:38
description: Thanks to donations, I bought a VPS and I use it as my cloud service
categories:
- personal
permalink: my-vps-configuration
---

As I anticipated in the last blog post, thanks to your [donations][donations] I
bought a VPS, and now let me explain why and how I configured it (suggestions
are welcome!)

## Why?

Why should I buy a VPS and lose time to configure it when on the web there are a
lot of free services well-configured?

My answer is: **privacy** (*that isn't security*). If you value your privacy,
you know what I'm talking about. If you don't, I'm sorry for you, [because you
should][nsa].

I don't want my mails analyzed by Google, or my documents scanned by Dropbox, or
my searches inspected by Microsoft. These are none of them business.

But it's a VPS, not a server in my house, so it isn't secure by definition,
because someone could have physical access to my data without I know it.

I'm aware of that, and this is the important thing: I know what I'm looking for
(protect my data from companies that give you *free* services to have your
data).

After this little premise, let's see which services I use. Of course OS is
Ubuntu 14.04 ;-)

## Documents

Here the solution is easy: **[OwnCloud][owncloud]**. It manages my docs, my
calendar, my contacts and it also works as RSS reader.

More, I can sync calendar and contacts with Ubuntu for Phones ([here a nice
tutorial][ownsinc]).

I created a subdomain for my OwnCloud installation, and I generated a self
signed SSL certificate so no one could tamper with my connection.

## Mails

A big thanks to [Pietro Albini][pietro] for his help in configuring all the mail
stack.

As MTA I use Postfix, and Dovecot as IMAP server. Since I hate mail clients on
desktop, I installed a webmail (with a self signed SSL certificate, of course).
The choose wasn't easy: on a first moment, I focused on [mailpile][mailpile],
that is amazing, but it's still too young. There are some bugs / missing
features that at the moment I consider as blockers. I hope one day I'll be able
to switch to it, I continue to follow with much attention its development.

At the end I choose [Rainloop][rainloop]: it's far from perfect, but it does its
work.

## Website

This website is always based on [Jekyll][jekyll]: when I push something on the
GitHub repo of this site, there is a webhook that calls a script on my server
which pull the code, compile it and serve to new visitors.

I dropped Cloudfare, so now when you try to reach my website no one is between
you and me ;-) I know there is still a connection to Google's server, to take
fonts: I'm planning to drop also that and host fonts on my server, so you'll not
be tracked visiting my site.

And I think this is all. Of course, if you have any feedback (or you have any
question on a specific configuration), feel free to write me a mail at
[riccardo@rpadovani.com](mailto:riccardo@rpadovani.com).

If you think server performance are bad, feel free to make me a
[donation][donations] so I can upgrade my VPS instance (it's hosted in Europe,
so who is outside Europe unfortunately will have slower response).

Ciao,<br/>
R.

[donations]: http://rpadovani.com/donations/
[nsa]: http://www.theguardian.com/world/interactive/2013/nov/01/snowden-nsa-files-surveillance-revelations-decoded
[owncloud]: https://owncloud.org/
[ownsinc]: http://notyetthere.org/syncing-ubuntu-touch-with-owncloud-or-any-carddav-server/
[pietro]: http://pietroalbini.io/
[mailpile]: https://www.mailpile.is/
[rainloop]: http://www.rainloop.net/
[jekyll]: http://jekyllrb.com/
