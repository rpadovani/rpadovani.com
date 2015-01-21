---
layout: post
title:  "Create your first game with Bacon2D"
date:   2014-09-21
description: Bacon2D is a very powerful framework to create 2D games in QML.
categories:
- bacon2d
- qml
- ubuntu phone
permalink: create-your-first-game-with-bacon2d
---

Hi all,
after long time I return to write to show you how to create a simple game for
Ubuntu for Phones (but also for Android) with [Bacon2D][bacon2d].

> Bacon2D is a framework to ease 2D game development, providing ready-to-use QML
elements representing basic game entities needed by most of games.

In this tutorial I’ll explain you how I create my first QML game, 100balls,
that you could find on Ubuntu Store on Phones. Source is available on
[GitHub][github].
This is not a tutorial on QML or Javascript, so I focus only on Bacon2D
components, and I leave to you all other things, such implementing advanced
features in the game, and I suppose that you already know QML.
100balls is a very simple but addictive game. You have to put as many balls as
you can in a moving glass, trying to not lose any.

## Installation

So, first of all we need to install Bacon2D on our system. I suppose you have
already installed Qt on your system, so we only need to take source and compile
it:

{% highlight bash %}
git clone https://github.com/Bacon2D/Bacon2D.git
git submodule update --init
cd Bacon2D
mkdir build && cd build
qmake ..
make
sudo make install
{% endhighlight %}

Now you have Bacon2D on your system, and you can import it in every project you
want.

## A first look to Bacon2D

Bacon2D provides a good number of custom components for your app. Of course,
I can’t describe them all in one article, so please read the [documentation][documentation].
We’ll use only few of them, and I think the best way to introduce you to them
is writing the app.
So, let’s start!

First of all, we create our base file, called 100balls.qml:

{% highlight javascript %}
import QtQuick 2.0
import Bacon2D 1.0
{% endhighlight %}

The first element we add is the **Game** element. Game is the top-level container,
where all the game will be. We set some basic property and the name of the game,
with gameName property:

{% highlight javascript %}
import QtQuick 2.0
import Bacon2D 1.0

Game {
    id: game
    anchors.centerIn: parent

    height: 680
    width: 440

    gameName: "com.ubuntu.developer.rpadovani.100balls" // Ubuntu Touch name format, you can use whatever you want
}
{% endhighlight %}

But the Game itself is useless, we need to add one or more **Scene** to it.
A scene is the place where all **Entity** of the game will be placed.
Scene has a lot of property, for now is importat to set two of them: *running*
indicates if all things in the scene will move, and if game engine works; second
property is *physics*, that indicates if [Box2D][box2d] has to be used to
simulate physic in the game. We want a game where some balls fall, so we need
to set it to true.

Also, we need to set a Game property: *currentScene*. It indicates, as name
said, which is the currentScene, so you could have more than one scene, and
change them during the game. Maybe you want to use a Scene as main menu, or you
have more than one level, and every level is a scene, and so on. You specify
which is the current scene by its id.

{% highlight javascript %}
import QtQuick 2.0
import Bacon2D 1.0

Game {
    id: game
    anchors.centerIn: parent

    height: 680
    width: 440

    gameName: "com.ubuntu.developer.rpadovani.100balls" // Ubuntu Touch name format, you can use whatever you want

    currentScene: gameScene

    Scene {
        id: gameScene
        physics: true
        running: true

        anchors.fill: parent
    }
}
{% endhighlight %}

Now we have a game, and a scene where we want to run our game. So, in our game
we need 100 balls, it’s time to create them!
A ball is an **entity**, that is basic game entity, includes physics (Box2D)
properties, responds to scene updates and can contain game logic.
To manage balls easily we create a new component in a new file. All components
should be in the “components” folder. We call the file Ball.qml, and we put in
it something like this:

{% highlight javascript %}
import QtQml 2.2
import QtQuick 2.0
import Bacon2D 1.0

Component {
    Entity {
        id: ballEntity
        height: 13
        width: 13

        Rectangle {
            // This is the drawn ball
            radius: parent.width / 2

            color: Qt.rgba(0.86, 0.28, 0.07, 1)  // #DD4814

            height: parent.height
            width: parent.width
        }
    }
}
{% endhighlight %}

This should be easy to understand, there is nothing related to Bacon2D: we
created a Rectangle with a radius that is half of its size: a circle.
We could easily add 100 of them in our scene:

