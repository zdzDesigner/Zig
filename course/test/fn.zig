const std = @import("std");

pub fn main() void {
    const val: u8 = valFn();

    std.debug.print("val:{d}\n", .{val});
}

fn valFn() u8 {
    return 44;
}
