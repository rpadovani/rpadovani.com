---
layout: post
title:  "Calculator Reboot 2.0.73: call for translations!"
date:   2015-01-22 21:00
description: A new version of the beta of calculator app is in the store. What's new?.
categories:
- ubuntu phone
permalink: calculator-reboot-translations
---

Hey all, a new version of Ubuntu Calculator App Reboot is on the store, ready
for the your tries! As usual, please report any bug you find on
[Launchpad][bugs], so we can fix them!

![translations stats](http://img.rpadovani.com/posts/translations-reboot.png)

Don't worry about the number of version, I know it is passed from *0.1.4* to
*2.0.73*, it's a bit strange but now makes more sense: the major release is 2,
because it's the reboot, but we don't have still a stable version, and so the 0.
The last number is the bzr commit.

Let me show you some of the changes [Bartosz][gang66] and [Giulio][gcollura] did
in last week - I was busy with an importat exam at uni, so I did nothing, but
I'm sure I'll have more time next week ;-)

## Translations

Bartosz enabled translations in the project, so since the next version you
should see the app in your language, if someone has made translations. So, if
you have some spare time, take a look to our [translation][i18n] page and make
calculator available in your language!

## Copy feature

Bartosz has also implemented the possibility to copy a calc from the
multiselection mode (you just have to longclick on a calc)

## Scrolling

In the previous version of reboot app, when you started the app not all the
keyboard was visible. Now, thanks to Giulio, this has been fixed, the app opens
in the right position.

## Full changelog

Here the full changelog:

- [#64][64] Fix scrolling position on app startup on devices. *(Giulio Collura)*
- [#65][65] Adding autopilot tests for calculation after gathering result. *(Bartosz Kosiorek)*
- [#66][66] Add feature to copy selected calculation from the history. *(Bartosz Kosiorek)*
- [#67][67] Add keyboard support for Calculation keyboard. *(Bartosz Kosiorek )*
- [#68][68] Fix ScrollableView behavior with few items visible. *(Giulio Collura)*
- [#69][69] Improve manifest.json generation. *(Giulio Collura)*
- [#70][70] Launchpad automatic translations update.
- [#71][71] Fix translation generation. *(Bartosz Kosiorek)*
- [#72][72] Launchpad automatic translations update.
- [#73][73] Updated math.js to 1.2.0. *(Riccardo Padovani)*

Ciao,<br/>
R.

[bugs]: https://bugs.launchpad.net/ubuntu-calculator-app
[gang66]: https://plus.google.com/105782724017692708794/posts
[gcollura]: https://plus.google.com/+GiulioCollura/posts
[i18n]: https://translations.launchpad.net/ubuntu-calculator-app
[64]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/64
[65]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/65
[66]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/66
[67]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/67
[68]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/68
[69]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/69
[70]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/70
[71]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/71
[72]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/72
[73]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/73

