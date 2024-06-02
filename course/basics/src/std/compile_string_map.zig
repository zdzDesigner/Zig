const std = @import("std");

test "ComptimeStringMap:" {
    const TestEnum = enum {
        A,
        B,
        C,
        D,
        E,
    };
    const map = std.ComptimeStringMap(TestEnum, .{
        .{ "these", .D },
        .{ "have", .A },
        .{ "nothing", .B },
        .{ "incommon", .C },
        .{ "samelen", .E },
    });

    std.debug.print("is have:{}\n", .{map.get("have") == .A}); // true
    std.debug.print("is null:{any}\n", .{map.get("xxx")}); // null
}
