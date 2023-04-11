const std = @import("std");

pub fn main() void {
    as();
}

fn as() void {
    limitInner();
    limitOut();
}

fn limitInner() void {
    // @as执行显式类型转换
    const convType = @as(u8, 29);
    std.log.info("{d}", .{convType});

    const convBigType = @as(u32, convType);
    std.log.info("{d}", .{convBigType});

    const convLittleType = @as(u8, convBigType);
    std.log.info("{d}", .{convLittleType});
}

fn limitOut() void {
    const bigType = @as(u32, 39999);
    std.log.info("{d}", .{bigType});

    // error: type 'u8' cannot represent integer value '39999'
    // const bigToType = @as(u8, 39999);
    // std.log.info("{d}", .{bigToType});


    // error: type 'u8' cannot represent integer value '39999'
    // const convLittleType = @as(u8, bigType);
    // std.log.info("{d}", .{convLittleType});
}

test "simple test" {}
