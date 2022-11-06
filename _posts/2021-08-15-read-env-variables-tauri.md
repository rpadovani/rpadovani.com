---
layout: post
title:  "Reading env variables from a Tauri App"
date:   2021-08-15 20:00
description: "How to read environment variables from JavaScript inside a Tauri application?"
categories:
- tauri
- javascript
permalink: read-env-tauri
cover: https://img.rpadovani.com/posts/tauri_with_wordmark.svg
---
 
"Build smaller, faster, and more secure desktop applications with a web frontend" is the promise made by [Tauri][tauri]. And indeed, it is a great Electron replacement. But being in its first days (the beta has just been released!) a bit of documentation is still missing, and on the internet there aren't many examples on how to write code.

<figure>
    <img src="https://img.rpadovani.com/posts/tauri-binary-size.png" alt="cover" />
    <figcaption>
      <p><span>Tauri is very light, as highlighted by <a href="https://tauri.studio/en/benchmarks" target="_blank">these benchmarks</a>.</span></p>
    </figcaption>
  </figure>

<small>Haven't you started with Tauri yet? Go and read the [intro doc][intro-doc]!</small>
One thing that took me a bit of time to figure out, is how to read environment variables from the frontend of the application (JavaScript / Typescript or whichever framework you are using).

# The Command 

As usual, when you know *the solution* the problem seems easy. In this case, we just need an old trick: **delegating**!

In particular, we will use the [`Command` API][command-doc] to spawn a sub-process (`printenv`) and reading the returned value. The code is quite straightforward, and it is synchronous:

```typescript
import { Command } from "@tauri-apps/api/shell";

async readEnvVariable(variableName: string): Promise<string> {
    const commandResult = await new Command(
        "printenv",
        variableName
    ).execute();

    if (commandResult.code !== 0) {
      throw new Error(commandResult.stderr);
    }
    
    return commandResult.stdout;
}
```

The example is in Typescript, but can be easily transformed in standard JavaScript.

The `Command` API is quite powerful, so you can read its [documentation][command-doc] to adapt the code to your needs.

# Requirements

There are another couple of things you should consider: first, you need to have installed in your frontend environment the [`@tauri-apps/api`][tauri-api] package. You also need to enable your app to execute commands. Since Tauri puts a strong emphasis on the [security][tauri-security] (and rightly so!), your app is by default sandboxed. To being able to use the `Command` API, you need to enable the [`shell.execute`][shell-execute] API. 

It should be as easy as setting `tauri.allowlist.shell.execute` to `true` in your `tauri.json` config file.

<aside><p>Tauri puts a strong emphasis on the security of the application.</p></aside>

Tauri is very nice, and I really hope it will conquer the desktops and replace Electron, since it is lighter, faster, and safer!

Questions, comments, feedback, critics, suggestions on how to improve my English? Leave a comment below, or drop me an email at [riccardo@rpadovani.com][email].
  
Ciao,  
R.

[email]: mailto:riccardo@rpadovani.com

[intro-doc]: https://tauri.studio/en/docs/getting-started/intro
[tauri]: https://tauri.studio/
[benchmarks]: https://tauri.studio/en/benchmarks
[command-doc]: https://tauri.studio/en/docs/api/js/classes/shell.command
[tauri-api]: https://www.npmjs.com/package/@tauri-apps/api
[tauri-security]: https://tauri.studio/en/docs/about/security
[shell-execute]: https://tauri.studio/en/docs/api/config#tauri.allowlist.shell.execute
