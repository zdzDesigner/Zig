#! /bin/bash
set -x
set -e

## remove
set +e
rm ./zig-out/bin/bitou
set -e

## build
zig build --verbose

## run
./zig-out/bin/bitou
