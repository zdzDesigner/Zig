const std = @import("std");
const expect = std.testing.expect;

// !! 切片是指向数组(部分[编译未知])的指针
// !! 切片是指向数组(部分[编译未知])的指针
// !! 切片是指向数组(部分[编译未知])的指针

pub fn logic() void {
    std.log.info("--------- slice ---------\n", .{});
    basevar();
    pointer();
}

test "array:" {
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

test "slice" {
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
    //
    std.debug.print("对比数组指针和切片指针:{}\n", .{&a == b.ptr});

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
    std.log.info("sliceptr::{s}", .{arr});
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

// !! 自动转换 ===========================================================================
fn testSlice(list: []const i32) void {
    std.debug.print("typeof:{}\n", .{@TypeOf(list)}); // []const i32
    std.debug.print("list[0]:{}\n", .{list[0]});
}
test "slice test" {
    const a = [_]i32{ 1, 2, 3, 4, 5 };
    std.debug.print("array pointer:{}\n", .{@TypeOf(a[1..4])}); // *const [3]i32
    var end: usize = 4;
    end = 4;
    std.debug.print("array pointer(slice):{}\n", .{@TypeOf(a[1..end])}); // []const i32
    testSlice(&a); // *const [5]i32
    testSlice(a[1..3]); // *const [2]i32
    testSlice(a[1..end]); // []const i32
    std.debug.print("对比数组指针和切片指针:{}\n", .{&a == a[0..end].ptr}); // true

    std.debug.print("数组指针:{}\n", .{@TypeOf(&a)}); // *[5]const i32
    std.debug.print("数组指针:{}\n", .{@TypeOf(a[1..3])}); // *[2]const i32
    std.debug.print("数组的多项指针:{}\n", .{@TypeOf(a[1..3].ptr)}); // [*]const i32
}

// 单项指针的类型为：`*T`，`T`是所指向内存区域的类型，解引用方法是 `ptr.*`。
// 多项指针如何解引用? 长度未知了(类别C中的数组指针)
// 参考 pointer.zig
fn testSlicePointer(p: [*]i32) void {
    std.debug.print("p.len:{*}\n", .{p});
    std.debug.print("p[0]:{}\n", .{p[0]}); // 1
    std.debug.print("p[0..3]:type:{},value:{any}\n", .{ @TypeOf(p[0..3]), p[0..3] }); // 变成了数组指针 type:*[3]i32, value:{ 1, 2, 3 }
    std.debug.print("p[0..3].ptr:{*}\n", .{p[0..3].ptr}); // 取指针
}
test "slice pointer" {
    var a = [_]i32{ 1, 2, 3, 4, 5 };
    testSlicePointer((&a)); // 自动转
    testSlicePointer((&a).ptr); // 同上
    std.debug.print("(&a).ptr:{*},\n", .{(&a).ptr});

    // ============= 数组指针
    testSlicePointer((a[0..2])); // 自动转, 这里不出错（传递的仅仅是一个指针）
    testSlicePointer((a[0..2].ptr)); // 同上

    // ============= 切片
    var end: u32 = 1;
    end = 1;
    // testSlicePointer((a[0..end])); // !!error: expected type '[*]i32', found '[]i32'
    testSlicePointer((a[0..end].ptr)); // 这里不出错（传递的仅仅是一个指针）

}

// 切片是指向数组（部分）的长度和指针。
// 切片的类型总是从底层数组派生出来的。
// 无论 b 是否声明为 const，底层数组都是 [5]const i32 类型，因此 b 必须是 []const i32 类型。
// 如果我们想写入 b，就需要将 a 从 const 变为 var。

test "update arr" {}

test "append:" {
    std.debug.print("=============== append:\n", .{});
    comptime var list: []const []const u8 = &.{};
    // comptime var list: []const []const u8 = undefined; // error: use of undefined value here causes undefined behavior
    list = list ++ .{"aa"};
    list = list ++ .{"bb"};

    std.debug.print("list:{any}, length:{}\n", .{ list, list.len });
}

test "slice []const u8:" {
    std.debug.print("=============== slice []const u8:\n", .{});
    const list: [][]const u8 = &.{};

    std.debug.print("list:{any}, length:{}\n", .{ list, list.len });
}
test "struct field append:" {
    // comptime var list: []const []const u8 = &.{};
    // const songlist = struct { // error: type capture contains reference to comptime var
    //     fn append(item: []const u8) void {
    //         list = list ++ .{item};
    //     }
    // };
    //
    // songlist.append("aa");
    // songlist.append("bb");
    //
    // std.debug.print("list:{any}, length:{}\n", .{ songlist.list, songlist.list.len });
}

test "struct field append::" {
    const songlist = struct {
        var list: std.ArrayList([]const u8) = undefined;

        fn init(ally: std.mem.Allocator) void {
            list = std.ArrayList([]const u8).init(ally);
        }

        fn deinit() void {
            list.deinit();
        }

        fn append(item: []const u8) !void {
            try list.append(item);
        }
    };

    songlist.init(std.testing.allocator);
    try songlist.append("aaa");
    try songlist.append("bbb");
    defer songlist.deinit();

    std.debug.print("list:{s}\n", .{songlist.list.items});
}

fn write(buffer: []u8) void {
    buffer[0] = 'a';
}

test "list" {
    var buffer: [3]u8 = undefined;
    write(buffer[0..]);
    std.debug.print("buffer:{s}\n", .{buffer});
}

// 切片
fn sliceptr2(arr: *[]const u8) void {
    std.debug.print("sliceptr::{s}\n", .{arr});
    std.debug.print("sliceptr::{s}\n", .{arr.*});
}

test "slice and pointer::" {
    var a: []const u8 = "aaaaaaaa";
    sliceptr2(&a);
    var b = @as([]const u8, "bbbb");
    sliceptr2(&b);
}

fn myFunc(array: anytype) void {
    const real_array: [array.len]u32 = array;
    return myFuncSlice(&real_array);
}
fn myFuncSlice(slice: []const u32) void {
    std.debug.print("slice:{any}\n", .{slice});
}

test "from array" {
    const arr: [3]u32 = .{ 1, 2, 3 };
    myFunc(arr);
    myFunc(.{ 1, 2, 3, 4 });
    // error: type '[]const u32' does not support array initialization syntax
    myFuncSlice(.{ 1, 2, 3, 4 });
}
