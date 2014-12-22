---
layout: post
title:  "Farewell Google"
date:   2013-12-23
description: How to avoid Google and use open source software on Android
categories:
- privacy
permalink: farewell-google-welcome-f-droid
tags: privacy
---

After the [PRISM scandal][prism] and after thinking about how much data I give
to Google (and to other company) on a daily basis I choose to take care of my
privacy more than before. One of most intrusive abuse of our privacy is our
smartphone: it communicates in real time so much data that companies can profile
you and know you better than you know yourself.

A possible solution is to use only free software on your phone; unfortunately
both [Ubuntu Touch][ubuntu] and [Firefox OS][firefox] are too premature for my
needs, so I have to use [CyanogenMod][cyano] and avoid to use intrusive app. Let
me explain you what I did, and please should considere to use more free software
app as possible.

I choose to use CyanogenMod as system because is probabily most famous Android
Rom, with a great support and always update. For my Samsung Galaxy S4 there is
version 11 yet, with Android 4.4.2. Unfortunately there are some blob, that are
proprietary driver, but the rest is almost completely free software.

After I flashed the device (there is a guide on [official wiki][wiki], if you
are interesting) I didn’t flashed Google Apps, to have not proprietary service
from Google on the phone. The first thing we need is a store, without PlayStore
we can’t install app! Obviusly, there is a solution: it’s called
[F-Droid][fdroid], is a market with only Free Software: you can download it from
its site, and then use it like Play Store. It isn’t so cool as official store,
but freedom has a price ;-)

First app I install is the browser: I choose [Firefox][browser], it’s open-
source and have sync with desktop, where I use Firefox too. As well as for
browsing the web I use it as a subsitute for Facebook, Google Plus and Twitter,
because I don’t know an open-source client for social networks. The disadvantage
is that you do not have push notifications but, hey, this significantly
increases the productivity! Social networks aren’t my work, so if I check
updates once an hour isn’t a drama.

Second most important app for me it’s mail client: instead of the app by default
I use [K-9 Mail][mail], a very powerful app with support for [GPG][gpg].
Awesome! To replace Google Maps I suggest [OsmAnd~][osm], a client for
[OpenStreetMap][map], a project like Wikipedia, but for maps. If you need to
sync your calendar and your contacts with a server that supports DAV the
solution is [DAVdroid][dav]: I use it to sync contact and appointments with my
istance of [ownCloud][own], and I use [official client][client] for Android to
access to my files on my server.

As music player I think the best choice is [Apollo][apollo], that is default on
Cyanogenmod, to search on web I use, like on desktop, [DuckDuckGo][ddg], a
search engine that respect your privacy. For RSS reader I choose [TTRSS-
Reader][rss], because I have a istance of Tiny Tiny Rss on my server. For two
step authentication I use a old version of Google Authenticator, when it was
still free , but [I’m working][freeotp] to have FreeOTP on F-Droid: FreeOTP is a
free authenticator developed by Red Hat.

Other apps that I think are interesting are [AdAway][adaway], to block
intruisive advertisements, [UberSync][ubersync], to sync your FB contacts with
your address book, and [Wikipedia][wikipedia], because knowledge is power. You
can find others substitutes on [Prism Break][break].

Only closed app I use is Whatsapp, but I want to delete it soon. You can
download it from official website, without Play Store.

I hope that these alternatives may be useful to someone :-) And you, which free
apps use?

[prism]: http://www.theguardian.com/world/interactive/2013/nov/01/snowden-nsa-files-surveillance-revelations-decoded
[ubuntu]: http://www.ubuntu.com/phone
[firefox]: https://www.mozilla.org/en-US/firefox/os/
[cyano]: http://www.cyanogenmod.org/
[wiki]: http://wiki.cyanogenmod.org/
[fdroid]: https://f-droid.org/
[browser]: https://f-droid.org/repository/browse/?fdid=org.mozilla.firefox
[mail]: https://f-droid.org/repository/browse/?fdid=com.fsck.k9
[gpg]: https://f-droid.org/repository/browse/?fdid=org.thialfihar.android.apg
[osm]: https://f-droid.org/repository/browse/?fdid=net.osmand.plus
[map]: http://www.openstreetmap.org/
[dav]: https://f-droid.org/repository/browse/?fdid=at.bitfire.davdroid
[own]: http://owncloud.org/
[client]: https://f-droid.org/repository/browse/?fdid=com.owncloud.android
[apollo]: https://f-droid.org/repository/browse/?fdid=com.andrew.apollo
[ddg]: https://f-droid.org/repository/browse/?fdid=com.duckduckgo.mobile.android
[freeotp]: https://fedorahosted.org/freeotp/ticket/3
[adaway]: https://f-droid.org/repository/browse/?fdid=org.adaway
[ubersync]: https://f-droid.org/repository/browse/?fdid=ro.weednet.contactssync
[wikipedia]: https://f-droid.org/repository/browse/?fdid=org.wikipedia
[break]: http://prism-break.org/
