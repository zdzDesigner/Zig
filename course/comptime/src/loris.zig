const std = @import("std");

fn multiply(a: i32, b: i32) i32 {
    return a * b;
}

test "static assign" {
    // 以下代码使用函数来确定静态分配数组的长度。
    // 请注意，函数定义没有任何声明它必须在编译时可用的属性。它只是一个普通函数，我们请求它在调用站点编译时执行。
    const length = comptime multiply(2, 5);
    std.debug.print("length:{}\n", .{length});
    const arr: [length]u8 = undefined;
    std.debug.print("arr:{d}\n", .{arr.len});
}

fn strEql(comptime lower: []const u8, upper: []const u8) bool {
    comptime {
        var i = 0;
        while (i < lower.len) : (i += 1) {
            if (lower[i] < 'a' or lower[i] > 'z') {
                @compileError("illegal uppercase");
            }
        }
    }
    // 测试块作用域(!!不支持嵌套作用域)
    {
        const i: u8 = 2;
        std.debug.print("{}", .{i});
    }

    var i: u32 = 0;
    while (i < lower.len) : (i += 1) {
        const val = blk: {
            if (lower[i] >= 'a' and lower[i] <= 'z') break :blk lower[i] - 32;
            break :blk lower[i];
        };
        if (val != upper[i]) return false;
    }

    return true;
}

test "uppercase and lowercase string equal:" {
    std.debug.print("aaa:AAA:{}\n", .{strEql("aaa", "AAA")});
}

// Zig 可以`静态解析`依赖于`编译时已知值`的`控制流表达式`。

fn readAll() !void {
    var buf: [10]u8 = undefined;
    // std.io.countingReader()
    const f = std.io.getStdIn();
    const size = try f.readAll(&buf);
    std.debug.print("size:{}\n", .{size});
}

fn readLine(allocator: std.mem.Allocator) !i32 {
    // TODO:: buffer to writer
    // var buf: [10]u8 = undefined;

    // var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    // const allocator = gpa.allocator();
    var buf = std.ArrayList(u8).init(allocator);
    defer buf.deinit();
    const reader = std.io.getStdIn().reader();
    // std.io.getStdOut()
    // reader.readUntilDelimiter("", '\n');
    while (reader.streamUntilDelimiter(buf.writer(), '\n', null) != error.NoEofError) {
        std.debug.print("input:{s}\n", .{buf.items});
        const v = try std.fmt.parseInt(i32, buf.items, 10);
        std.debug.print("v:{}\n", .{v});

        buf.clearRetainingCapacity();
        return v;
    }
    return 0;
}

// error: unable to evaluate comptime expression
// fn computed(comptime ops: [] Op, num: i32) i32 {
const Op = enum {
    Add,
    Sub,
    Mul,
};
fn computed(comptime ops: []const Op, num: i8) !i8 {
    var val: i8 = 1;

    inline for (ops) |op| {
        switch (op) {
            .Add => {
                val +%= num;
                std.debug.print("Add:{}\n", .{val});
            },
            .Sub => {
                val -%= num;
                std.debug.print("Sub:{}\n", .{val});
            },
            .Mul => {
                val *%= num;
                std.debug.print("Mul:{}\n", .{val});
            },
        }
    }

    return val;
}

test "user input" {
    // try readAll();
    // const allocator = std.testing.allocator;
    // const v = try readLine(allocator);
    // std.debug.print("v:{}\n", .{v});
    // const ops = [_]Op{ .Mul, .Sub, .Add, .Add };
    // const ret = try computed(&ops, @intCast(v));
    // std.debug.print("ret:{}\n", .{ret});
}

fn make_couple_of(x: anytype) [2]@TypeOf(x) {
    return [2]@TypeOf(x){ x, x };
}

test "make couple of:" {
    std.debug.print("make:{s}\n", .{make_couple_of("3")});
}
