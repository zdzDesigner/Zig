const std = @import("std");

pub fn main() void {
    var val: u32 = 2;
    std.debug.print("val:{d}\n", .{val});

    var i: u8 = 0;

    while (i < 10) {
        std.debug.print("i:{d}\n", .{i});
        i = i + 1;
    }

    std.debug.print("-------- another --------", .{});

    while (i < 20) : (i = i + 1) {
        std.debug.print("i:{d}\n", .{i});
    }
}

test "test while" {
    var i: usize = 1;
    while (i < 10) : (i += 3) {}
}
