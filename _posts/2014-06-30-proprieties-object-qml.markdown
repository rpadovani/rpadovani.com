---
layout: post
title:  "How to know proprieties and values of an object in QML"
date:   2014-06-30
description: A simple function to debug objects in QML
categories:
- blog
permalink: how-to-know-proprieties-and-values-of-an-object-in-qml
tags: javascript, qml, ubuntu touch
---

Hi all,
few days ago, working on an app for Ubuntu for Phones I needed to know all
proprieties and values of an object during the execution of the app.
It’s a very easy thing to do, but a bit boring to write the code to debug every
time, so I wrote a little function to do this, with formattation of the output.

Hope it will be useful to someone :-)

So, to call the function we only need to write debug (objectId, 0) whenever we
need to debug an object.
0 is because it’s a recursive function, and it indicates the level of
formattation

{% highlight javascript %}
function debug(id, level) {
    var level_string = '';

    // If isn't a first level function, add some formattation
    for (var i = 0; i < level; i++) {
        if (i+1 === level) {
            level_string += '|--------';
        }
        else {
            level_string += '         ';
        }
    }

    if (level === 0) {
        level_string = 'property ';
    }
    else {
        level_string += '> ';
    }

    // For every value in the object
    for (var value in id) {

        // We need to don't take care of these elements because the output is too long. I mean, do you want to print all children of the parent? :-)
        // If you are interesting in the output of anchors, set a maximum to leveles of recursion
        if (value != 'parent' && value != 'anchors' && value != 'data' && value != 'resources' && value != 'children') {
            // Functions haven't children and aren't property
            if (typeof(id[value]) === 'function') {
                if (level === 0) {
                    console.log('function ' + value + '()');
                }
                else {
                    console.log(level_string + 'function ' + value + '()');
                }
            }
            // Objects have children
            else if (typeof(id[value]) === 'object') {
                console.log(level_string + value + ' [object]');
                debug(id[value], level+1);
            }
            // Of all others things we print value and type :-)
            else {
                console.log(level_string + value + ': ' + id[value] + ' [' + typeof(id[value]) + ']');
            }
        }
    }
}
{% endhighlight %}
