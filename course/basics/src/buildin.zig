const std = @import("std");
const log = std.log;

pub fn logic() void {
    std.debug.print("------ buildin --------\n", .{});
    const runner = @import("root");
    std.debug.print("root runner: {any}\n", .{runner}); // runner: main
    std.debug.print("typeof root runner: {any}\n", .{@TypeOf(runner)}); //
    std.debug.print("typeinfo root runner: {any}\n", .{@typeInfo(runner)}); //
    // typeinfo root runner:
    // builtin.Type{
    //   .Struct = builtin.Type.Struct{
    //     .layout = builtin.Type.ContainerLayout.Auto,
    //     .backing_integer = null,
    //     .fields = {  },
    //     .decls = { builtin.Type.Declaration{ ... } },
    //     .is_tuple = false
    //   }
    // }

}

fn conv() void {
    log.info("force convert @intCast:{d}", .{@as(u32, @intCast(10))});
    log.info("force convert @TypeOf(@intCast):{}", .{@TypeOf(@as(u32, @intCast(10)))});
    // std.log.info("{}", .{@TypeOf(val)});
}

test "root" {
    const build_runner = @import("root");
    std.debug.print("build_runner: {any}\n", .{build_runner}); // test_runner
}

test "must be intCast?:" {
    // const i:u8 = @intCast(3 & 0x7F); // 不需要@intCast
    // const i: u8 = 3 & 0x7F;
    const i: u8 = 11113 & 0x7F;
    std.debug.print("i:{}\n", .{i});
}

// 整除, 编译时计算
test "@divExact:" {
    std.debug.print("@divExact:{}\n", .{@divExact(3, 1)});
    std.debug.print("@divExact:{}\n", .{3 / 2});

    std.debug.print("@typeInfo(u16).Int.bits:{}\n", .{@typeInfo(u16).Int.bits}); // 16
}

// 大小端转换
test "@byteSwap:" {
    const v: u16 = 300; // 0x012c
    std.debug.print("@byteSwap:{}\n", .{@byteSwap(v)}); // 0x2c01
}
