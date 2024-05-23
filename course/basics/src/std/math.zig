const std = @import("std");

test "math pow" {
    std.debug.print("\n", .{});
    // more type
    std.debug.print("pow:{any}\n", .{std.math.pow(f32, -10, 3)});
    // int
    std.debug.print("powi:{any}\n", .{std.math.powi(i32, -10, 3)});
}

test "maxInt and minInt" {
    std.debug.print("\n", .{});
    std.debug.print("maxInt:{any}\n", .{std.math.maxInt(u32)});
    std.debug.print("minInt:{any}\n", .{std.math.minInt(u32)});
}

test "modf:" {
    const v = std.math.modf(3.14);
    std.debug.print("modf::v:ipart:{d},fpart:{d}\n", .{ v.ipart, v.fpart });
}

test "inf:" {
    std.debug.print("inf(usize):{}\n", .{std.math.inf(f32)});
    std.debug.print("inf(usize):{}\n", .{@as(usize, @bitCast(std.math.inf(f64)))});
}
