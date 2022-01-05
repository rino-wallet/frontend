#! /bin/bash

# Hashes the content of ./build, deterministically. And creates a ./build/build-integrity.txt file
# with instructions to check the project's build integrity.

# $CI_PROJECT_URL and $CI_COMMIT_SHA are provided by the CI environment

export INTEGRITY_HASH=$(find ./build/*.js -type f -exec sha256sum {} \; | awk '{ print $2 " " $1 }' | sort -k1 | sha256sum);
sed "s,__integrity_hash__,$INTEGRITY_HASH,g; s,__integrity_project_url__,$CI_PROJECT_URL,g; s,__integrity_project_commit__,$CI_COMMIT_SHA,g; s,__integrity_env__,$REACT_APP_ENV,g" \
    ./build-integrity-template.txt > ./build/build-integrity.txt;
echo "Integrity Hash ${INTEGRITY_HASH}";