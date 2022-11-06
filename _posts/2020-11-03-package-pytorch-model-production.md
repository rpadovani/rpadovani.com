---
layout: post
title:  "Create a PyTorch Docker image ready for production"
date:   2020-11-03 09:00
description: "A tutorial on how to use Torch Serve to create a production-ready Docker image with your model integrated"
categories:
- docker
- pytorch
permalink: pytorch-docker-image
cover: "https://img.rpadovani.com/posts/pytorch/michael-dziedzic-nbW-kaz2BlE-unsplash.jpg"
---
 
Given a PyTorch model, how should we put it in a Docker image, with all the related dependencies, ready to be deployed?

<figure>
    <img src="https://img.rpadovani.com/posts/pytorch/michael-dziedzic-nbW-kaz2BlE-unsplash.jpg" alt="cover" />
    <figcaption>
      <p><span>Photo by <a href="https://unsplash.com/@lazycreekimages?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Michael Dziedzic</a> on <a href="https://unsplash.com/s/photos/data-science?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span></p>
    </figcaption>
  </figure>

You know the drill: your Data Science team has created an amazing PyTorch model, and now they want you to put it in production. They give you a `.pt` file and some preprocessing script. What now?

Luckily, AWS and Facebook have [created][torchserve-announcement] a project, called [Torch Serve][torch-serve-www], to put PyTorch images in production, similarly to [Tensorflow Serving][tensorflow-serving]. It is a well crafted Docker image, where you can upload your models. In this tutorial we will see how to customize the Docker image to include your model, how to install other dependencies inside it, and which configuration options are available.

<aside><p>TorchServe is a flexible and easy to use tool for serving PyTorch models.</p></aside>

We include the PyTorch model directly inside the Docker image, instead of loading it at runtime; while loading it at runtime as some advantages and makes sense in some scenario (as in testing labs where you want to try a lot of different models), I don't think it is suitable for production.
Including the model directly in the Docker image has different advantages:

<!--TODO: enable this after the next post -->
<!--<small>We talk about how to properly create a CI/CD pipeline in this other tutorial.</small>-->

- if you use [CI][CI]/CD you can achieve [reproducible builds][reproducible-builds];
- to spawn a new instance serving your model, you need to have available only your Docker registry, and not also a storage solutions to store the model;  
- you need to authenticate only to your Docker registry, and not to the storage solution;
- it makes easier keeping track of what has been deployed, 'cause you have to check only the Docker image version, and not the model version. This is especially important if you have a cluster of instances serving your model;

Let's now get our hands dirty and dive in what is necessary to have the Docker image running!

# Building the model archive

The Torch Serve Docker image needs a *model archive* to work: it's a file with inside a model, and some configurations file. To create it, first [install Torch Serve][install-torchserve], and have a PyTorch model available somewhere on the PC.

To create this model archive, we need only one command:

```sh
torch-model-archiver --model-name <MODEL_NAME> --version <MODEL_VERSION>  --serialized-file <MODEL> --export-path <WHERE_TO_SAVE_THE_MODEL_ARCHIVE>
```

There are four options we need to specify in this command:
- `MODEL_NAME` is an identifier to recognize the model, we can use whatever we want here: it's useful when we include multiple models inside the same Docker image, a nice feature of Torch Serve that we won't cover for now;
- `MODEL_VERSION` is used to identify, as the name implies, the version of the model;
- `MODEL` is the path, on the local PC, with the `.pt` file acting as model;
- `WHERE_TO_SAVE_THE_MODEL_ARCHIVE` is a local directory where Torch Serve will put the model archive it generates;

Putting all together, the command should be something similar to:

```sh
torch-model-archiver --model-name predict_the_future --version 1.0 --serialized-file ~/models/predict_the_future --export-path model-store/
```

After having run it, we now have a file with `.mar` extension, the first step to put in production our PyTorch model!
<small>`.mar` files are actually just `.zip` files with a different extension, so feel free to open it and analyze it
to see how it works behind the scenes.</small>

Probably some pre-processing before invoking the model is necessary. If this is the case, we can create a file where we can put all the necessary instructions. This file can have external dependencies, so we can code an entire application in front of our model. 

To include the handler file in the model archive, we need only to add the `--handler` flag to the command above, like this:

```sh
torch-model-archiver --model-name predict_the_future --version 1.0 --serialized-file ~/models/predict_the_future --export-path model-store/ --handler handler.py
```
 
# Create the Docker image

Now we have the model archive, and we include it in the PyTorch Docker Image. Other than the model archive, we need to create a configuration file as well, to say to PyTorch which model to automatically load at the startup.

We need a `config.properties` file similar to this:
<small>Later in this tutorial we will see what these lines mean, and what other options are available.</small>

```
inference_address=http://0.0.0.0:8080
management_address=http://0.0.0.0:8081
number_of_netty_threads=32
job_queue_size=1000
model_store=/home/model-server/model-store
```

## Docker image with just the model

If we need to include just the model archive, and the config file, the Dockerfile is quite straightforward, since we just need to copy the files, all the other things will be managed by TorchServe itself. Our Dockerfile will thus be:

```dockerfile
FROM pytorch/torchserve as production

COPY config.properties /home/model-server/config.properties
COPY predict_the_future.mar /home/model-server/model-store
```