{% highlight javascript %}
import QtQuick 2.0
import Bacon2D 1.0
import "components"

Game {
    id: game
    anchors.centerIn: parent

    height: 680
    width: 440

    gameName: "com.ubuntu.developer.rpadovani.100balls" // Ubuntu Touch name format, you can use whatever you want
    currentScene: gameScene

    Scene {
        id: gameScene
        physics: true
        running: true

        anchors.fill: parent

        Ball {
            id: ball
        }

        Component.onCompleted: {
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 10; j++) {
                    var newBox = ball.createObject(gameScene.world);
                    newBox.x = gameScene.width / 2 - 100 + 15*j;
                    newBox.y = (15*i) - 10;
                }
            }
        }
    }
}
{% endhighlight %}

Again, nothing strange: I imported Ball.qml and created 100 of them. Should be
interesting to see that I didn’t attach the balls to scene itself, but to the
world that the scene creates. Althought you’ll don’t use the world component on
its own again, it’s important this distinction: objects that you want to add in
a scene have to be attached to the world component.

Now, if you run your app you should have something like this:
![Our first game](http://img.rpadovani.com/posts/100balls-first.png)

Yes, nothing so exciting. Maybe we need to add some physic to the balls.
First of all, we need to say to Bacon 2D what are the outlines of our balls:
we’ll use the *fixtures* property:

{% highlight javascript %}
fixtures: Circle {
    anchors.centerIn: parent
    radius: parent.width / 2

    density: 1
    friction: 0.5
    restitution: 0.2
}
{% endhighlight %}

Fixture itself it’s quite interesting, with a [rich documentation][fixture].
Of all properties I’m interested in only 3:

 - *density*: This property represents the density used to compute the mass properties of the parent entity.
 - *friction*: Friction is used to make objects slide along each other realistically.
 - *restitution*: Restitution is used to make objects bounce.

We add this fixtures to Ball.qml, along with other 2 properties: *bodyType*,
that could be Entity.Static, Entity.Kinematic or Entity.Dynamic and
*sleepingAllowed*. What does sleep mean? Well it is expensive to simulate
bodies, so the less we have to simulate the better. When a body comes to rest
we would like to stop simulating it. Unfortunately, our balls can’t sleep,
because is needed a collision to wake up them, and there aren’t collisions in
our game. As bodyTime we choose Entity.Dynamic, so the body is fully simulated.

{% highlight javascript %}
import QtQml 2.2
import QtQuick 2.0
import Bacon2D 1.0

Component {
    Entity {
        id: ballEntity
        height: 13
        width: 13

    bodyType: Entity.Dynamic
        sleepingAllowed: false

        fixtures: Circle {
            // This is the physic entity
            anchors.centerIn: parent
            radius: parent.width / 2
            density: 1
            friction: 0.5
            restitution: 0.2
        }

        Rectangle {
            // This is the drawn ball
            radius: parent.width / 2

            color: Qt.rgba(0.86, 0.28, 0.07, 1)  // #DD4814

            height: parent.height
            width: parent.width
        }
    }
}
{% endhighlight %}

Now, if you start the app you’ll see the balls fall! Yeah! Things are becoming
pretty interesting, aren’t them?

## Building the game

We want that users choose when the balls have to fall, so we create a new
component, called Bowl.qml, in the folder components. As before, we need to
draw it and to create fixtures. This is a bit boring, because you have to think
to all sizes. So, this is the file:

{% highlight javascript %}
import QtQuick 2.0
import Bacon2D 1.0

Entity {
    height: 300
    width: 250

    fixtures: [
        // Left border
        Edge {
            vertices: [
                Qt.point(0, 0),
                Qt.point(0, parent.height * 2/5)
            ]
        },
        Edge {
            vertices: [
                Qt.point(0, parent.height * 2/5),
                Qt.point(parent.width * 3/8, parent.height * 3/5)
            ]
        },
        Edge {
            vertices: [
                Qt.point(parent.width * 3/8, parent.height * 3/5),
                Qt.point(parent.width * 3/8, parent.height)
            ]
        },

        // Right border
        Edge {
            vertices: [
                Qt.point(parent.width, 0),
                Qt.point(parent.width, parent.height * 2/5)
            ]
        },
        Edge {
            vertices: [
                Qt.point(parent.width, parent.height * 2/5),
                Qt.point(parent.width * 5/8, parent.height * 3/5)
            ]
        },
        Edge {
            vertices: [
                Qt.point(parent.width * 5/8, parent.height * 3/5),
                Qt.point(parent.width * 5/8, parent.height)
            ]
        },

        // Top pyramid
        Edge {
            vertices: [
                Qt.point(parent.width / 4, parent.height / 4),
                Qt.point(parent.width / 2, parent.height / 8),
            ]
        },
        Edge {
            vertices: [
                Qt.point(parent.width / 2, parent.height / 8),
                Qt.point(parent.width * 3/4, parent.height / 4)
            ]
        }
    ]

    Canvas {
        id: canvas
        anchors.fill: parent

        onPaint: {
            var context = canvas.getContext("2d")
            context.beginPath();
            context.lineWidth = 5;

            // Left border
            context.moveTo(0, 0);
            context.lineTo(0, height * 2/5);
            context.lineTo(width * 3/8, height * 3/5);
            context.lineTo(width * 3/8, height);

            // Right border
            context.moveTo(width, 0);
            context.lineTo(width, height * 2/5);
            context.lineTo(width * 5/8, height * 3/5);
            context.lineTo(width * 5/8, height);

            // Pyramid
            context.moveTo(width / 4, parent.height / 4);
            context.lineTo(width / 2, parent.height / 8);
            context.lineTo(width * 3/4, parent.height / 4);

            context.strokeStyle = "black";
            context.stroke();
        }
    }
}
{% endhighlight %}

Nothing new here. Yes, there is the Canvas element, but I think it’s easy to
understand. Anyway, I don’t want to explain Canvas in this tutorial, so please
read the [official documentation][canvas].

We need to import the new component in the main file, just before the ball element:

{% highlight javascript %}
import QtQuick 2.0
import Bacon2D 1.0
import "components"

Game {
    id: game
    anchors.centerIn: parent

    height: 680
    width: 440

    gameName: "com.ubuntu.developer.rpadovani.100balls" // Ubuntu Touch name format, you can use whatever you want
    currentScene: gameScene

    Scene {
        id: gameScene
        physics: true
        running: true

        anchors.fill: parent

        Bowl {
            id: bowl
            anchors.horizontalCenter: parent.horizontalCenter
        }

        Ball {
            id: ball
        }

        Component.onCompleted: {
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 10; j++) {
                    var newBox = ball.createObject(gameScene.world);
                    newBox.x = gameScene.width / 2 - 100 + 15*j;
                    newBox.y = (15*i) - 10;
                }
            }
        }
    }
}
{% endhighlight %}

