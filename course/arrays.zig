const std = @import("std");

pub fn main() void {
    const arr = [_]u8{ 3, 4, 3, 7, 9 };

    std.debug.print("arr.len:{d}\n", .{arr.len});
    std.debug.print("arr[3]:{d}\n", .{arr[3]});

    // arr[4] = 28; // 常量不能赋值

    const lasts = [_]u8{ 11, 12 };

    const arr_lasts = arr ++ lasts;

    std.debug.print("arr_lasts.len:{d}\n", .{arr_lasts.len});
    std.debug.print("arr_lasts last:{d}\n", .{arr_lasts[arr_lasts.len - 1]});

    const repeat = lasts ** 3;
    std.debug.print("repeat.len:{d}\n", .{repeat.len});
}
