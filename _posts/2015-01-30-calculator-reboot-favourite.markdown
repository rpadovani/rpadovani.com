---
layout: post
title:  "Calculator Reboot 2.0.85: Favourite mode"
date:   2015-01-30 20:02
description: A new version of the beta of calculator app is in the store. What's new?.
categories:
- ubuntu phone
permalink: calculator-reboot-favourite
---

Yes, yes, I know, I'm late with this update. You expected it yesterday, as
usual, but I have a good reason. Today we landed some new sparkling features, so
now you can test them :-) As usual, please report any bug you find on
[Launchpad][bugs], so we can fix them!

So, it's time to show you what [Bartosz][gang66], [Giulio][gcollura] and I did
last week

## New features

### Favorite mode

I described it when I presented you the [design][design] of the Calculator
Reboot, and now it's time to see it in action! With favorite feature you can
save your old calcs, to have a history with things you have to remember. Plus,
it is implemented in the *bottom edge* page; who has an Ubuntu Phone knows what
I'm talking about. It's a very cool gesture you can find in action [there][be].

![Favourite history][img1]

We worked hard on this, but it isn't complete yet - so if you find any bug or
you have a feedback, contact us on Launchpad, on social networks or wherever you
can find us :-)

### Autoclose brackets

This is an idea by [Daniel Wood][dwood] who commented last week post on G+. See?
It's important to leave us feedbacks, we try to implement them as soon as
possible!

So, now, when you click on equals the calculator closes all brackets you left
open. So no more errors when you forgot to close a bracket, we fix it for you.

### Inline copy

Thanks to Giulio we now could swype a calc from right to left to copy it - it
isn't necessary anymore to long click on it.

![Inline copy][img2]

### Translations

Thanks to Ubuntu community the calculator now it's available in a lot of
languages. Wow, I asked help for translations only one week ago and we already
have the app completely translated in 15 languages (and a lot of other languages
has a good portion of strings already translated). If you don't have the app in
your language, take a look to our [translation][i18n] page!

## Bugfixes

### Portrait mode

Thanks to Giulio we have a better view in portrait mode: he changed proportions,
so now on *krillin* you can see also the last calc you did, and not only the
current one.

### Keypad flicking

Bartosz fixed the infinite scrolled of keyboard. Now if you try to swipe left or
right over the edge of the keyboard you will see a nice bounce animation that
keeps the keyboard on the screen

## Full changelog

Here the full changelog:

- [#74][74] Launchpad automatic translations update.
- [#75][75] Add swipe to copy feature on single calculation. Add pressed button effect and fix button height on landscape mode. *(Giulio Collura)*
- [#76][76] Do not allow flicking above edge of keypad. *(Giulio Collura)*
- [#77][77] Launchpad automatic translations update.
- [#78][78] Launchpad automatic translations update.
- [#79][79] Fix warning: QML TextInput: Binding loop detected for property. *(Bartosz Kosiorek)*
- [#80][80] Fix Click package configuration. *(Bartosz Kosiorek)*
- [#81][81] Add min press duration so tests don't randomly fail. *(Nicholas Skaggs)*
- [#82][82] New feature: auto close brackets at the end of a calc, if needed. *(Riccardo Padovani)*
- [#83][83] Launchpad automatic translations update.
- [#84][84] Fix button height on certain devices and window sizes. Fix PortraitKeyboard filename. *(Giulio Collura)*
- [#85][85] Implemented favourite feature as per design. *(Riccardo Padovani)*

Ciao,<br/>
R.

As usual, I do all this in my spare time, at night because during the day I
have to study. Do you mind to [buy me a coffee][coffee] to help me to stay
awake? :-)

[bugs]: https://bugs.launchpad.net/ubuntu-calculator-app
[gang66]: https://plus.google.com/105782724017692708794/posts
[gcollura]: https://plus.google.com/+GiulioCollura/posts
[be]: http://design.canonical.com/2014/03/loving-the-bottom-edge/
[design]: http://rpadovani.com/ubuntu-calculator-app-reboot/
[img1]: http://rpadovani.com/img/posts/answer.png
[img2]: http://rpadovani.com/img/posts/inline-copy.png
[dwood]: https://plus.google.com/+DanielWood/posts
[i18n]: https://translations.launchpad.net/ubuntu-calculator-app
[coffee]: http://rpadovani.com/donations/
[74]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/74
[75]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/75
[76]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/76
[77]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/77
[78]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/78
[79]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/79
[80]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/80
[81]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/81
[82]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/82
[83]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/83
[84]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/84
[85]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/85

