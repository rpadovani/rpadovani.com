---
layout: post
title:  "Let's encrypt the world!"
date:   2015-11-05 10:45
description: "rpadovani.com now uses Let's Encrypt certificates to protect your privacy"
categories:
- security
permalink: encrypt-the-world
---

Hello all, <br/>
as the most attentive of you will have noticed, connection to this website is
now via HTTPS, and so it is the connection to all my sub-domains, with valid
certificates, thanks to [Let's Encrypt][le]

![Crypted][img0]

## What's HTTPS?

Well, as you know I'm not a native speaker, so I'll steal from [Wikipedia][we]
the definition:

> HTTPS is a protocol for secure communication over a computer network which is
> widely used on the Internet. HTTPS consists of communication over HTTP within
> a connection encrypted by Transport Layer Security. The main motivation for
> HTTPS is authentication of the visited website and to protect the privacy and
> integrity of the exchanged data.

### Why it matters

When they were first developed in the 1990s, HTTPS and SSL/TLS were considered
_special_ protections that were only necessary or useful for particular kinds of
websites, like online banks and shopping sites accepting credit cards. We’ve
since come to realize that HTTPS is important for almost all websites. It’s
important for any website that allows people to log in with a password, any
website that tracks its users in any way, any website that doesn’t want its
content altered, and for any site that offers content people might not want
others to know they are consuming. We’ve also learned that any site not secured
by HTTPS can be used to attack other sites.

**TLS is no longer the exception, nor should it be.**

([Source][source])

## What's Let's Encrypt?

From [Let's Encrypt website][about]:

Let’s Encrypt is a free, automated, and open certificate authority (CA), run for
the public’s benefit. Let’s Encrypt is a service provided by the Internet
Security Research Group (ISRG).

The key principles behind Let’s Encrypt are:

- **Free**: Anyone who owns a domain name can use Let’s Encrypt to obtain a trusted certificate at zero cost.
- **Automatic**: Software running on a web server can interact with Let’s Encrypt to painlessly obtain a certificate, securely configure it for use, and automatically take care of renewal.
- **Secure**: Let’s Encrypt will serve as a platform for advancing TLS security best practices, both on the CA side and by helping site operators properly secure their servers.
- **Transparent**: All certificates issued or revoked will be publicly recorded and available for anyone to inspect.
- **Open**: The automatic issuance and renewal protocol will be published as an open standard that others can adopt.
- **Cooperative**: Much like the underlying Internet protocols themselves, Let’s Encrypt is a joint effort to benefit the community, beyond the control of any one organization.

## How this website uses HTTPS

I requested 4 certificates, two for public domains and two for private domains.
My private domains were already protected by self signed certificates, but now I
can share documents to anyone without having to bother about accepting untrusted
certificates.

The two public domains I requested certificates for are rpadovani.com and
img.rpadovani.com. In this way all my posts are protected, also the ones which
load images from my server. Also fonts and all others assets are loaded from my
server, and now it's all protected.

And all for free, without having to spend time in the configuration.

**Great job, Let's Encrypt!**

## What you can do

At the moment, Let's Encrypt is in a closed beta, but it will be public
available since 16th of November. So, if you have any website, consider to
create certificates for it: it's free, it's easy and it makes the web a better
place.

Ciao<br/>
R.

[le]: https://letsencrypt.org/
[we]: https://en.wikipedia.org/wiki/HTTPS
[img0]: https://img.rpadovani.com/posts/ssl.png
[source]: https://letsencrypt.org/2015/10/29/phishing-and-malware.html
[about]: https://letsencrypt.org/about/
