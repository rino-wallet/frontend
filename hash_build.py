#! /usr/bin/env python3
"""
The sequence of operations in our yarn:build process is such that to ensure deterministic
 and sensible filenames (for cache and reproducible builds) we are left with needing this script.
 (Webpack 4 and the HashOutput/SubresourceIntegity plugins don't play well together.)

This module tackles:

* Sub Resource Integrity:

It updates the subresource-integrity hash  for`runtime-main.xxxx.js` in /build/index.html.
This is necessary because the content of `runtime-main.xxxx.js`  has been changed  by
HashOutput-plugin since its integrity hash was calculated during the build.

* Rename non-deterministic filenames

It updates `/static/css/main.xxxxxx.chunk.css` filename with a hash of its content, and
updates the link in index.html accordingly.

* Reproducible Build:

It hashes the content of each build asset and generates a  deterministic final hash from the results.
It exports './build/build-integrity.txt' containing instructions on how to reproduce this build hash.
 """
import os
import base64
import hashlib
import pathlib
from multiprocessing.pool import ThreadPool
from bs4 import BeautifulSoup


def calculate_hash(file_path: str) -> str:
    hasher = hashlib.sha256()
    with open(file_path, "rb") as f:
        while True:
            data = f.read(hasher.block_size)
            if not data:
                break
            hasher.update(data)
    file_hash = base64.b64encode(hasher.digest()).decode()
    return f"sha256-{file_hash}"


def calculate_chunk_hash(file_path: str) -> str:
    hasher = hashlib.sha256()
    with open(file_path, "rb") as f:
        while True:
            data = f.read(hasher.block_size)
            if not data:
                break
            hasher.update(data)
    file_hash = hasher.hexdigest().lower()
    # consistent length with webpack names
    chunk_hash = file_hash[:20]
    return chunk_hash


def replace_integrity_hash():
    '''
    Injects hashes required by Sub Resource Integrity.
    '''
    with open("./build/index.html", "r+") as f:
        content = f.read()
        soup = BeautifulSoup(content, 'html.parser')
        all_scripts = soup.find_all('script')
        for script in all_scripts:
            if script.get("src") and script["src"].startswith("/runtime-main."):
                # print(f"Old internal SRI hash: {script.get('integrity')}")
                file_path = f"./build{script['src']}"
                script["integrity"] = calculate_hash(file_path)
                # print(f"New internal SRI hash: {script.get('integrity')}")
                break

        f.seek(0)
        f.write(str(soup))
        f.truncate()


def replace_nondeterministic_filenames():
    """
    '/static/css/main.xxxx.chunk.css' has a non-deterministic chunk-hash value in its name.
    We need to find this file in `./build/` and rename it using a chunk-hash value
    based on its contents.
    We then need to update `index.html` to use this new name.
    """
    with open("./build/index.html", "r+") as f:
        content = f.read()
        soup = BeautifulSoup(content, 'html.parser')
        all_links = soup.find_all('link')
        for link in all_links:
            if link.get("href") and link["href"].startswith("/static/css/main."):
                file_path = f"./build{link['href']}"
                new_chunk_hash = calculate_chunk_hash(file_path)
                new_file_path = f"/static/css/main.{new_chunk_hash}.chunk.css"
                # Replace the file
                os.replace(file_path, f"./build{new_file_path}")
                # Update the link
                link["href"] = new_file_path
                break

        f.seek(0)
        f.write(str(soup))
        f.truncate()


class BuildHasher:
    '''
    Exports reproducible build instructions and prints the integrity hash.
    '''
    def get_build_assets(self):
        assets = pathlib.Path('./build').glob('**/*')
        # Exclude any irrelevant and non-determistic files. Eg source maps and asset-manifests
        return (asset for asset in assets if not asset.is_dir() and not asset.suffix in [".map", ".json"])

    def calculate_hash(self, file_path: pathlib.Path) -> str:
        hasher = hashlib.sha256()
        with open(file_path, "rb") as f:
            while True:
                data = f.read(hasher.block_size)
                if not data:
                    break
                hasher.update(data)
        return hasher.hexdigest().lower()

    def create_hash_list(self) -> list:
        assets = self.get_build_assets()
        with ThreadPool(processes=4) as pool:
            hash_list = pool.map(self.calculate_hash, assets)
        # Sort by lower-cased hex-digests
        hash_list.sort()
        return hash_list

    def get_build_integrity_hash(self) -> str:
        hash_list = self.create_hash_list()
        hasher = hashlib.sha256()
        for hex_digest in hash_list:
            hasher.update(bytes.fromhex(hex_digest))
        return hasher.hexdigest().lower()

    def export_reproducible_build_instructions(self) :
        integrity_hash = self.get_build_integrity_hash()
        print(f"Integrity Hash: {integrity_hash}\n")
        # ENV vars are set in `.gitlab-ci.yml`
        project_url = os.environ.get("INTEGRITY_REPOSITORY_URL", "")
        project_commit = os.environ.get("INTEGRITY_REPOSITORY_COMMIT", "")
        project_env = os.environ.get("REACT_APP_ENV", "")
        with open("./build-integrity-template.txt", "r") as file_data:
            data = file_data.read()
        data = data.replace("__integrity_hash__", integrity_hash)
        data = data.replace("__integrity_project_url__", project_url)
        data = data.replace("__integrity_project_commit__", project_commit)
        data = data.replace("__integrity_env__", project_env)
        with open("./build/build-integrity.txt", 'w') as f:
            f.write(data)


if __name__ == "__main__":
    print("Tackling SRI...")
    replace_integrity_hash()
    print("SRI update complete...\n")

    print("Tackling non-deterministic filenames")
    replace_nondeterministic_filenames()
    print("Filenames are now deterministic...")

    print("Tackling Reproducible Build Hash...\n")
    build_hasher = BuildHasher()
    build_hasher.export_reproducible_build_instructions()
    print("Reproducible Build Hash complete...\n")
