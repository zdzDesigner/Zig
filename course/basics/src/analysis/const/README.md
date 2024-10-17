## function 参数(const)
```sh
## 编译
➜  zig build-exe  ./const_asm.zig

## 查找`main`入口
➜  readelf -s const_asm | grep main 
    18: 00000000010348e0    38 FUNC    LOCAL  DEFAULT    4 const_asm.main 
    27: 00000000010d9000  8448 OBJECT  LOCAL  DEFAULT    9 os.linux.tls.main_thread_ 

```
- gdb
```sh
Reading symbols from const_asm...
>>> b const_asm.main
Breakpoint 1 at 0x10348e8: file const_asm.zig, line 10.
>>>

```




