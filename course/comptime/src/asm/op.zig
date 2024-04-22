const std = @import("std");

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

export fn sumArray(array: [*]const u32, len: usize) u32 {
    var sum: u32 = 0;
    for (array[0..len]) |item| {
        sum += item;
    }
    return sum;
}