TorchServe already includes `torch`, `torchvision`, `torchtext`, and `torchaudio`, so there is no need to add them.
<small>To see the current version of these libraries, please go see the [requirements file of TorchServe over GitHub][pytorch-requirements-github].</small>

## Docker image with the model and external dependencies

What if we need different Python Dependencies for our Python handler?

In this case, we want to use a two steps Docker image: in the first step we build our dependencies, and then we copy them over the final image. We list our dependencies in a file called `requirements.txt`, and we use pip to install them.
<small>Pip is the [package installer][package-installer] for Python. Their [documentation about the format of the requirements file][pip-doc] is very complete.</small>

The Dockerfile is now something like this:

```dockerfile
ARG BASE_IMAGE=ubuntu:18.04

# Compile image loosely based on pytorch compile image
FROM ${BASE_IMAGE} AS compile-image
ENV PYTHONUNBUFFERED TRUE

# Install Python and pip, and build-essentials if some requirements need to be compiled
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y \
    python3-dev \
    python3-distutils \
    python3-venv \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && cd /tmp \
    && curl -O https://bootstrap.pypa.io/get-pip.py \
    && python3 get-pip.py

RUN python3 -m venv /home/venv

ENV PATH="/home/venv/bin:$PATH"

RUN update-alternatives --install /usr/bin/python python /usr/bin/python3 1
RUN update-alternatives --install /usr/local/bin/pip pip /usr/local/bin/pip3 1

# The part above is cached by Docker for future builds
# We can now copy the requirements file from the local system
# and install the dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

FROM pytorch/torchserve as production

# Copy dependencies after having built them
COPY --from=compile-image /home/venv /home/venv

# We use curl for health checks on AWS Fargate
USER root
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

USER model-server

COPY config.properties /home/model-server/config.properties
COPY predict_the_future.mar /home/model-server/model-store
```

If PyTorch is among the dependencies, we should change the line to install the requirements from  

```dockerfile
RUN pip install --no-cache-dir -r requirements.txt
```

to

```dockerfile
RUN pip install --no-cache-dir -r requirements.txt -f https://download.pytorch.org/whl/torch_stable.html
```

In this way we will use the pre-build Python packages for PyTorch instead of installing them from scratch: it will be
faster, and it requires less resources, making it suitable also for small CI/CD systems.

## Configuring the Docker image

We created a configuration file above, but what does it? Of course, going through all the possible configurations would be impossible, so I leave here the [link to the documentation][pytorch-config-doc]. Among the other things explained there, there is a way to configure Cross-Origin Resource Sharing (necessary to use the model as APIs over the web), a guide on how to enable SSL, and much more.

There is a set of configurations parameters in particular I'd like to focus on: the ones related to logging. First, for production environment, I suggest setting `async_logging` to `true`: it could delay a bit the output, but allows a higher throughput. Then, it's important to notice that [by default][logging-config] Torch Serve captures every message, including the ones with severity `DEBUG`. In production, we probably don't want this, especially because it can become quite verbose. 

To override the default behavior, we need to create a new file, called `log4j.properties`. For more information on every possible options I suggest familiarizing with the [official guide][log4j]. To start, copy [the default Torch Serve][pytorch-log4j-config] configuration, and increase the severity of the printed messages. In particular, change

```
log4j.logger.org.pytorch.serve = DEBUG, ts_log
log4j.logger.ACCESS_LOG = INFO, access_log
```

to

```
log4j.logger.org.pytorch.serve = WARNING, ts_log
log4j.logger.ACCESS_LOG = WARNING, access_log
```
 
We need also to copy this new file to the Docker Image, so copy the logging config just after the config file:

```
COPY config.properties /home/model-server/config.properties
COPY config.properties /home/model-server/log4j.properties
```

We need to inform Torch Serve about this new config file, and we do so adding a line to `config.properties`:

```
vmargs=-Dlog4j.configuration=file:///home/model-server/log4j.properties
```

We have now a full functional Torch Serve Docker image, with our custom model, ready to be deployed!

<aside><p>Our PyTorch model is ready to meet the real world and serve traffic.</p></aside>

For any question, comment, feedback, critic, suggestion on how to improve my English, leave a comment below, or drop an email at [riccardo@rpadovani.com][email].
  
Ciao,  
R.

[email]: mailto:riccardo@rpadovani.com
[install-torchserve]: https://github.com/pytorch/serve#install-torchserve
[pytorch-requirements-github]: https://github.com/pytorch/serve/blob/master/requirements/cpu.txt
[package-installer]: https://packaging.python.org/guides/tool-recommendations/
[pip-doc]: https://pip.pypa.io/en/stable/reference/pip_install/#requirements-file-format
[pytorch-config-doc]: https://github.com/pytorch/serve/blob/master/docs/configuration.md
[logging-config]: https://github.com/pytorch/serve/blob/master/docs/logging.md
[log4j]: https://logging.apache.org/log4j/2.x/manual/configuration.html
[pytorch-log4j-config]: https://github.com/pytorch/serve/blob/master/frontend/server/src/main/resources/log4j.properties
[torch-serve-www]: https://pytorch.org/serve/
[torchserve-announcement]: https://aws.amazon.com/blogs/aws/announcing-torchserve-an-open-source-model-server-for-pytorch/
[tensorflow-serving]: https://www.tensorflow.org/tfx/guide/serving
[reproducible-builds]: https://reproducible-builds.org/
[CI]: https://en.wikipedia.org/wiki/Continuous_integration
