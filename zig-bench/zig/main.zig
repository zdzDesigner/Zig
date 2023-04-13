const std = @import("std");

pub fn main() void {
    var i: u8 = 1;
    while (i <= 20) {
        std.debug.print("{d}\n", .{fib(i)});
        i = i + 1;
    }
}

fn fib(i: u8) u32 {
    if (i == 1 or i == 2) {
        return 1;
    }
    return fib(i - 1) + fib(i - 2);
}
