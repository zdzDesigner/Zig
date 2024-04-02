const std = @import("std");
const expect = std.testing.expect;

pub fn logic() void {
    std.log.info("--------- slice ---------\n", .{});
    basevar();
    slice();
    array();
    pointer();
}

fn array() void {
    var arr = [_]u8{ 1, 3, 4, 5 };
    arr[0] = 33;

    std.log.info("{any}", .{arr});
    std.log.info("{}", .{@TypeOf(arr)}); // [4]u8 数组
}

fn basevar() void {
    const a = 3;
    std.log.info("compile_int:{any}", .{@TypeOf(a)}); // comptime_int

    const b: u8 = 3;
    std.log.info("常量int:{any}", .{@TypeOf(b)}); // const u8
    std.log.info("常量int指针:{any}", .{@TypeOf(&b)}); // *const u8

    const c = "abcd你";
    std.log.info("字符串常量:{any}", .{@TypeOf(c)}); // *const [7:0]u8
}

fn slice() void {
    arrval([_]i32{ 1, 2, 3 });

    const a = [_]i32{ 1, 2, 3, 4, 5 };
    std.log.info("常量数组:{any}", .{@TypeOf(a)}); // [5]i32
    std.log.info("常量数组指针:{any}", .{@TypeOf(&a)}); // *const [5]i32
    const aa = [_]i32{ 1, 2, 3 };
    arrptr(&aa);

    var end: usize = 4; // var 编译时未知
    end = 4;
    const b = a[1..end];
    std.log.info("切片:{any}", .{@TypeOf(b)}); // []const i32  切片 const 不可编辑

    // 如果两个边界值均是编译期可知的话，编译器会直接将切片优化为`数组指针`
    const end2: usize = 4; // const 编译时已知
    const b2 = a[1..end2];
    std.log.info("数组指针:{any}", .{@TypeOf(b2)}); // *const [3]i32 数组指针
    arrptr(b2);

    const c = a[1..3];
    std.log.info("{any}", .{c});
    std.log.info("{}", .{@TypeOf(c)});

    sliceptr("======sliceptr======");
}
// 数组参数
fn arrval(arr: [3]i32) void {
    std.log.info("{any}", .{arr});
}

// 数组指针常量
fn arrptr(arr: *const [3]i32) void {
    std.log.info("{any}", .{arr});
    // arr[0] = 8; // const 不能修改
}
// 切片
fn sliceptr(arr: []const u8) void {
    std.log.info("{s}", .{arr});
}

fn pointer() void {
    const arr = [_]u8{ 2, 1, 3, 4, 5 };
    std.log.info("arr len:{d}", .{arr.len});
    std.log.info("arr ptr:{*}", .{&arr}); // [5]u8@1114940

    const s1 = arr[1..3];
    std.log.info("s1 len:{d}", .{s1.len}); // 2
    std.log.info("s1 ptr:{*}", .{s1.ptr}); // u8@1114941

    const s2 = arr[1..4];
    std.log.info("s2 len:{d}", .{s2.len}); // 3
    std.log.info("s2 ptr:{*}", .{s2.ptr}); // u8@1114941

    std.log.info("eq ptr:{}", .{s1.ptr == s2.ptr}); // true
    // std.log.info("eq ptr:{b}", .{true}); // error "b" not bool
    std.log.info("eq ptr:{}", .{@TypeOf(s1.ptr == s2.ptr)}); // bool
}

// b 是一个长度为 3 的切片，并且是一个指向 a 的指针。
// 但是因为我们使用编译时已知的值来对数组进行切片（即 1 和 4）所以长度 3 在编译时也是已知。
// Zig 编译器能够分析出来这些信息，因此 b 不是一个切片，而是一个指向长度为 3 的整数数组的指针。
// 具体来说，它的类型是 *const [3]i32。所以这个切片的示例被 Zig 编译器的强大推导能力挫败了。

test "arr pointer test" {
    const a = [_]u8{ 1, 2, 9, 1, 8 };
    try expect(@TypeOf(a) == [5]u8);
    const b = a[1..4];

    try expect(a[3] == b[2]);
    try expect(@TypeOf(b) == *const [3]u8);

    // b[0] = 88; // error: cannot assign to constant
}

// 如果我们将 end 声明为 const 那么它将成为编译时已知值，
// 这将导致 b 是一个指向数组的指针，而不是切片。
// 我觉得这有点令人困惑，但它并不是经常出现的东西，而且也不太难掌握。
// 我很想在这一点上跳过它，但无法找到一种诚实的方法来避免这个细节。

test "slice test" {
    const a = [_]i32{ 1, 2, 3, 4, 5 };
    const end: usize = 4;
    const b = a[1..end];
    try expect(@TypeOf(b) == []const i32); // 切片
}

// 切片是指向数组（部分）的长度和指针。
// 切片的类型总是从底层数组派生出来的。
// 无论 b 是否声明为 const，底层数组都是 [5]const i32 类型，因此 b 必须是 []const i32 类型。
// 如果我们想写入 b，就需要将 a 从 const 变为 var。

test "update arr" {}
