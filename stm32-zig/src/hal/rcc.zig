const std = @import("std");
const chip = @import("chip");
const flash = @import("flash.zig");
const Reg = *volatile chip.types.peripherals.RCC;
const RCC = chip.peripherals.RCC;
// const isdebug = @import("builtin").mode == .Debug;
pub const rcc_reg: Reg = RCC;
// inline fn debug() void {
//     const reg: *volatile Reg = RCC;
//     _ = reg.CIR;
// }

// const Self = @This();
// RCC_DeInit
pub fn reset() void { // 复位
    RCC.CR.modify(.{ .HSION = 1 });
    // Reset SW, HPRE, PPRE1, PPRE2, ADCPRE and MCO bits
    RCC.CFGR.modify(.{ // 0xF8FF0000
        .SW = 0,
        .HPRE = 0,
        .PPRE1 = 0,
        .PPRE2 = 0,
        .ADCPRE = 0,
        .MCO = 0,
    });
    // Reset HSEON, CSSON and PLLON bits
    // Reset HSEBYP bit
    RCC.CR.modify(.{ // 0xFEF6 FFFF   0xFFFB FFFF
        .HSEON = 0,
        .CSSON = 0,
        .PLLON = 0,
        .HSERDY = 0,
    });
    // Reset PLLSRC, PLLXTPRE, PLLMUL and USBPRE/OTGFSPRE bits
    RCC.CFGR.modify(.{
        .PLLSRC = 0,
        .PLLXTPRE = 0,
        .PLLMUL = 0,
        .OTGFSPRE = 0,
    });
    RCC.CIR.raw = 0x009F0000;
}

pub fn openHSE(reg: Reg) void {
    {
        _ = reg;
    }
    // std.debug.assert(rcc_reg == RCC);
    // debug();
    // @call(.always_inline, debug, .{});
    setHSE(.ON);
    if (!isokHSE()) return; // you can write to log

    flash.setPrefetchBuffer(1); // open PrefetchBuffer(预取缓存)
    flash.detLatency(0b010); // SYSCLK周期与闪存访问时间的比例: 2兼容性高(强相关:RCC.CFGR.modify(.{ .SW = 0b10 }))
    RCC.CFGR.modify(.{ .HPRE = 0, .PPRE1 = 0b100, .PPRE2 = 0 }); // AHB1分频
    // RCC.CFGR.modify(.{ .HPRE = 0, .PPRE1 = 0b100, .PPRE2 = 0b111 }); // AHB1分频
    // RCC.CFGR.modify(.{ .HPRE = 0, .PPRE1 = 0, .PPRE2 = 0 }); // AHB1分频
    // RCC.CFGR.modify(.{ .HPRE = 0 }); // AHB:1分频
    // RCC.CFGR.modify(.{ .PPRE1 = 0 }); // APB1:1分频
    // RCC.CFGR.modify(.{ .PPRE2 = 0 }); // APB2:1分频
    // RCC.CFGR.modify(.{ .PPRE2 = 0b110 }); // APB2:8分频

    // 10000 PLLSRC, PLLXTPRE and PLLMUL
    // 设置PLL时钟来源为HSE，设置PLL倍频因子
    RCC.CFGR.modify(.{ .PLLSRC = 1, .PLLXTPRE = 0, .PLLMUL = 0b0111 }); // 分频
    RCC.CR.modify(.{ .PLLON = 1 });
    while (RCC.CR.read().PLLON != 1) {}

    if (RCC.CFGR.read().SWS != 0b10) {
        RCC.CFGR.modify(.{ .SW = 0b10 });
    }

    var i: u32 = 0;
    // while (RCC.CFGR.read().SWS != 0b10 and i != 0x0500) : (i += 1) {}

    i = 200;
}

pub const HSE_CONF = enum {
    ON,
    OFF,
    Bypass,
};
// RCC_HSEConfig
pub inline fn setHSE(conf: HSE_CONF) void {
    // Reset HSEON and HSEBYP bits before configuring the HSE ------------------
    RCC.CR.modify(.{
        .HSEON = 0,
        .HSERDY = 0,
    });
    switch (conf) {
        .ON => {
            RCC.CR.modify(.{ .HSEON = 1 });
        },
        .Bypass => {
            RCC.CR.modify(.{
                .HSEON = 1,
                .HSERDY = 1,
            });
        },
        else => {},
    }
}

// wait HSE startup
fn isokHSE() bool {
    var i: u32 = 0;
    while (RCC.CR.read().HSERDY == 0 and i != 0x0500) : (i += 1) {}
    return RCC.CR.read().HSERDY == 1;
}

// fn getFLAG() bool {
// }
