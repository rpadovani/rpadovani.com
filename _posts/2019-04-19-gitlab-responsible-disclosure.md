---
layout: post
title:  "Responsible disclosure: improper access control in Gitlab private project."
date:   2019-04-19 19:30
description: "Responsible disclosure of a bug that allowed an attacker to see a victim's private Facebook friends, with only knowledge of the victim's email address."
categories:
- security
permalink: gitlab-responsible-disclosure
---

As I said back in September with regard to a [responsible disclosure about Facebook][0], data access control isn't easy. While it can sound quite simple (just give
access to the authorized entities), it is very difficult, both on a theoretical
side (who is an authorized entity? What does authorized mean? And how do we
identify an entity?) and on a practical side.

This issue was firstly reported on [HackerOne][1] and was managed on the [Gitlab issues' tracker][2]. Both links are now publicly accessible.


## Summary of the issue

- Rogue user is added to a private group with dozen of projects
- The user's role in some projects changes
- Rogue is fired, and removed from the group: they still have access to projects where their role was changed

The second step could happen for a lot of different reasons:
- *rogue* is added as `master` - knowing this vulnerability, they decrease their privileges to stay in some projects (this is the only **malicious** one)
- *rogue* is added as `developer`, but they become responsible for some projects, and are promoted to `master` role
- *rogue* is added as `reporter`, and then they are promoted for a project, and so on.

When an admin removes a user from a private group, there is no indication that the user still has access to private projects, if their role was changed.

## Impact

User can still see all resources of a project of a secret group after they have been removed from the parent's group.

## Timeline

- **29 January 2018**: First disclosure to Gitlab
- **9 February 2018**: Gitlab confirmed the issue and triaged it, assigning a **medium** priority
- **25 February 2018**: I ask for a timeline
- **27 February 2018**: They inform me they will update me with a timeline
- **16 March 2018**: Almost two months are passed, I ask again for a timeline or suggest to go public since administrators of groups can easily check and avoid this vulnerability 
- **17 March 2018**: They inform me they will update me with a timeline, and ask to do not go public
- **Somewhere around December 2018**: the team think the issue has been fixed, and close the internal issue - without communicating with me
- **17 January 2019**: I ask for an update - they will never reply to this message
- **25 January 2019**: the security team sees this is still an issue
- **31 January 2019**: the fix is deployed in production and [publicly disclosed][3], without informing me
- **5 March 2019**: I ask again for another update
- **12 March 2019**: Gitlab says the issue has been fixed and awards me a bounty

## Bounty

Gitlab awarded me a $2000 bounty award for the disclosure.

If you follow my blog, you know I deeply love Gitlab: I contribute to it, I write blog posts, and I advocate for it any time I can. Still, I think this experience was *awful*, to say the least. 
There was a total lack of communication by their side, they thought they fixed the issue the first time, but actually, it wasn't fixed. If they had communicated with me, I would have double checked their work.
After that, they deployed the fix and went public, without telling me. I was not interested in the bounty (for which I am grateful), I reported the issue because I care about Gitlab. 
Nonetheless, my love for Gitlab is still the same! I just hope they will improve this part of communication / contributing to Gitlab: in the last couple of years the [community around the project grew a lot][4], and they are doing amazing with it, maybe the Community team should step in and help also the security community?

For any comment, feedback, critic, write me on Twitter ([@rpadovani93][twitter])
or drop an email at `riccardo@rpadovani.com`.

Regards,  
R.

[0]: https://rpadovani.com/facebook-responsible-disclosure
[1]: https://hackerone.com/reports/310185
[2]: https://gitlab.com/gitlab-org/gitlab-ce/issues/42726
[3]: https://about.gitlab.com/2019/01/31/security-release-gitlab-11-dot-7-dot-3-released/
[4]: https://about.gitlab.com/2019/04/17/contributor-program-update/
[twitter]: https://twitter.com/rpadovani93
[image]: https://img.rpadovani.com/posts/gitlab-disclosure.png