Try to start the app now, it’s beatiful, isn’t it?
Next thing to do is to create the door, and to check the input from the user to
open it.

There is a interesting thing in this code, so first I’ll show it, then I’ll
explain the new property:

{% highlight javascript %}
Entity {
    id: door
    height: 10
    width: 62.5       // This is the width of the bottleneck of the bowl
    anchors.top: bowl.bottom
    anchors.horizontalCenter: parent.horizontalCenter

    fixtures: Box {
        anchors.fill: parent
        sensor: isDoorOpen
        Edge {
            vertices: [
                Qt.point(0, 0),
                Qt.point(width, 0)
            ]
        }
    }

    Canvas {
        id: canvas
        visible: !isDoorOpen    // When the user clicks, hide this

        anchors.fill: parent

        onPaint: {
            var context = canvas.getContext("2d");
            context.beginPath();
            context.lineWidth = 5;

            context.moveTo(0, 0);
            context.lineTo(width, 0);

            context.strokeStyle = "black";
            context.stroke();
        }
    }
}
{% endhighlight %}

This entity is a line, and we put it at the end of the bottleneck. The
interesting part is inside a fixture: the *sensor* property. This property
determines if the fixtures is considered a sensor during collision detection.
If it’s a sensor, it doesn’t interfere with others entities. So, when our bool
property isDoorOpen becomes true, this element becomes a sensor, and balls can
fall.

When is the door open? Simple, when the user is pressing anywhere on the screen.
We only need a MouseArea to set this behavior:

{% highlight javascript %}
MouseArea {
    anchors.fill: parent
    onPressed: isDoorOpen = true;
    onReleased: isDoorOpen = false;
}
{% endhighlight %}

This is our 100balls.qml file now:

{% highlight javascript %}
import QtQuick 2.0
import Bacon2D 1.0
import "components"

