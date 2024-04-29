const chip = @import("chip");
const FLASH = chip.peripherals.FLASH;

pub fn setPrefetchBuffer(enable: u1) void {
    // FLASH.ACR.modify(.{ .PRFTBE = 0 });
    // TODO:: 简单处理
    FLASH.ACR.modify(.{ .PRFTBE = enable });
}

pub fn detLatency(val: u3) void {
    FLASH.ACR.modify(.{ .LATENCY = val });
}
