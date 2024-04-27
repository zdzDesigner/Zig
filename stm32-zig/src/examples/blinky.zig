const hal = @import("hal");
const time = hal.time;
const GPIO = hal.GPIO;

pub fn main() void {
    hal.init();

    // GPIO.Port.enable(.C);
    // const led = GPIO.init(.C, 13);

    GPIO.Port.enable(.B);
    const led = GPIO.init(.B, 12);

    led.asOutput(.{});

    while (true) {
        time.delay_ms(3000);
        led.toggle();
    }
}
