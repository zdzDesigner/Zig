const chip = @import("chip");
const RCC = chip.peripherals.RCC;

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

pub fn openHSE() void {
    hseConfig(.ON);
}

pub const HSE_CONF = enum {
    ON,
    OFF,
    Bypass,
};
// RCC_HSEConfig
pub inline fn hseConfig(conf: HSE_CONF) void {
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
