 ```sh
➜ clang -o hello hello.c -target x86_64-windows-gnu 

/usr/bin/ld: 找不到 crt2.o: 没有那个文件或目录
/usr/bin/ld: 找不到 crtbegin.o: 没有那个文件或目录
/usr/bin/ld: 找不到 -lmingw32
/usr/bin/ld: 找不到 -lgcc
/usr/bin/ld: 找不到 -lgcc_eh
/usr/bin/ld: 找不到 -lmoldname
/usr/bin/ld: 找不到 -lmingwex
/usr/bin/ld: 找不到 -lmsvcrt
/usr/bin/ld: 找不到 -ladvapi32
/usr/bin/ld: 找不到 -lshell32
/usr/bin/ld: 找不到 -luser32
/usr/bin/ld: 找不到 -lkernel32
/usr/bin/ld: 找不到 -lmingw32
/usr/bin/ld: 找不到 -lgcc
/usr/bin/ld: 找不到 -lgcc_eh
/usr/bin/ld: 找不到 -lmoldname
/usr/bin/ld: 找不到 -lmingwex
/usr/bin/ld: 找不到 -lmsvcrt
/usr/bin/ld: 找不到 -lkernel32
/usr/bin/ld: 找不到 crtend.o: 没有那个文件或目录
clang: error: linker command failed with exit code 1 (use -v to see invocation)
 ```

```sh
➜ clang -o hello hello.c -target mipsel-linux-musl
/usr/bin/ld: 无法辨认的仿真模式: elf32ltsmip
支持的仿真： elf_x86_64 elf32_x86_64 elf_i386 elf_iamcu elf_l1om elf_k1om i386pep i386pe
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```


```sh
➜ clang -o hello hello.c -target aarch64-linux-gnu
/usr/bin/ld: 无法辨认的仿真模式: aarch64linux
支持的仿真： elf_x86_64 elf32_x86_64 elf_i386 elf_iamcu elf_l1om elf_k1om i386pep i386pe
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```



```sh
➜ clang -MD -MF hello.d hello.c
源文件所依赖的所有头文件列表
```





