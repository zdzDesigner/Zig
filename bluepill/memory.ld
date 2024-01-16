/* 用于定义内存区域和其属性，例如起始地址、大小等 */
MEMORY 
{
    /* FLASH (rx)  : ORIGIN = 0x08000000, LENGTH = 128K */
    /* RAM   (rwx) : ORIGIN = 0x20000000, LENGTH = 20K */
    /* ORIGIN: 内存区域的起始地址, LENGTH: 大小 */

    /* FLASH内存区域的起始地址和大小 */
    FLASH (rx)      : ORIGIN = 0x8000000, LENGTH = 64K
    /* RAM内存区域的起始地址和大小 */
    RAM (xrw)      : ORIGIN = 0x20000000, LENGTH = 20K

}
/* 用于指定程序的入口点地址 */
ENTRY(main);
/* ORIGIN(RAM)它用于获取RAM内存区域的起始地址，以便在定义内存布局时使用*/
__reset_stack_pointer = ORIGIN(RAM) + LENGTH(RAM);
SECTIONS {
    .text : {
        LONG(__reset_stack_pointer);
        LONG(main | 1);
        /*整个中断表占据了 332 字节的长度，并且需要将当前位置前进到该位置 */
        . += 332; /* .（点）表示当前位置的符号*/
        /* And here comes the rest of the code, ie. all symbols starting with .text */
        *(.text)
        *(.rodata*)
        . = ALIGN(4);
    } > FLASH  /*将 .text 代码段放置到名为 FLASH 的存储区域 */
.ARM.exidx : {
        *(.ARM.exidx*)
        . = ALIGN(4);
    } > FLASH
}
