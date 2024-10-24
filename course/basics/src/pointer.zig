const std = @import("std");
const expect = std.testing.expect;

// Zig 中的普通指针不允许将 0 或 null 作为值。它们遵循语法 *T ，其中 T 是子类型。
// 引用使用 &variable 完成，取消引用使用 variable.* 完成。

// 有时，您可能有一个指向"未知数量元素"的指针。 [*]T 是解决方案，它的工作方式类似于 *T ，但也支持索引语法、指针算术和切片。
// 与 *T 不同，它不能指向没有已知大小的类型。 *T 强制到 [*]T 。

const User = struct {
    id: u64,
    power: i32,
    name: []u8,
};
fn updateUser(user: User) void {
    std.log.info("updateUser user address: {*}", .{&user}); // pointer.User@7ffefe11c0c0
    user.name[0] = '!';
}

pub fn logic() void {
    std.log.info("------- pointer -------", .{});
    size();

    var name = [4]u8{ 'a', 'b', 'c', 'd' };

    const user = User{
        .id = 1,
        .power = 3,
        .name = name[1..],
    };

    updateUser(user);
    std.log.info("user address: {*}", .{&user}); // pointer.User@7ffefe11c148
    std.log.info("update user: {}", .{user}); // 更改成功
}

fn size() void {
    // usize 和 isize 作为无符号和有符号整数给出，其大小与指针相同。
    std.log.info("usize sizeof:{}, *u8 sizeof:{}", .{ @sizeOf(usize), @sizeOf(*u8) });
    std.log.info("u16 sizeof:{}, *u16 sizeof:{}", .{ @sizeOf(u16), @sizeOf(*u16) });
    std.log.info("u17 sizeof:{}, *u17 sizeof:{}", .{ @sizeOf(u17), @sizeOf(*u17) });
    std.log.info("u18 sizeof:{}, *u18 sizeof:{}", .{ @sizeOf(u18), @sizeOf(*u18) });
    var arr = [_]u8{ 5, 4, 2, 6 };
    std.log.info("arr:{}, address: {*}", .{ @TypeOf(arr), &arr }); // arr:*[4]u8, 栈里
    std.log.info("&arr:{}", .{@TypeOf(&arr)}); // &arr:*[4]u8
}

fn inc(i: *u8) void {
    i.* += 1;
}

test "test pointer" {
    var i: u8 = 10;
    inc(&i);

    try expect(i == 11);
}

test "test force convert pointer to zero" {
    // 尝试将 *T 设置为值 0 是可检测到的非法行为。
    // _ = @intToPtr(*u8, 0);
    // error: pointer type '*u8' does not allow address zero

}

test "test const pointer" {
    // const i: u8 = 1;
    // var p: *u8 = &i;
    // error: expected type '*u8', found '*const u8
    // try expect(p.* == 1);

}

test "pointer 转换:" {
    var arr = [_]u8{ 5, 4, 2, 6 }; // 数组
    std.debug.print("&arr:{*}\n", .{&arr}); // 转换为数组指针: [4]u8@7ffe6dfc453c
    std.debug.print("&arr[0..3]:{}\n", .{&arr[0..3]}); // 数组指针: *[3]u8@7ffe6dfc4548

    const mp: [*]u8 = &arr; // 数组 => 多项指针
    const p = &mp[0..3]; // 多项指针 => 数组指针
    std.debug.print("p:{}\n", .{p});
    std.debug.print("p.*:{*}\n", .{p.*}); // 转换为数组: [3]u8@7ffe6dfc453c
    std.debug.print("p.*.ptr:{*}\n", .{p.*.ptr}); // 转换为数组指针 u8@7ffe6dfc453c
    std.debug.print("p.*.len:{}\n", .{p.*.len}); // 3
}

// ========= 擅长用于加减运算
// ========= 从已知长度转换未知长度
test "test [*]T::action:" {
    var arr = [_]u16{ 5, 4, 2, 6 };
    try expect(arr.len == 4);
    const p: [*]u16 = &arr; // 从已知长度转换未知长度
    // =============
    std.debug.print("p:{*}\n", .{p}); // p:u16@7ffcdfa39250
    std.debug.print("p+1:{*}\n", .{p + 1}); // p+1:u16@7ffcdfa39252
    // =============
    const p1 = @as([*]u16, p + 1);
    std.debug.print("typeof p+1:{}\n", .{@TypeOf(p1)}); // [*]u16
    const p1_1: [*]u16 = @ptrCast(p + 1);
    std.debug.print("typeof p+1:{}\n", .{@TypeOf(p1_1)}); // [*]u16
    // =============
    std.debug.print("p+1:{}\n", .{(p + 1)[0]}); // 4
    std.debug.print("p+2:{}\n", .{(p + 2)[0]}); // 2
    // std.debug.print("p-2:{}\n", .{(p - 2)[0]}); // 32765  越界了
}

