---
layout: post
title:  "Responsible disclosure: retrieving a user's private Facebook friends."
date:   2018-09-23 09:00
description: "Responsible disclosure of a bug that allowed an attacker to see a victim's private Facebook friends, with only knowledge of the victim's email address."
categories:
- security
permalink: facebook-responsible-disclosure
---

Data access control isn't easy. While it can sound quite simple (just give
access to the authorized entities), it is very difficult, both on a theoretical
side (who is an authorized entity? What does authorized mean? And how do we
identify an entity?) and on a pratical side.

On the pratical side, how we will see, disclose of private data is often a
unwanted side effect of an useful feature.

## Facebook and Instagram

Facebook bought Instagram back in 2012. Since then, a lot of integrations have
been implemented between them: among the others, when you suscribe to Instagram,
it will suggest you who to follow based on your Facebook friends. 

Your Instagram and Facebook accounts are then somehow linked: it happens both if
you sign up to Instagram using your Facebook account (doh!), but also if you
sign up to Instagram creating a new account but using the same email you use in
your Facebook account (there are also other way Instagram links your new account
with an existing Facebook account, but they are not of our interest here).

So if you want to create a _secret_ Instagram account, create a new mail for it
;-)

Back in topic: Instagram used to enable all its feature to new users, **before**
they have confirmed their email address. This was to do not "interrupt" usage of
the website / app, they would have been time to confirm the email later in their
usage.

Email address confirmation is useful to confirm you are signing up using your
own email address, and not one of someone else.

## Data leak

One of the features available **before** confirming the email address, was the
suggestion of who to follow based on the Facebook friends of the account
Instagram automatically linked.

This made super easy to retrieve the Facebook's friend list of anyone who
doesn't have an Instagram account, and since there are more than 2 billions
Facebook accounts but just 800 millions Instagram accounts, it means that at
least 1 billion and half accounts were vulnerable.

The method was simple: knowing the email address of the target (and an email
address is all but secret), the attacker had just to sign up to Instagram with
that email, and then go to the suggestions of people to follow to see victim's
friends.

![List of victim's friends][image]

## Conclusion

The combination of two useful features (suggestion of people to follow based on
a linked Facebook account, being able to use the new Instagram account
immediately) made this data leak possible. 

It wasn't important if the attacker was a Facebook's friend with the victim, or
the privacy settings of the victim's account on Facebook. Heck, the attacker
didn't need a Facebook account at all!

## Timeline

- **20 August 2018**: first disclosure to Facebook
- **20 August 2018**: request of other information from Facebook
- **20 August 2018**: more information provided to Facebook
- **21 August 2018**: Facebook closed the issue saying wasn't a security issue
- **21 August 2018**: I submitted a new demo with more information
- **23 August 2018**: Facebook confirmed the issue
- **30 August 2018**: Facebook deployed a fix and asked for a test
- **12 September 2018**: Facebook awarded me a bounty

## Bounty

Facebook awarded me a $3000 bounty award for the disclosure. This was the first
time I was awarded for a [security disclosure for Facebook][whitehat], I am
quite happy with the result and I applaude Facebook for making all the process
really straightforward.

For any comment, feedback, critic, write me on Twitter ([@rpadovani93][twitter])
or drop an email at `riccardo@rpadovani.com`.

Regards,
R.

[whitehat]: https://www.facebook.com/whitehat
[twitter]: https://twitter.com/rpadovani93
[image]: https://img.rpadovani.com/posts/facebook-disclosure.png
