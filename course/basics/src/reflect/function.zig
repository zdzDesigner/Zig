const std = @import("std");

fn reflect(fun: anytype) !void {
    const F = @TypeOf(fun);
    const Args = std.meta.ArgsTuple(F); // 入参数量和类型
    const Res = @typeInfo(F).Fn.return_type.?; // 返回值类型

    std.debug.print("Args:{}\n", .{Args});
    std.debug.print("Res:{}\n", .{Res});
}

fn add(a: i32, b: i32) i32 { // Args: meta.CreateUniqueTuple(2,.{ i32, i32 }) =>  Res: i32
    return a + b;
}
fn add2(a: i32, b: i32, c: u32) i32 { // Args:meta.CreateUniqueTuple(3,.{ i32, i32, u32 }) => Res: i32
    return a + b + c;
}

test "reflect:" {
    try reflect(add);
    try reflect(add2);
}
