const std = @import("std");

const A = struct {
    v: u8,
};

// 参数默认为常量, 拷贝(指针变化)
fn change(a1: A, a2: *A) void {
    std.debug.print("a1 addr:{*}\n", .{&a1}); // const.A@7ffdf1c05aff
    std.debug.print("a2 addr:{*}\n", .{a2}); // const.A@7ffdf1c05b2f
    // @compileLog(@TypeOf(a1)); // @as(type, const.A)
    std.debug.print("@TypeOf(a1):{}\n", .{@TypeOf(a1)}); // @TypeOf(a1):const.A
    std.debug.print("@TypeOf(a1.v):{}\n", .{@TypeOf(a1.v)}); // u8

    std.debug.print("@TypeOf(a2):{}\n", .{@TypeOf(a2)}); // @TypeOf(a1):*const.A
    std.debug.print("@TypeOf(a2.v):{}\n", .{@TypeOf(a2.v)}); // u8

    a2.*.v = 4;
    std.debug.print("a1:{}\n", .{a1});
}

test "function args:" {
    var a = A{ .v = 8 };
    std.debug.print("a addr:{*}\n", .{&a}); // const.A@7ffdf1c05b2f
    change(a, &a);

    std.debug.print("v:{d}\n", .{a.v});

    a.v = 3;
}
