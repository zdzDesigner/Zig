#!/bin/bash

MAIN_DIR=$(cd $(dirname "$0");cd ..;pwd)
# echo $MAIN_DIR

TEST_DIR="$MAIN_DIR/tests"

# 去除.sh后缀名的当前文件名
filename=$(basename "$0" .sh)
OUT_DIR="$MAIN_DIR/out/$filename"
mkdir -p $OUT_DIR
# echo $OUT_DIR

# riscv64-linux-gnu-gcc 接收管道内容的接口
# -xc 告知编译器为.c 语言代码
cat $TEST_DIR/init.c | riscv64-linux-gnu-gcc -o $OUT_DIR/out.o -c -xc -


## 执行
# go run $MAIN_DIR/main.go  $MAIN_DIR/tests/init.sh
zig build run -freference-trace -- $OUT_DIR/out.o
