const std = @import("std");

// “comptime 存在于一种不存在 I/O 的纯粹领域中。”

pub fn main() !void {
    std.log.info("factorial:{}", .{factorial(3)});
    std.log.info("factorial comptime:{}", .{comptime factorial(3)});
    std.log.info("chosen:{}", .{numChosen(3, 2)});
    std.log.info("chosen:{}", .{numChosen(3, 1)});
    std.log.info("chosen:{}", .{numChosen(4, 1)});
    std.log.info("chosen:{}", .{numChosen(4, 2)});
    std.log.info("chosen:{}", .{numChosen(4, 3)});
    std.log.info("chosen type:{}", .{ChosenType(3, 2)});
    std.log.info("chosen type:{}", .{ChosenType(3, 1)});
}

fn factorial(comptime n: u8) comptime_int {
    var v = 1;
    inline for (1..(n + 1)) |i| {
        v *= i;
    }
    return v;
}

fn numChosen(comptime m: u8, comptime n: u8) comptime_int {
    return factorial(m) / (factorial(n) * factorial(m - n));
}

fn ChosenType(comptime m: u8, comptime n: u8) type {
    const t = numChosen(m, n);
    return [t][n]u8;
}

test "simple test" {
    std.debug.print("factorial:{}\n", .{factorial(3)});
}
