---
layout: page
title: Blog archive
permalink: /blog
intro: "All the posts I have written over the years."
---
{% for post in site.posts %}
{% capture currentyear %}{{post.date | date: "%Y"}}{% endcapture %}
{% if currentyear != year %}

# {{ currentyear }}

{% capture year %}{{currentyear}}{% endcapture %} 
{% endif %}

<small>{{post.date | date_to_long_string}}</small>

[{{ post.title }}]({{ post.url | prepend: site.baseurl }})

{% endfor %}