Game {
    id: game
    anchors.centerIn: parent

    height: 680
    width: 440

    property bool isDoorOpen: false

    gameName: "com.ubuntu.developer.rpadovani.100balls" // Ubuntu Touch name format, you can use whatever you want
    currentScene: gameScene

    Scene {
        id: gameScene
        physics: true
        running: true

        anchors.fill: parent

        Bowl {
            id: bowl
            anchors.horizontalCenter: parent.horizontalCenter
        }

        Ball {
            id: ball
        }

    Entity {
        id: door
        height: 10
        width: 62.5       // This is the width of the bottleneck of the bowl
        anchors.top: bowl.bottom
        anchors.horizontalCenter: parent.horizontalCenter

        fixtures: Box {
           anchors.fill: parent
           sensor: isDoorOpen      // <- All game is here :-)
           Edge {
          vertices: [
              Qt.point(0, 0),
              Qt.point(width, 0)
          ]
           }
        }

        Canvas {
        id: canvas
        visible: !isDoorOpen    // When the user clicks, hide this

        anchors.fill: parent

        onPaint: {
            var context = canvas.getContext("2d");
            context.beginPath();
            context.lineWidth = 5;

            context.moveTo(0, 0);
            context.lineTo(width, 0);

            context.strokeStyle = "black";
            context.stroke();
        }
        }
    }

    MouseArea {
        anchors.fill: parent
        onPressed: isDoorOpen = true;
        onReleased: isDoorOpen = false;
    }

        Component.onCompleted: {
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 10; j++) {
                    var newBox = ball.createObject(gameScene.world);
                    newBox.x = gameScene.width / 2 - 100 + 15*j;
                    newBox.y = (15*i) - 10;
                }
            }
        }
    }
}
{% endhighlight %}

We have something interactive now! Wonderful, the app is starting to be a game!

## The glasses

Next step is building the glass where balls fall, then create a lot of them,
and check if balls pass trought them or outside.
As every new component, we create a file in the components folder and, with a
lot of fantasy, we call it Glass.qml

Again, first things first: we need to draw it, that is a bit boring. So for now
I write only the code to draw the glass:

{% highlight javascript %}
import QtQuick 2.0
import QtQml 2.2
import Bacon2D 1.0

Component {
    Entity {
        id: glass

        height: 80
        width: 80

        fixtures: [
            Edge {
                vertices: [
                    Qt.point(0, 0),
                    Qt.point(parent.width / 4, parent.height)
                ]
            },
            Edge {
                vertices: [
                    Qt.point(parent.width, 0),
                    Qt.point(parent.width * 3/4, parent.height)
                ]
            },
        ]

        Canvas {
            id: glassCanvas
            anchors.fill: parent

            onPaint: {
                var context = glassCanvas.getContext("2d");
                context.beginPath();
                context.strokeStyle = Qt.rgba(0.86, 0.28, 0.07, 1);        // #DD4814 - Ubuntu Orange
                context.moveTo(0, 0);
                context.lineTo(width / 4, height);
                context.lineTo(width * 3/4, height);
                context.lineTo(width, 0);
                context.stroke();
                context.fillStyle = Qt.rgba(0.86, 0.28, 0.07, 0.5);
                context.fill();
            }
        }
    }
}
{% endhighlight %}

Pretty simple, only a bit of math.
But we need also to understand when a ball falls in the glass, so we add a
sensor at the bottom of the glass, at the end of the fixtures:

{% highlight javascript %}
Edge {
    vertices: [
        Qt.point(parent.width / 4, parent.height),
        Qt.point(parent.width * 3/4 , parent.height)
    ]
    sensor: true
    onBeginContact: {
        other.parent.glassContact = true;
    }
}
{% endhighlight %}

Oh, wow, something new! What’s **onBeginContact**? Well, I think it explains
itself: it’s called when an object touches our sensor. Inside it you could use
the keyword *other.parent* to access to property of object that collides with the
sensor. So, I created a bool var in Ball.qml that manages contacts, like this:

{% highlight javascript %}
property bool glassContact: false
{% endhighlight %}

This is awesome, because we could change all what we want of entities that touch
 a sensor.
Going on with our glass, they don’t use physic, so we use as *bodyType*
Entity.Kinematic. We also could leave it to sleep, so we set *sleepingAllowed*
as true.
Now, time of a new property, *linearVelocity*. It indicates the velocity of the
object (you don’t say?). We want our glasses move from right to left, so it has
a negative velocity:

