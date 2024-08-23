```sh
➜ tty
/dev/pts/8

➜ zig build run
pid:3833514
server:net.Server{ .listen_address = 0.0.0.0:8089, .stream = net.Stream{ .handle = 3 } }

➜ cd /proc/3833514/fd
➜ fd ls -lh
总用量 0
lrwx------ 1 zdz zdz 64 8月  21 11:28 0 -> /dev/pts/8
lrwx------ 1 zdz zdz 64 8月  21 11:28 1 -> /dev/pts/8
lrwx------ 1 zdz zdz 64 8月  21 11:28 2 -> /dev/pts/8
lrwx------ 1 zdz zdz 64 8月  21 11:28 3 -> 'socket:[5640749]'
```


