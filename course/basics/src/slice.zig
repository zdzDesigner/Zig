const std = @import("std");
const expect = std.testing.expect;

pub fn logic() void {
    slice();
    array();
}

fn array() void {
    var arr = [_]u8{ 1, 3, 4, 5 };
    arr[0] = 33;

    std.log.info("{any}", .{arr});
    std.log.info("{}", .{@TypeOf(arr)}); // [4]u8
}

fn slice() void {
    std.log.info("--------- slice ---------\n", .{});
    const a = [_]i32{ 1, 2, 3, 4, 5 };
    var end: usize = 4; // var 编译时未知
    end = 4;
    const b = a[1..end];
    std.log.info("{any}", .{@TypeOf(b)}); // []const i32  切片

    const end2: usize = 4; // const 编译时已知
    const b2 = a[1..end2];
    std.log.info("{any}", .{@TypeOf(b2)}); // *const [3]i32

    const c = a[1..3];
    std.log.info("{any}", .{c});
    std.log.info("{}", .{@TypeOf(c)});
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
