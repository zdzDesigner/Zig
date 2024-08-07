const hal = @import("hal");
const time = hal.time;
const GPIO = hal.GPIO;

// const led = GPIO.init(.C, 13);
const led = GPIO.init(.B, 12);
var count: u32 = 0;

// To override a hal interrupt just create a struct named VectorTable
// and override any of the interrupt handlers
pub const VectorTable = struct {
    pub fn SysTick() callconv(.C) void {
        const v = 3;
        _ = v;
        // if (count >= 500) {
        //     led.toggle();
        //     count = 0;
        // }
        // count += 1;
        // hal.incrementTick();
    }
};

pub fn main() void {
    hal.init();

    // GPIO.Port.enable(.C);
    GPIO.Port.enable(.B);

    led.asOutput(.{});

    while (true) {}
}