{% highlight javascript %}
linearVelocity: Qt.point(-3,0)
{% endhighlight %}

Now our Glass.qml should be like this:

{% highlight javascript %}
import QtQuick 2.0
import QtQml 2.2
import Bacon2D 1.0

Component {
    Entity {
        id: glass

        height: 80
        width: 80

        x: 440
        y: 320

        bodyType: Entity.Kinematic
        linearVelocity: Qt.point(-3,0)
        sleepingAllowed: true

        fixtures: [
            Edge {
                vertices: [
                    Qt.point(0, 0),
                    Qt.point(parent.width / 4, parent.height)
                ]
            },
            Edge {
                vertices: [
                    Qt.point(parent.width, 0),
                    Qt.point(parent.width * 3/4, parent.height)
                ]
            },
            Edge {
                vertices: [
                    Qt.point(parent.width / 4, parent.height),
                    Qt.point(parent.width * 3/4 , parent.height)
                ]
                sensor: true
                onBeginContact: {
                    other.parent.glassContact = true;
                }
            }
        ]

        Canvas {
            id: glassCanvas
            anchors.fill: parent

            onPaint: {
                var context = glassCanvas.getContext("2d");
                context.beginPath();
                context.strokeStyle = Qt.rgba(0.86, 0.28, 0.07, 1);        // #DD4814 - Ubuntu Orange
                context.moveTo(0, 0);
                context.lineTo(width / 4, height);
                context.lineTo(width * 3/4, height);
                context.lineTo(width, 0);
                context.stroke();
                context.fillStyle = Qt.rgba(0.86, 0.28, 0.07, 0.5);
                context.fill();
            }
        }
    }
}
{% endhighlight %}

Ok, we have our glass, we only need to launch it! We write a little function,
called *launchGlass()* in a new js file, named game.js: we’ll call it when
the Game is loaded. So, the function has to create the object, and positioning
it on the scene. We can do all this with three lines of code:

{% highlight javascript %}
function launchGlass() {
    var newGlass = glass.createObject(gameScene.world);
    newGlass.x = gameScene.width;
    newGlass.y = gameScene.height - 200;
}
{% endhighlight %}

Now we only need to add Glass to our scene and launch it, so we call the function in Component.onCompleted:

{% highlight javascript %}
import QtQuick 2.0
import Bacon2D 1.0
import "components"
import "components/game.js" as Game

Game {
    id: game
    anchors.centerIn: parent

    height: 680
    width: 440

    property bool isDoorOpen: false

    gameName: "com.ubuntu.developer.rpadovani.100balls" // Ubuntu Touch name format, you can use whatever you want
    currentScene: gameScene

    Scene {
        id: gameScene
        physics: true
        running: true

        anchors.fill: parent

        Bowl {
            id: bowl
            anchors.horizontalCenter: parent.horizontalCenter
        }

        Ball {
            id: ball
        }

        Glass {
            id: glass
        }

        Entity {
            id: door
            height: 10
            width: 62.5       // This is the width of the bottleneck of the bowl
            anchors.top: bowl.bottom
            anchors.horizontalCenter: parent.horizontalCenter

            fixtures: Box {
                anchors.fill: parent
                sensor: isDoorOpen      // <- All game is here :-)
                Edge {
                    vertices: [
                        Qt.point(0, 0),
                        Qt.point(width, 0)
                    ]
                }
            }

            Canvas {
                id: canvas
                visible: !isDoorOpen    // When the user clicks, hide this

                anchors.fill: parent

                onPaint: {
                    var context = canvas.getContext("2d");
                    context.beginPath();
                    context.lineWidth = 5;

                    context.moveTo(0, 0);
                    context.lineTo(width, 0);

                    context.strokeStyle = "black";
                    context.stroke();
                }
            }
        }

        MouseArea {
            anchors.fill: parent
            onPressed: isDoorOpen = true;
            onReleased: isDoorOpen = false;
        }

        Component.onCompleted: {
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 10; j++) {
                    var newBox = ball.createObject(gameScene.world);
                    newBox.x = gameScene.width / 2 - 100 + 15*j;
                    newBox.y = (15*i) - 10;
                }
            }
            Game.launchGlass();
        }
    }
}
{% endhighlight %}

