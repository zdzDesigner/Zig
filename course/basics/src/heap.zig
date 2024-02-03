const std = @import("std");
const expect = std.expect;
const testing = std.testing;
const Allocator = std.mem.Allocator;

pub fn logic() void {
    std.log.info("-------- heap --------", .{});
    base() catch {}; // 捕获错误联合
    oom() catch {};
}

fn base() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();
    // std.log.info("{},{}", .{ gpa, allocator });

    var length: usize = 40;
    length = 40;

    var arr = try allocator.alloc(usize, length);
    defer allocator.free(arr);

    for (0..arr.len) |i| {
        arr[i] = i;
    }

    std.log.info("arr: {any}", .{arr});

    const say = try std.fmt.allocPrint(allocator, "It's over {d}!!!", .{arr.len});
    defer allocator.free(say);
    std.log.info("{s}", .{say});

    // TODO: 可以捕获错误？ 直接用 try xxxxx() catch {};
    // const say = (try std.fmt.allocPrint(allocator, "It's over {d}!!!", .{arr.len})) orelse {
    //     std.log.info(" alloc error ", .{});
    // };
}

fn oom() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};

    var list = try IntList.init(gpa.allocator());
    defer list.deinit();

    for (0..30) |val| {
        // for (0..2) |val| {
        try list.add(@intCast(val + 'a'));
    }
    std.log.info("{s}", .{list.bufs});
}

const IntList = struct {
    index: usize,
    bufs: []u8,
    allocator: Allocator,

    const Self = @This();

    fn init(allocator: Allocator) !IntList {
        return .{
            .allocator = allocator,
            .index = 0,
            .bufs = try allocator.alloc(u8, 4),
        };
    }

    fn deinit(self: Self) void {
        self.allocator.free(self.bufs);
    }

    fn add(self: *Self, val: u8) !void {
        const index = self.index;
        const len = self.bufs.len;
        if (index == len) {
            var newbufs = try self.allocator.alloc(u8, len * 2);
            @memcpy(newbufs[0..len], self.bufs);

            // !!!! 中途申请的内容要释放
            self.allocator.free(self.bufs);
            self.bufs = newbufs;
        }

        self.bufs[index] = val;
        self.index += 1;
    }
};

test "IntList: add" {
    var list = try IntList.init(testing.allocator);
    defer list.deinit();
    for (0..5) |val| {
        // for (0..2) |val| {
        try list.add(@intCast(val + 'a'));
        // try list.add(@as(u8, val + 'a')); //  error: expected type 'u8', found 'usize'
    }
    try testing.expectEqual(@as(usize, 5), list.index);
    try testing.expectEqual(@as(u8, list.bufs[0]), 'a');
    try testing.expectEqual(@as(u8, list.bufs[1]), 'b');
}
