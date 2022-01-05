FROM node:stretch-slim

EXPOSE 3000

# GITLAB_API_ACCESS_TOKEN should contain a Gitlab Access Token with API Access, to be able to
# install packages from our internal registries.
ARG GITLAB_API_ACCESS_TOKEN
RUN test -n "$GITLAB_API_ACCESS_TOKEN" || (echo "ERROR: The build arg GITLAB_API_ACCESS_TOKEN is required" && exit 1)

RUN mkdir -p /home/1000/app && chown -R 1000:1000 /home/1000

WORKDIR /home/1000/app

VOLUME ["/home/1000/app"]

COPY . .

# This allows us to keep node_modules outside of /home/1000/app, which
# is where the volume will be mounted. It prevents the volume mount from
# overwriting the packages installed at build time.
ENV NODE_PATH=/home/1000/node_modules

# Set up auth to our internal registry. Yarn will use this npm config.
RUN npm config set "@rino-wallet:registry=https://gitlab.cryptosphere-systems.com/api/v4/projects/621/packages/npm/" \
    && npm config set -- "//gitlab.cryptosphere-systems.com/api/v4/projects/621/packages/npm/:_authToken" "${GITLAB_API_ACCESS_TOKEN}"

# Perhaps there is a better way. But i was only able to run the project
# using the line below
RUN yarn global add react-scripts @craco/craco
RUN yarn install --modules-folder=/home/1000/node_modules

USER 1000

CMD ["yarn", "run", "--modules-folder=/home/1000/node_modules", "start"]