test "test [*]T" {
    var arr = [_]u8{ 5, 4, 2, 6 };
    try expect(arr.len == 4);
    const p: [*]u8 = &arr; // 从已知长度转换未知长度
    // =============
    std.debug.print("p:{}\n", .{@TypeOf(p)}); // p:[*]u8  多项指针
    // =============
    std.debug.print("p[0]:{}\n", .{p[0]}); // 5
    std.debug.print("typeof p[0]:{}\n", .{@TypeOf(p[0])}); // u8
    // =============
    std.debug.print("p[0..3]:{any}\n", .{p[0..3]}); // {5,4,2}
    std.debug.print("typeof p[0..3]:{any}\n", .{@TypeOf(p[0..3])}); // *[3]u8  数组指针
    std.debug.print("p[0..3].*:{any}\n", .{@TypeOf(p[0..3].*)}); // [3]u8  数组
    // ====================
    std.debug.print("p:{}\n", .{@typeInfo(@TypeOf(p))}); // p:[*]u8
    // p:builtin.Type{
    //   .Pointer = builtin.Type.Pointer{
    //      .size = builtin.Type.Pointer.Size.Many,
    //      .is_const = false,
    //      .is_volatile = false,
    //      .alignment = 1,
    //      .address_space = builtin.AddressSpace.generic,
    //      .child = u8,
    //      .is_allowzero = false,
    //      .sentinel = null
    //   }
    // }
    // ====================
    const s: []u8 = arr[0..3];
    std.debug.print("typeof s:{}\n", .{@TypeOf(s)}); // []u8  切片

    // std.debug.print("p.*:{*}\n", .{p.*}); // p:u8@7fff676b5384
    // try expect(p.*.len == 4);
    // error: index syntax required for unknown-length pointer type '[*]u8'
    // try expect(p.len == 4);
    // error: type '[*]u8' does not support field access
}

test "test usize and isize" {
    try expect(@sizeOf(usize) == @sizeOf(*u8));
    try expect(@sizeOf(isize) == @sizeOf(*u8));
}

// 可以将切片视为一对 [*]T （指向数据的指针）和 usize （元素计数）。它们的语法为 []T ，其中 T 是子类型。
// 切片在整个 Zig 中大量使用，用于当您需要对任意数量的数据进行操作时。
// 切片与指针具有相同的属性，这意味着也存在常量切片。对于循环也对切片进行操作。Zig 中的字符串文字强制为 []const u8 。

fn totle(arr: []const u8) u16 {
    var sum: u16 = 0;
    for (arr) |item| {
        sum += item;
    }
    return sum;
}
test "test slice" {
    const pool = [_]u8{ 4, 2, 6, 1, 8 };
    const sub = pool[2..4];
    try expect(sub.len == 2);
    try expect(totle(sub) == 7);

    // 当这些 n 和 m 值在编译时都是已知的时，切片实际上会生成"指向数组的指针"。这不是指向数组的指针的问题，即 *[N]T 将强制到 []T 。
    try expect(@TypeOf(sub) == *const [2]u8);
    try expect(pool[2..].len == 3);
}

fn multiPointer(p: [*]u8) void {
    std.debug.print("p:{any}\n", .{@TypeOf(p)});

    switch (@typeInfo(@TypeOf(p))) {
        .Pointer => |pointer| {
            std.debug.print("ppointer.size:{}\n", .{pointer.size});
            // ppointer.size:builtin.Type.Pointer.Size.Many
        },
        else => {},
    }
}

