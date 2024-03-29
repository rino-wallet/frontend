# RINO frontend

This repository contains the frontend code of [RINO](https://app.rino.io).

## How to build it and verify it matches RINO online version

The steps below are a shortened summary of the complete instructions, which are available at [https://app.rino.io/build-integrity.txt](https://app.rino.io/build-integrity.txt)


1. Clone this repo: `git clone https://github.com/rino-wallet/frontend`
2. Checkout the commit from which the production website was built, for instance: `git checkout v59.0`. The commit corresponding to the version of RINO we are currently service can be found in the file [https://app.rino.io/build-integrity.txt](https://app.rino.io/build-integrity.txt).
3. Build the project: `DOCKER_BUILDKIT=0 docker build --build-arg ENVIRON=master -f build-integrity.Dockerfile --no-cache .`
4. It should output an Integrity Hash that matches the one available at [https://app.rino.io/build-integrity.txt](https://app.rino.io/build-integrity.txt).
5. You can verify the hashes of all assets served by RINO against the local assets you have built.

