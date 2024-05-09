## stm32f10x to zig
fork[stm32-zig](https://github.com/fmaggi/stm32-zig)


## TODO
1. add rcc module







## renode
```sh
renode.sh /home/zdz/Documents/Try/Zig/zig-pro/stm32-zig/
```
- 未实现的外设
```sh
sysbus: [cpu: 0x8001630] (tag: 'RCC_CR') ReadDoubleWord from non existing peripheral at 0x40021000, returning 0x0A020083.
        ApplySVD @renode/stm32f103.svd
```
```md
# !!(未尝试)用python去mock
https://renode.readthedocs.io/en/latest/basic/using-python.html#python-peripherals-in-a-platform-description
```





- gdbgui
```sh
gdbgui --gdb-cmd="arm-none-eabi-gdb-py -x ./gdbinit"
```




