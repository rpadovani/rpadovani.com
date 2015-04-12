---
layout: post
title:  "Calculator 2.0.155: Here we are"
date:   2015-04-12 14:38
description: Here we are, calculator reboot becomes calculator
categories:
- ubuntu phone
permalink: calculator-here-we-are
---

We finally did it! The [calculator reboot][reboot] became **the default
calculator on Ubuntu for Phones**.

We did some minor changes in last weeks, so it's a bit different from the one
you've if you installed the Calculator App Reboot from the store. Anyway, now
you can remove the one from the store and update your default app, you will have
the new one. Unfortunately, your old calc history will be lost, but we found out
that to create an importer for old calcs required some time, so we prefered to
update the app.

As usual, please report any bug you find on [Launchpad][bugs], so we can fix
them!

In next weeks app will have some more updates: we're working to improve
performances and to change the design a bit more: but updates will be gradual,
we will not do a *reboot of the reboot*.

If you want to start to collaborate with us we will be more than happy to help
you in your first step :-) We need both developers and autopilot hackers. If you
want to write autopilot tests, we have a [list of bugs][ap] for you. If you
prefer to write code and fix bugs, [take the branch][branch], test it and check
what is missing! If you need help, or have feedback, write me a
[mail](mailto:riccardo@rpadovani.com) or join *#ubuntu-app-devel* on Freenode
and ping me (rpadovani) or [Bartosk][gang66] (gang65).

Thanks to Ubuntu community the calculator now it's available in a lot of
languages. They're amazing, work hard and we often forget them. So, **this is my
personal thanks for you all translators! We love you!**

If you don't have the app in your language, take a look to our
[translations][i18n] page and help us :-)

![Blank][img0]

## Full changelog

Here the changelog with features we added since the last update of the reboot
app. Missing revisions are translations. I don't report them because the commit
message is always the same (*Launchpad automatic translations update.*), so it
isn't useful to understand which languages have new translations. Please see
[this page][i18n] to have a full vision on translations status:

- [#140][140] Fix favourite that remains in favourite page after deletion. *(Riccardo Padovani)*
- [#144][144] Add validation of long string contains operator and number *(Bartosz Kosiorek)*
- [#145][145] Improve favourite textfield management. *(Riccardo Padovani)*
- [#152][152] Wait until osk keyboard is hidden before showing our custom keyboard. *(Riccardo Padovani)*
- [#155][155] Use the default calculator icon to create the click package. *(Riccardo Padovani)*


Ciao,<br/>
R.

As usual, I do all this in my spare time, at night because during the day I
have to study. Do you mind to [buy me a coffee][coffee] to help me to stay
awake? :-)

[bugs]: https://bugs.launchpad.net/ubuntu-calculator-app
[gang66]: https://plus.google.com/105782724017692708794/posts
[reboot]: http://rpadovani.com/ubuntu-calculator-app-reboot/
[ap]: https://bugs.launchpad.net/ubuntu-calculator-app/+bugs/?field.tag=needs-autopilot-test
[branch]: https://code.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot
[img0]: https://myapps.developer.ubuntu.com/site_media/appmedia/2015/04/009.png
[i18n]: https://translations.launchpad.net/ubuntu-calculator-app
[coffee]: http://rpadovani.com/donations/
[140]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/140
[144]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/144
[145]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/145
[152]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/152
[155]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/155
