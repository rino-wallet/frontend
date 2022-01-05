FROM node:16.4.0-buster-slim

ARG ENVIRON prod

RUN apt update && apt install git locales locales-all -y

ENV LC_ALL "en_US.UTF-8"
ENV LANG "en_US.UTF-8"
ENV LANGUAGE "en_US.UTF-8"

# GITLAB_API_ACCESS_TOKEN should contain a Gitlab Access Token with API Access, to be able to
# install packages from our internal registries. This should be removed before release
ARG GITLAB_API_ACCESS_TOKEN
RUN test -n "$GITLAB_API_ACCESS_TOKEN" || (echo "ERROR: The build arg GITLAB_API_ACCESS_TOKEN is required" && exit 1)
RUN npm config set "@enterprisewallet:registry=https://gitlab.cryptosphere-systems.com/api/v4/projects/618/packages/npm/" \
    && npm config set -- "//gitlab.cryptosphere-systems.com/api/v4/projects/618/packages/npm/:_authToken" "${GITLAB_API_ACCESS_TOKEN}"

COPY . .
RUN yarn install && yarn build:${ENVIRON}