Now, if you launch the game, you see the glass that goes from right to left!
Awesome! But… it’s only one! We want to launch a new glass when the old one go
after the half of the screen. Mhhh, we could use a sensor to detect when a
glass reaches the half of the screen, but I think it’s time to introduce a new
property of entities, behavior. With *behavior* you can create a script that runs
every x milliseconds. To set after how much milliseconds the script has to run
again, you use *updateInterval*.

So we need a script that every 100 milliseconds checks if the glass is after
one third of the width of the screen, and launchs another glass if it’s true.
Inside a ScriptBehavior you can use the target keyword to access to the parent
element.

Of course, we need to import the game.js script also in this file, using import
“game.js” as Game

{% highlight javascript %}
updateInterval: 100
behavior: ScriptBehavior {
    script: {
        var newPos = target.x;
        if (newPos < gameScene.width / 3){
            Game.launchGlass();
        }
    }
}
{% endhighlight %}

The issue with that code is that a glass launches a new glass every 100
milliseconds. We want that a glass launches only one other glass, so we set a
flag to check it.

{% highlight javascript %}
property bool launchedOther: false
updateInterval: 100
behavior: ScriptBehavior {
    script: {
        var newPos = target.x;
        if (newPos < gameScene.width / 3 && !target.launchedOther){
            Game.launchGlass();
            target.launchedOther = true;
        }
    }
}
{% endhighlight %}

To end, we want also to destroy glasses when they go out of the screen,
to preserve memory:

{% highlight javascript %}
property bool launchedOther: false
updateInterval: 100
behavior: ScriptBehavior {
    script: {
        var newPos = target.x;
        if (newPos < gameScene.width / 3 && !target.launchedOther){
            Game.launchGlass();
            target.launchedOther = true;
        }

        if (newPos < -2 * target.width) {
            glass.destroy();
        }
    }
}
{% endhighlight %}

## The score

Next step: we need to destroy balls that don’t go throught a glass, and put
again on top of the screen balls that go throught a glass. Also, we implement
score and we save highScore to explore another Bacon2D element.

We already know if a ball goes inside a glass, thanks to glassContact var.
Now we need only to implement a sensor at the bottom of the page that manages
them behavior:

{% highlight javascript %}
Entity {
    height: 1
    width: 2000

    anchors.horizontalCenter: parent.horizontalCenter
    anchors.bottom: parent.bottom

    fixtures: [
        Edge {
            vertices: [
                Qt.point(0, parent.height),
                Qt.point(parent.width, parent.height)
            ]

            sensor: true

            onBeginContact: {
                if (other.parent.glassContact === true) {
                    // If the ball went throught a glass, reset it and put it
                    // at the top of the scene
                    other.parent.x = gameScene.width / 2;
                    other.parent.y = 0;
                    other.parent.glassContact = false;
                    score++;
                    if (score > settings.highScore) {
                        settings.highScore = score;
                    }
                }
                else {
                    other.parent.destroy();
                }
            }
        }
    ]
}
{% endhighlight %}

You should know almost all here, we inserted a sensor at the bottom of the
scene, and thanks to onBeginContact we check if the balls is gone throught a
glass.
The only two new things are score and settings.highScore. Score is a simple var
in game:

{% highlight javascript %}
property int score: 0
{% endhighlight %}

settings.highScore is a component of Bacon2D, **Settings**: it provides local
storage for settings or any in game data.
It’s very easy to use:

{% highlight javascript %}
Settings {
    id: settings
    property int highScore: 0;
}
{% endhighlight %}

We need only to display score and highScore in the game:

{% highlight javascript %}
Column {
    anchors.centerIn: parent
    width: parent.width

    Label {
        fontSize: "large"
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        font.weight: Font.Bold

        text: "score " + score
    }

    Label {
        fontSize: "large"
        width: parent.width
        horizontalAlignment: Text.AlignHCenter

        text: "highScore" + settings.highScore
    }
}
{% endhighlight %}

The game is complete now :-)

The main file should be like this:

{% highlight javascript %}
import QtQuick 2.0
import Bacon2D 1.0
import "components"
import "components/game.js" as Game

