---
layout: post
title:  "Micro-optimizing Golang"
date:   2019-11-10 14:35
description: "Golang is an amazing language. It has a great community, a stunning standard library, and it is also blazing fast. But sometimes it isn't enough..."
categories:
- golang
permalink: micro-optimizing-golang
---

For a few months now, we used [Go][go] for different projects in [Nextbit][nextbit]. We really like it: it doesn't have a too much steep learning curve, it has a very good standard library, and a big community.
It is also blazing fast, that is a good plus. But sometimes being fast is not enough, as we will see...

# Why Golang?

Core business of Nextbit is data science, thus we have a time of mathematician, statisticians, physicians, and other people that do black magic with data. 
We are a small company (around 20 people at the moment), so our researches have also to write code - then the technical people could improve it, if necessary. 
All the code goes through code review, so we use languages that are known by at least few people in the team, and with a good support for data science libraries.
<small>We are hiring! If you want to work on some bleeding edge technology on interesting problems in a wide spectrum of fields, drop me an email at [rpadovani@nextbit.it](mailto:rpadovani@nextbit.it)</small>

Of course **Python**, alongside with **R**, is the language we use more, because in the last years has become the *de facto standard* for all the data science libraries.
However, we started using **Go** for some tasks, especially web-related, as creating APIs for querying models we created.

Other than doing data science, we also build **cloud infrastructures** to run analysis, and integrate the models we develop for our customers. 
During the development of one of these infrastructure became necessary a service, critical for our customer, which should process thousands of request per seconds, and replies in less than 2 millisecond to every request.
<small>We use different public clouds (plus private clouds of our customers), this particular service is running on **AWS**.</small> 

Golang was a natural choice: we know it, we have already used with success, and it is known to having good performances.

# The problem

We started developing our project, and we soon had a working solution, with all the integration test suites in green. Now it was time for the performance tests.

As Donald Knuth said, 

> premature optimization is the root of all evil (or at least most of it) in programming

so, while we have written good code, we didn't focus on performance - we knew that if it wasn't good enough, we had time to improve.
And indeed there was room for improvement: 99% of requests took less than 2ms, but the others took a lot more, and some time some request took **more than 150ms!**

# Time to improve

It was time to improve the performances and make sure all the requests took less than 2ms.

Now, before beginning explaining what we did, let me underline that we did this kind of work just for this particular piece of software. Usually, you don't need this kind of optimization, bottlenecks are somewhere else.
However, there is always that 1% of cases where you need more, and this was one of them.

<aside>
<p>
99% of times you don't need this kind of micro-optimizations, bottlenecks are usually somewhere else
</p>
</aside>

We focused mainly on three things, and the first two are partially related:
- the garbage collector
- inlining functions
- fastest operations

I will first explain theoretically why these three points could be a bottleneck, and then I will made a practical example on how to actually improve the code.

# The theory
## The garbage collector

Go is a garbage collected language. 
### Heap vs stack
### Stop the world
## Inlining functions
### What?
### Known limitations
## Benchmark your operations
# The practice
## An example problem
## Setting up the environment
## A custom function
## Byte vs string

# Future features

One of the coolest things in Gitlab is that everything is always a work in progress, and each feature has some new goodies in every release. This is true for the Visual Reviews App as well. There is an [epic][epic] that collects all the improvements they want to do, including [removing the need for an access token][issue-0], and [adding ability to take screenshots][issue-1] that will be inserted in the MR comments as well.

That's all for today, I hope you found this article useful! For any comment, feedback, critic, leave a comment below,
or drop an email at [riccardo@rpadovani.com](mailto:riccardo@rpadovani.com).

Ciao,  
R.

[go]: https://golang.org/
[nextbit]: https://nextbit.it

