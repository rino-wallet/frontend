FROM node:16.17-bullseye-slim

ARG ENVIRON=prod

RUN apt update && apt install python3 python3-pip git locales locales-all -y
RUN python3 -m pip install beautifulsoup4==4.10.0

ENV LC_ALL="en_US.UTF-8"
ENV LANG="en_US.UTF-8"
ENV LANGUAGE="en_US.UTF-8"

COPY . .
RUN yarn install && yarn build:${ENVIRON}
