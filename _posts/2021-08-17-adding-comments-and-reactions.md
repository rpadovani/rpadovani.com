---
layout: post
title:  "Adding comments to the blog"
date:   2021-08-17 22:00
description: "Finally, after years of blogging, I added comments and reactions to the website, thanks to Hyvor"
categories:
- meta
permalink: add-comments
cover: https://img.rpadovani.com/posts/be_excellent.jpg
---
 
After years of blogging, I've finally chosen to add a comment system, including reactions, to this blog. I've done so to make it easier engaging with the four readers of my blabbering: of course, it took some time to choose the right comment provider, but finally, here we are!

<figure>
    <img src="https://img.rpadovani.com/posts/be_excellent.jpg" alt="cover" />
    <figcaption>
      <p><span>A picture I took at the CCC 2015 - and the moderation policy for comments!</span></p>
    </figcaption>
  </figure>

I've chosen, long ago, to do not put any client-side analytics on this website: while the nerd in me loves graph and numbers, I don't think they are worthy of the loss of privacy and performance for the readers. However, I am curious to have feedback on the content I write, if some of them are useful, and how can I improve. In all these years, I've received different emails about some posts, and they are heart-warming. With comments, I hope to reduce the friction in communicating with me and having some meaningful interaction with you.

# Enter hyvor.com

Looking for a comment system, I had three requirements in mind: being **privacy-friendly**, being **performant**, and being managed by somebody else.

A lot of comments system are _"free"_, because they live on advertisements, or tracking user activities, and more often a combination of both. However, since _I_ want comments on _my_ website, I find dishonest that *you*, the user, has to pay the price for it. So, I was looking for something that didn't track users, and bases its business on dear old money. My website, my wish, my wallet.

I find **performances** important, and unfortunately, quite undervalued on the bloated Internet. I like having just some HTML, some CSS, and the minimum necessary of JavaScript, so whoever stumbles on these pages don't waste CPU and time waiting for some rendering. Being a static website, there isn't a server side, so I cannot put comments there. I had to find a really light JavaScript based comment system.

Given these two prerequisites, you would say the answer is obvious: find a comment system that you can _self-host_! And you would be perfectly right - however, since I spend already 8 hours a day keeping stuff online, I really don't want to have to care about performance and uptime in my free time - I definitely prefer going drinking a beer with a friend. 

After some shopping around, I've chosen to go with [Hyvor Talk][hyvor-talk], since it checks all three requirements above. I've read nice things about it, so let's see how it goes! And if you don't see comments at the end of the page, probably a privacy plugin for your browser is blocking it - up to you if you want to whitelist my website, or communicate with me in other ways ;-)

A nice plus of Hyvor is they also support reactions, so if you are in an hurry but want still to leave a quick feedback on the post, you can simply click a button. Fancy, isn't it?

# Moderation

Internet can be ugly sometime, and this is why I will keep a strict eye on the comments, and I will probably adjust moderation settings in the future, based on how things evolve - maybe no-one will comment, then no need for any strict moderation! The only rule I ask you to abide, and I've put as moderation policy, is: "**Be excellent to each other**". I've read it at the [CCC Camp 2015][ccc-camp], and it sticks with me: as every short sentence, cannot capture all the nuances of human interaction, but I think it is a very solid starting point. If you have any concern or feedback you prefer to do not express in public, feel free to reach me through email. Otherwise, I hope to see you all in the comment section ;-)

<aside><p>Be excellent to each other!</p></aside>

Questions, comments, feedback, critics, suggestions on how to improve my English? Reach me on Twitter ([@rpadovani93][twitter]) or drop me an email at [riccardo@rpadovani.com][email]. Or, from today, **leave a comment below**!
  
Ciao,  
R.

[twitter]: https://twitter.com/rpadovani93
[email]: mailto:riccardo@rpadovani.com

[hyvor-talk]: https://talk.hyvor.com
[ccc-camp]: https://events.ccc.de/camp/2015/wiki/Main_Page