test "pointer.child:" {
    const char: u8 = '2';
    std.debug.print("type of char:{}\n", .{@TypeOf(&char)}); // *const u8

    switch (@typeInfo(@TypeOf(&char))) {
        .Pointer => |p| {
            // p:builtin.Type.Pointer{
            //     .size = builtin.Type.Pointer.Size.One,
            //     .is_const = true,
            //     .is_volatile = false,
            //     .alignment = 1,
            //     .address_space = builtin.AddressSpace.generic,
            //     .child = u8,
            //     .is_allowzero = false,
            //     .sentinel = null
            // }
            std.debug.print("p:{}\n", .{p});
        },
        else => {},
    }

    const strlist = &.{ "aaa", "bbb" };
    std.debug.print("typeof strlist:{}\n", .{@TypeOf(strlist)});
    switch (@typeInfo(@TypeOf(strlist))) {
        .Pointer => |p| {
            // p:builtin.Type.Pointer{
            //     .size = builtin.Type.Pointer.Size.One,
            //     .is_const = true,
            //     .is_volatile = false,
            //     .alignment = 1,
            //     .address_space = builtin.AddressSpace.generic,
            //     .child = struct{
            //         comptime *const [3:0]u8 = &.{ 97, 97, 97 },
            //         comptime *const [3:0]u8 = &.{ 98, 98, 98 }
            //     },
            //     .is_allowzero = false,
            //     .sentinel = null
            // }
            std.debug.print("p:{}\n", .{p});
        },
        else => {},
    }

    var a = [_]u8{ 1, 2, 3, 4, 5 };
    multiPointer((&a));
}

// @ptrCast ================================

fn toPtr(user: *const User) *const User {
    return @ptrCast(user);
}
test "@ptrCast:" {
    const user = std.mem.zeroes(User);
    std.debug.print("user :{}\n", .{user});
    std.debug.print("user ptr:{*}\n", .{&user});
    std.debug.print("toPtr user :{*}\n", .{toPtr(&user)});
}
fn toPtr2(user: *User) *User {
    return @ptrCast(user);
}
test "@ptrCast2:" {
    const user = std.mem.zeroes(User);
    std.debug.print("user :{}\n", .{user});
    std.debug.print("user ptr:{*}\n", .{&user});
    std.debug.print("toPtr user :{*}\n", .{toPtr(&user)});
}

// const V = struct {
//     fn toPtr(v: *const V) *const V {
//         return @ptrCast(v);
//     }
// };
// const v = V{};
//
// test "@ptrCast2:" {
//     std.debug.print("v:{}\n", .{v});
// }
//
//

test "pointer const slice:" {
    var val: []const u8 = undefined;
    std.debug.print("undefined val pointer:{*}\n", .{val.ptr}); // u8@aaaaaaaaaaaaaaaa
    val = "sss";
    std.debug.print("sss val pointer:{*}\n", .{val.ptr}); // u8@10236c3
    std.debug.print("val pointer:{*}\n", .{&val});
    val = "bbbb";
    std.debug.print("bbbb val pointer:{*}\n", .{val.ptr}); // u8@1024058
    std.debug.print("val pointer:{*}\n", .{&val});
    // val[0] = 'x';
    std.debug.print("val:{s}\n", .{val});
}

test "pointer const:" {
    const v: u8 = 8;
    std.debug.print("@TypeOf(v):{}\n", .{@TypeOf(v)}); // u8
    const pv: *const u8 = &v;
    var val: *const u8 = undefined; // 指针常量
    val = pv;
    std.debug.print("val:{}\n", .{val.*});

    // val.* = 3; // error: cannot assign to constant
    // std.debug.print("val:{}\n", .{val.*});
}

test "base::" {
    // 常量
    const a: u8 = 89;
    std.debug.print("@TypeOf(a):{}\n", .{@TypeOf(a)}); // u8
    std.debug.print("@TypeOf(&a):{}\n", .{@TypeOf(&a)}); // *const u8 (常量指针)

    // 变量
    var b: u8 = 89;
    std.debug.print("@TypeOf(b):{}\n", .{@TypeOf(b)}); // u8
    std.debug.print("@TypeOf(&b):{}\n", .{@TypeOf(&b)}); // *u8(指针)
    b = b;

    const c: *u8 = &b;
    std.debug.print("@TypeOf(c):{}\n", .{@TypeOf(c)}); // *u8(指针常量)
    std.debug.print("@TypeOf(c.*):{}\n", .{@TypeOf(c.*)}); // u8

    var d: *u8 = undefined;
    std.debug.print("@TypeOf(d):{}\n", .{@TypeOf(d)}); // *u8
    d = &b;
}
