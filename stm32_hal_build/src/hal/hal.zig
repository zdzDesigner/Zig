pub usingnamespace @cImport({
    @cDefine("STM32F103xB", {});
    @cDefine("USE_HAL_DRIVER", {});
    @cInclude("main.h");
});

pub extern fn HAL_RCC_GPIOB_CLK_ENABLE() callconv(.C) void;

// const hal = struct {
//     pub const GPIO_TypeDef = extern struct {
//         MODER: u32 = @import("std").mem.zeroes(u32),
//         OTYPER: u32 = @import("std").mem.zeroes(u32),
//         OSPEEDR: u32 = @import("std").mem.zeroes(u32),
//         PUPDR: u32 = @import("std").mem.zeroes(u32),
//         IDR: u32 = @import("std").mem.zeroes(u32),
//         ODR: u32 = @import("std").mem.zeroes(u32),
//         BSRR: u32 = @import("std").mem.zeroes(u32),
//         LCKR: u32 = @import("std").mem.zeroes(u32),
//         AFR: [2]u32 = @import("std").mem.zeroes([2]u32),
//     };
//     pub const PERIPH_BASE = @as(c_ulong, 0x40000000);
//     pub const AHB1PERIPH_BASE = PERIPH_BASE + @as(c_ulong, 0x00020000);
//     pub const GPIOA_BASE = AHB1PERIPH_BASE + @as(c_ulong, 0x0000);
//     pub const GPIOA = @import("std").zig.c_translation.cast([*c]GPIO_TypeDef, GPIOA_BASE);
//     pub const GPIO_PIN_15 = @import("std").zig.c_translation.cast(u16, @as(c_uint, 0x8000));
//     pub const LED_BLINK_Pin = GPIO_PIN_15;
//     pub const LED_BLINK_GPIO_Port = GPIOA;
//     pub const GPIO_PinState = c_uint;
//     pub const GPIO_PIN_RESET: c_int = 0;
//     pub const GPIO_PIN_SET: c_int = 1;
//     pub extern fn HAL_GPIO_WritePin(GPIOx: [*c]GPIO_TypeDef, GPIO_Pin: u16, PinState: GPIO_PinState) void;
//     pub extern fn HAL_Delay(Delay: u32) void;
// };
