#! /usr/bin/env python3
"""
The sequence of operations in our yarn:build process is such that to ensure deterministic
and sensible filenames (for cache and reproducible builds) we are left with needing this script.

This module tackles:

* SRI. Some files such as web workers and *.wasm files are copied to the "public" folder
and not included with the webpack bundle. Therefore we have to use another way to check their integrity.

- during the build process we calculate hashes of these files and generate integrity_metadata.js file. We also add an "integrity" attribute to integrity_metadata.js itself.
- we use a service worker that intercepts requests for these resources. It modifies the request object, adding an "integrity"
attribute with hashes stored in integrity_metadata.js. Regular browser SRI takes over from here...

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


class IntegrityHasher:
    def get_build_assets(self):
        assets = pathlib.Path('./build').glob('**/*')
        return (asset for asset in assets if not asset.is_dir() and asset.name in [
          'monero_wallet_full.js',
          'monero_wallet_full.wasm',
          'monero_wallet_keys.js',
          'monero_wallet_keys.wasm',
          'monero_web_worker.js',
          'sodium.js',
          'service_worker.js',
        ])
    
    def calculate_integrity_hash(self, file_path: pathlib.Path) -> str:
        hasher = hashlib.sha256()
        with open(file_path, "rb") as f:
            while True:
                data = f.read(hasher.block_size)
                if not data:
                    break
                hasher.update(data)
        file_hash = base64.b64encode(hasher.digest()).decode()
        return [file_path.name, f"sha256-{file_hash}"]

    def calculate_chunk_hash(self, file_path: str) -> str:
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

    def create_integrity_metadata_js(self, hash_list):
        file_path = "./build/integrity_metadata.js"
        # To be deterministic we need to sort the list of lists in hash_list
        hash_list.sort()
        with open(file_path, "w") as f:
            hash_map = {}
            for hash in hash_list:
                hash_map[hash[0]] = hash[1]
            f.write("window.INTEGRITY_METADATA = {}".format(hash_map))
        new_chunk_hash = self.calculate_chunk_hash(file_path)
        new_file_path = f"/integrity_metadata.{new_chunk_hash}.js"
        # Replace the file
        os.replace(file_path, f"./build{new_file_path}")

        # add integrity_metadata.js to index.html and add integrity attribure to script tag
        with open("./build/index.html", "r+") as f: 
            content = f.read()
            soup = BeautifulSoup(content, 'html.parser')
            title = soup.find('title')
            script = soup.new_tag('script')
            script['src'] = new_file_path
            script['integrity'] = self.calculate_integrity_hash(pathlib.Path(f"./build{new_file_path}"))[1]
            title.insert_after(script)
            f.seek(0)
            f.write(str(soup))
            f.truncate()

    def create_integrity_hash_list(self):
        assets = self.get_build_assets()
        with ThreadPool(processes=4) as pool:
            hash_list = pool.map(self.calculate_integrity_hash, assets)
        self.create_integrity_metadata_js(hash_list)


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

    def print_and_hash_index_html(self):
        path = pathlib.Path("./build/index.html")
        index_hash = self.calculate_hash(path)
        with open("./build/index.html", "r") as f:
            contents = f.read()
        print("Root html file contents:")
        print(contents)
        # Pretty printing is probably less useful for comparing strings,
        # but leaving here in case we change our mind.
        # print(BeautifulSoup(contents, 'html.parser').prettify())
        return index_hash

    def export_reproducible_build_instructions(self) :
        index_html_hash = self.print_and_hash_index_html()
        print(f"\nRoot html file Hash: {index_html_hash}\n")
        service_worker_hash = self.calculate_hash(pathlib.Path("./build/service_worker.js"))
        print(f"service_worker.js file Hash: {service_worker_hash}\n")
        integrity_hash = self.get_build_integrity_hash()
        print(f"Integrity Hash: {integrity_hash}\n")
        # ENV vars are set in `.gitlab-ci.yml`
        project_url = os.environ.get("INTEGRITY_REPOSITORY_URL", "")
        project_commit = os.environ.get("INTEGRITY_REPOSITORY_COMMIT", "")
        project_env = os.environ.get("REACT_APP_ENV", "")
        app_url = "app.rino.io"
        if project_env == "test":
            app_url = "app.test.rino.io"
        if project_env == "production":
            project_env = "master"
        with open("./build-integrity-template.txt", "r") as file_data:
            data = file_data.read()
        data = data.replace("__integrity_hash__", integrity_hash)
        data = data.replace("__integrity_project_url__", project_url)
        data = data.replace("__integrity_project_commit__", project_commit)
        data = data.replace("__integrity_env__", project_env)
        data = data.replace("__index_html_hash__", index_html_hash)
        data = data.replace("__service_worker_js_hash__", service_worker_hash)
        data = data.replace("__app_url__", app_url)
        with open("./build/build-integrity.txt", 'w') as f:
            f.write(data)


if __name__ == "__main__":
    print("Tackling SRI...\n")
    integrity_hasher = IntegrityHasher()
    integrity_hasher.create_integrity_hash_list()
    print("SRI complete...\n")

    print("Tackling Reproducible Build Hash...\n")
    build_hasher = BuildHasher()
    build_hasher.export_reproducible_build_instructions()
    print("Reproducible Build Hash complete...\n")
