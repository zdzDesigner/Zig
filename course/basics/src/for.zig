const std = @import("std");
const mem = std.mem;
const expect = std.testing.expect;

pub fn logic() void {
    std.log.info("--------- for --------", .{});
    const items = [_]i32{ 3, 5, 1, 9 };

    for (items, 0..) |val, i| {
        std.debug.print("{} {}\n", .{ val, i });
    }

    const otheritems = [_]u8{ 4, 2, 1, 9 };

    // `for` 在作用于多个序列上时，要求其长度相等。
    for (items, otheritems) |a, a1| {
        std.log.info("a:{},a1:{}", .{ a, a1 });
    }


    // for 左闭右开(两个点)  区分 switch 的三个点
    for (0..4) |i| {
        std.log.info("{}", .{i});
    }
}

test "for sample" {
    const items = [_]i32{ 3, 5, 1, 9 };
    var sum: i32 = 0;

    for (items) |val| {
        sum += val;
    }

    try expect(sum == 18);
}

test "for i" {
    const items = [_]i32{ 3, 5, 1, 9 };
    var sum: usize = 0;

    try expect(items.len == 4);

    for (items, 2..) |val, i| { // 目的就是为了取下标, 并不是取"部分"
        _ = val;
        sum += i; // i下标从2开始(!!!数量不变, 和预计有差异)：2,3,4,5
    }

    try expect(sum == 14);
}

// inline 关键字会将 for 循环展开，这允许代码执行一些仅在编译时有效的操作
// 转换为编译期计算
test "for ." {
    inline for (.{ "xx", "bb" }, 0..) |val, i| {
        if (i == 0) {
            try expect(val[0] == 'x');
            try expect(mem.eql(u8, val, "xx"));
        }
    }
}

fn typeNameLength(comptime T: type) usize {
    return @typeName(T).len;
}
test "inline for" {
    const nums = [_]i32{ 2, 4, 6 };
    var sum: usize = 0;
    inline for (nums) |i| {
        const T = switch (i) {
            2 => f32,
            4 => i8,
            6 => bool,
            else => unreachable,
        };
        sum += typeNameLength(T);
    }
    try expect(sum == 9);
}
