FROM ruby:2.3

MAINTAINER Riccardo Padovani <riccardo@rpadovani.com>

RUN gem install bundler
RUN apt update && apt install -y nodejs
