const std = @import("std");
const expect = std.expect;

pub fn logic() void {
    std.log.info("---------- comptime ---------", .{});

    // !!! 要在运行时修改这个变量，必须给它一个显式的固定大小的数字类型
    // var i = 3;
    // i = 4;
    // std.log.info("{}", .{@TypeOf(i)});

    var i: u8 = 3;
    i = 4;
    std.log.info("{}", .{@TypeOf(i)}); // u8

    std.log.info("{}", .{@TypeOf(2)}); // comptime_int

    var ii: usize = 3;
    ii = 4;
    std.log.info("{}", .{@TypeOf(ii)}); // usize

    std.debug.print("{}\n", .{@TypeOf(.{ .year = 2023, .month = 8 })});
    // struct{comptime year: comptime_int = 2023, comptime month: comptime_int = 8}

}
