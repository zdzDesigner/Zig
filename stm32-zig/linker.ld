MEMORY
{
    /* FLASH (rx)    : ORIGIN = 0x08000000, LENGTH = 64K */
    /* RAM (rxw)     : ORIGIN = 0x20000000, LENGTH = 20K */
    FLASH    (rx)    : ORIGIN = 0x8000000,   LENGTH = 512K
    RAM    (xrw)    : ORIGIN = 0x20000000,   LENGTH = 128K
}

STACK_SIZE = 256;
HEAP_SIZE  = 256;

ENTRY(_start)

SECTIONS {
    .text : {
        KEEP(*(.isr_vector))
        *(.text)
        *(.text*)
        *(.rodata)
        *(.rodata*)
        . = ALIGN(4);
    } > FLASH

    __exidx_start = .;
    .ARM.exidx : {
        *(.ARM.exidx*)
        . = ALIGN(4);
    } > FLASH
    __exidx_end = .;

    _end_text = .;

    .data : AT(_end_text) {
        _start_data = .;
        *(SORT_BY_ALIGNMENT(.data*))
        . = ALIGN(4);
    } > RAM
    _size_data = SIZEOF(.data);

    .bss (NOLOAD) : {
        _start_bss = .;
        *(SORT_BY_ALIGNMENT(.bss*) SORT_BY_ALIGNMENT(COMMON*))
        . = ALIGN(4);
    } > RAM
    _size_bss = SIZEOF(.bss);

    /* DWARF 4 */
    .debug_abbrev 0 : { *(.debug_abbrev) }
    .debug_aranges 0 : { *(.debug_aranges) }
    .debug_frame 0 : { *(.debug_frame) }
    .debug_info 0 : { *(.debug_info) }
    .debug_line 0 : { *(.debug_line) }
    .debug_loc 0 : { *(.debug_loc) }
    .debug_macinfo 0 : { *(.debug_macinfo) }
    .debug_pubnames 0 : { *(.debug_pubnames) }
    .debug_pubtypes 0 : { *(.debug_pubtypes) }
    .debug_ranges 0 : { *(.debug_ranges) }
    .debug_str 0 : { *(.debug_str) }
    .debug_types 0 : { *(.debug_types) }
}

