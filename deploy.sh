#!/bin/bash

set -eu
script_dir=$(cd $(dirname $0); pwd)

pushd $script_dir
rm -rf public
hugo -D
sudo rm -rf /var/www/akkyme/public
sudo cp -r public /var/www/akkyme/public
popd
