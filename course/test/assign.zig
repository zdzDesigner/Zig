const std = @import("std");

pub fn main() void {
    // 常量无法重新分配值
    // const val = 20;
    // val = 2;

    var name = "zdz";
    name = "ccc";

    std.debug.print("vvv\n", .{}); // .{} 点是什么
    std.debug.print("name:{s}", .{name}); // .{} 点是什么

}
