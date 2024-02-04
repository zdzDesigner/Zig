const std = @import("std");
const expect = std.expect;
const testing = std.testing;
const Allocator = std.mem.Allocator;

pub fn logic() void {
    std.log.info("---------- comptime ---------", .{});
    compileType();

    listDemo() catch {};
}

fn compileType() void {
    var list: IntArray(5, u8) = undefined;
    list[0] = 2;

    std.log.info("{any}", .{list}); // { 2, 170, 170, 170, 170 }
    // 170: 0b10101010
}

fn IntArray(comptime length: comptime_int, t: type) type {
    return [length]t;
}

fn base() void {
    // !!! 要在运行时修改这个变量，必须给它一个显式的固定大小的数字类型(准确传达意图)
    var i = 3; //  error: variable of type 'comptime_int' must be const or comptime
    i = 4;

    // var i: u8 = 3; // 指明类型
    // i = 4;
    // std.log.info("{}", .{@TypeOf(i)}); // u8

    std.log.info("{}", .{@TypeOf(2)}); // comptime_int

    var ii: usize = 3;
    ii = 4;
    std.log.info("{}", .{@TypeOf(ii)}); // usize

    std.debug.print("{}\n", .{@TypeOf(.{ .year = 2023, .month = 8 })}); // 匿名结构体
    // struct{comptime year: comptime_int = 2023, comptime month: comptime_int = 8}

}

fn listDemo() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    // 如果我们再次使用 `List(u32)`，编译器将重新使用之前创建的类型
    var list = try List(u8).init(gpa.allocator());
    defer list.deinit();

    for (0..10) |val| {
        try list.add(@intCast(val));
    }

    std.log.info("{any}", .{list});

    std.log.info("编译器将重新使用之前创建的类型:{any}", .{List(u8) == List(u8)}); // true
}

fn List(comptime T: type) type {
    return struct {
        index: usize = 0,
        bufs: []T,
        allocator: Allocator,

        // `@This()` 内置函数会返回它被调用时的最内层类型
        const Self = @This();

        fn init(allocator: Allocator) !Self {
            return .{
                .allocator = allocator,
                .bufs = try allocator.alloc(T, 4),
            };
        }

        fn deinit(self: Self) void {
            self.allocator.free(self.bufs);
        }

        fn add(self: *Self, item: T) !void {
            const index = self.index;
            const length = self.bufs.len;
            if (index == length) {
                var newbufs = try self.allocator.alloc(T, length * 2);
                @memcpy(newbufs[0..length], self.bufs);

                self.allocator.free(self.bufs);
                self.bufs = newbufs;
            }

            self.bufs[self.index] = item;
            self.index += 1;
        }
    };
}

test "List alloc" {
    var list = try List(f64).init(testing.allocator);
    defer list.deinit();

    for (0..20) |val| {
        try list.add(@floatFromInt(val));
    }

    try testing.expectEqual(list.index, 20);
    try testing.expectEqual(20, list.index);
    try testing.expectEqual(list.bufs[0], 0);
    try testing.expectEqual(list.bufs[1], 1);
}
