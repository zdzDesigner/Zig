➜  zig build-exe ./base.zig -femit-llvm-ir -DreleaseFast
➜  zig build-obj -O ReleaseSmall ./base.zig -femit-llvm-ir -target arm-freestanding 



## debug
```sh
➜ nm -A base | grep main
base:0000000001034980 t base.main
base:00000000010da000 b os.linux.tls.main_thread_tls_buffer

```


```sh
gdb ./base
b base.main
```