Game {
    id: game
    anchors.centerIn: parent

    height: 680
    width: 440

    property bool isDoorOpen: false
    property int score: 0

    gameName: "com.ubuntu.developer.rpadovani.100balls" // Ubuntu Touch name format, you can use whatever you want
    currentScene: gameScene


    Scene {
        id: gameScene
        physics: true
        running: true

        anchors.fill: parent

        Bowl {
            id: bowl
            anchors.horizontalCenter: parent.horizontalCenter
        }

        Ball {
            id: ball
        }

        Glass {
            id: glass
        }

        Entity {
            id: door
            height: 10
            width: 62.5       // This is the width of the bottleneck of the bowl
            anchors.top: bowl.bottom
            anchors.horizontalCenter: parent.horizontalCenter

            fixtures: Box {
                anchors.fill: parent
                sensor: isDoorOpen      // <- All game is here :-)
                Edge {
                    vertices: [
                        Qt.point(0, 0),
                        Qt.point(width, 0)
                    ]
                }
            }

            Canvas {
                id: canvas
                visible: !isDoorOpen    // When the user clicks, hide this

                anchors.fill: parent

                onPaint: {
                    var context = canvas.getContext("2d");
                    context.beginPath();
                    context.lineWidth = 5;

                    context.moveTo(0, 0);
                    context.lineTo(width, 0);

                    context.strokeStyle = "black";
                    context.stroke();
                }
            }
        }

        Entity {
            height: 1
            width: 2000

            anchors.horizontalCenter: parent.horizontalCenter
            anchors.bottom: parent.bottom

            fixtures: [
                Edge {
                    vertices: [
                        Qt.point(0, parent.height),
                        Qt.point(parent.width, parent.height)
                    ]

                    sensor: true

                    onBeginContact: {
                        if (other.parent.glassContact === true) {
                            // If the ball went throught a glass, reset it and put it
                            // at the top of the scene
                            other.parent.x = gameScene.width / 2;
                            other.parent.y = 0;
                            other.parent.glassContact = false;
                            score++;
                            if (score > settings.highScore) {
                                settings.highScore = score;
                            }
                        }
                        else {
                            other.parent.destroy();
                        }
                    }
                }
            ]
        }

        Settings {
            id: settings
            property int highScore: 0;
        }

        Column {
            anchors.centerIn: parent
            width: parent.width

            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                font.weight: Font.Bold

                text: "score " + score
            }

            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter

                text: "highScore" + settings.highScore
            }
        }

        MouseArea {
            anchors.fill: parent
            onPressed: isDoorOpen = true;
            onReleased: isDoorOpen = false;
        }

        Component.onCompleted: {
            for (var i = 0; i < 10; i++) {
                for (var j = 0; j < 10; j++) {
                    var newBox = ball.createObject(gameScene.world);
                    newBox.x = gameScene.width / 2 - 100 + 15*j;
                    newBox.y = (15*i) - 10;
                }
            }
            Game.launchGlass();
        }
    }
}
{% endhighlight %}

Congrats, now your first game is ready! Try to start it and beat my personal
record: 763!

![Our first game finished](http://img.rpadovani.com/posts/100balls-final.png)

## And now?

In this little tutorial I explained all Bacon2D components I used to build
100balls game for Ubuntu for Phones. Of course, there are a lot of things you
could implement to make the game funnier. Here some suggestions:

 - Create a main menu, where the user goes when all balls are lost, so could
 start a new game without restart the app
 - Create levels, every level has different glasses color, and balls become of
 the same color of the glass they go throught
 - Implement others game modes: time mode, hard mode (cannot lost more than 10 balls)
 - Insert a text that says how many balls are left
 - Create a pause button

If you’re stuck, take a look to my code on [GitHub][github]

## Bacon2D

If you want an help on Bacon2D, or create a new game, or do a chat, go
on #bacon2D channel on Freenode, join the [Google+ community][community],
read the [documentation][documentation]

## Feedback

I spent almost two weeks to write this article. You know, I’m not an english
native speaker, so please forgive mistakes in the text. I hope all steps are
clear enough. If you find an error, or something not clear, or whatever you
think of this article, please leave a comment or write an email to me
(riccardo AT rpadovani DOT com)

A big thanks to Ken VanDine for his support to my approach to Bacon2D

[bacon2d]: http://bacon2d.com/
[github]: https://github.com/rpadovani/100balls
[documentation]: http://bacon2d.com/docs/
[box2d]: http://bacon2d.com/docs/box2d.html
[fixture]: http://bacon2d.com/docs/qml-bacon2d-fixture.html
[canvas]: http://qt-project.org/doc/qt-5/qml-qtquick-canvas.html
[community]: https://plus.google.com/communities/104485147844809689114
