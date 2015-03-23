---
layout: post
title:  "Calculator Reboot 2.0.139: The final countdown"
date:   2015-03-23 10:38
description: The calculator reboot it is ready to become the default calculator on Ubuntu for Phones. What are the last features we implemented?
categories:
- ubuntu phone
permalink: calculator-reboot-final-countdown
---

I know, it's more than a month I published a blog post about calculator reboot
status. But don't worry, also if I didn't write any post, [Bartosz][gang66] and
I worked hard on it, and now it should be **ready to become the default calculator**
app on the phone, we just need a green light by the QA team!

As usual, please report any bug you find on [Launchpad][bugs], so we can fix them!

Since is since end of January I don't write a post on calculator, I describe all
the things we did, also if some of these features are available on the store
since a while.

## New features

### Universal brackets

This is a feature by Bartosz: we don't have anymore two buttons for brackets
(one for *(* and one for *)*), but now there is only one button. When you press
it, **it magically understand if you need a open or a close bracket**. Seems
incredible, but it works very well. Give it a try and if you find a case where
it doesn't work, please report it to us.

### Clear formula

Now with long click on clear button you delete all the formula. Don't waste your
time anymore!

### Editing calculation from history

You want to reuse a old calc you did? Just try to swipe left the calc ;-)

### New design for keyboard

We have some new design specs: we will implement them after the release of
actual reboot. Meanwhile, we changed the keyboard accordingly.

[New design][img0]

### Empty state in favourite

We added an Empty state in favourite mode so now users know how to use that
feature. I know it's a bit confusing, we will improve it with *new* new design
in next weeks.

[Blank][img1]

### Translations

Thanks to Ubuntu community the calculator now it's available in a lot of
languages. They're amazing, work hard and we often forget them. So, **this is my
personal thanks for you all translators! We love you!**

If you don't have the app in your language, take a look to our
[translation][i18n] page and help us :-)

## Full changelog

Here the changelog with features we added. Missing revisions are translations. I
don't report them because the commit message is always the same (*Launchpad
automatic translations update.*), so it isn't useful to understand which
languages have new translations. Please see [this page][i18n] to have a full
vision on translations status:

- [#86][86] Add universal bracket support. *(Bartosz Kosiorek)*
- [#90][90] Fix bug #1416667. Add error animation. Set anchorToKeyboard to true. *(Giulio Collura)*
- [#91][91] Change Euler number display character. *(Bartosz Kosiorek)*
- [#92][92] Deletion fix. *(Bartosz Kosiorek)*
- [#98][98] Add clear formula feature, by long pressing delete button. *(Bartosz Kosiorek)*
- [#102][102] Added tests for square and cube functions. *(Andrea Cerisara)*
- [#104][104] Add possibility of editing calculation from history, by swiping left and select "Edit" option. *(Bartosz Kosiorek)*
- [#105][105] Added the select none action in multiselection mode when all calcs are selected. *(Riccardo Padovani)*
- [#106][106] Added tests for power and log. *(Andrea Cerisara)*
- [#116][116] Fixed broken tests. *(Riccardo Padovani)*
- [#117][117] Updated math.js to 1.4.0. *(Riccardo Padovani)*
- [#118][118] Fix adding decimal separator, at the beginning of the formula. *(Bartosz Kosiorek)*
- [#119][119] Added tests for sin, cos and factorial. *(Andrea Cerisara)*
- [#121][121] Allow to change favourites from calculation history. *(Bartosz Kosiorek)*
- [#122][122] Optimize autopilot tests for scientific switching. *(Bartosz Kosiorek)*
- [#129][129] Change keypad layout according to latest design. *(Bartosz Kosiorek)*
- [#134][134] Add complex numbers validation. *(Bartosz Kosiorek)*
- [#137][137] Use EmptyState from UCS to have a text in favourite page when is empty. *(Riccardo Padovani)*

Ciao,<br/>
R.

As usual, I do all this in my spare time, at night because during the day I
have to study. Do you mind to [buy me a coffee][coffee] to help me to stay
awake? :-)

[bugs]: https://bugs.launchpad.net/ubuntu-calculator-app
[gang66]: https://plus.google.com/105782724017692708794/posts
[img0]: http://img.rpadovani.com/posts/newCalculatorDesign.jpg
[img1]: http://img.rpadovani.com/posts/favouritesBlank.jpg
[i18n]: https://translations.launchpad.net/ubuntu-calculator-app
[coffee]: http://rpadovani.com/donations/
[86]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/86
[90]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/90
[91]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/91
[92]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/92
[98]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/98
[102]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/102
[104]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/104
[105]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/105
[106]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/106
[116]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/116
[117]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/117
[118]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/118
[119]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/119
[121]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/121
[122]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/122
[129]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/129
[134]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/134
[137]: https://bazaar.launchpad.net/~ubuntu-calculator-dev/ubuntu-calculator-app/reboot/revision/137


