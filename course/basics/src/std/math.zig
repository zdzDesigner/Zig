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
    std.debug.print("maxInt:{any}\n", .{std.math.maxInt(u32)}); // 4294967295
    std.debug.print("maxInt:{any}\n", .{std.math.maxInt(usize)}); // 18446744073709551615
    std.debug.print("minInt:{any}\n", .{std.math.minInt(u32)}); // 0
}

test "modf:" {
    const v = std.math.modf(3.14);
    std.debug.print("modf::v:ipart:{d},fpart:{d}\n", .{ v.ipart, v.fpart });
}
