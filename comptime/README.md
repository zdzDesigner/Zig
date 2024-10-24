## debug
```sh
zig build-exe ./base.zig
```

```sh
➜ nm -A base | grep main
base:0000000001034980 t base.main
base:00000000010da000 b os.linux.tls.main_thread_tls_buffer

```


```sh
gdb ./base
b base.main
```

## 验证符号表(`-target` arm-freestanding)
```sh
zig build-exe ./attr.zig -target arm-freestanding
```




## 验证comptime
```sh
zig build-exe ./blk.zig
```




## IR
➜  zig build-exe ./base.zig -femit-llvm-ir -DreleaseFast
➜  zig build-obj -O ReleaseSmall ./base.zig -femit-llvm-ir -target arm-freestanding 


## feature
√ 验证comptime data
x 查看IR (未达预期)
