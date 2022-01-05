# RINO frontend

This repository contains the frontend code of [RINO](https://test.rino.io).

## How to build it and verify it matches RINO online version

The complete instructions are available at [https://test.rino.io/build-integrity.txt](https://test.rino.io/build-integrity.txt). Paraphrasing here for your convenience:

1. Clone this repo: `git clone https://github.com/rino-wallet/frontend`
2. Checkout the commit from which the production website was built, for instance: `git checkout v59.0`. For the correct commit, see the file above.
3. Build the project: `DOCKER_BUILDKIT=0 docker build --build-arg ENVIRON=test -f build-integrity.Dockerfile --no-cache .`
4. It should output an Integrity Hash that matches the one available at [https://test.rino.io/build-integrity.txt](https://test.rino.io/build-integrity.txt).
5. You can verify the hashes of all assets served by RINO against the local assets you have built.

