## 链接过程
- 成员
1. add.o
2. liblibstatic.a.o

### 符号决议
- lib/add.c
```c
int __bss_size = 30;
int multi(int a, int b) { return a * b; }
```
```sh
> nm add.o
0000000000000000 D __bss_size
0000000000000000 T multi
```


- src/static.zig
```zig
export const __text_size: u8 = 120;
```

```sh
> nm liblibstatic.a.o
0000000000000000 d __anon_280
0000000000000070 r builtin.cpu
00000000000000aa r builtin.link_mode
00000000000000a9 r builtin.output_mode
0000000000000000 r builtin.zig_backend
00000000000000a8 r start.simplified_logic
0000000000000000 r Target.Cpu.Feature.Set.empty
0000000000000028 r Target.x86.cpu.skylake
00000000000000ab R __text_size
00000000010be1c0 W __moddi3      弱符号, 可以覆盖(Cortex 中断符号)
```






