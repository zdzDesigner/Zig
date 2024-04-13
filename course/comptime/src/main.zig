const std = @import("std");

// “comptime 存在于一种不存在 I/O 的纯粹领域中。”

pub fn main() !void {
    // @setCold(true);
    std.log.info("factorial:{}", .{factorial(3)});
    std.log.info("factorial comptime:{}", .{comptime factorial(3)});
    std.log.info("chosen:{}", .{numChosen(3, 2)});
    std.log.info("chosen:{}", .{numChosen(3, 1)});
    std.log.info("chosen:{}", .{numChosen(4, 1)});
    std.log.info("chosen:{}", .{numChosen(4, 2)});
    // std.log.info("chosen:{}", .{numChosen(2, 4)}); // assert
    std.log.info("chosen:{}", .{numChosen(4, 3)});
    std.log.info("chosen type:{}", .{ChosenType(3, 2)});
    std.log.info("chosen type:{}", .{ChosenType(3, 1)});
    std.log.info("choose:[_]u8{1,2,3,4},2::{}", .{choose(&[_]u8{ 1, 2, 3, 4 }, 2)});
}

pub fn factorial(comptime n: u8) comptime_int {
    var v = 1;
    inline for (1..(n + 1)) |i| {
        v *= i;
    }
    return v;
}

pub fn numChosen(comptime m: u8, comptime n: u8) comptime_int {
    std.debug.assert(m > n);
    return factorial(m) / (factorial(n) * factorial(m - n));
}

pub fn ChosenType(comptime m: u8, comptime n: u8) type {
    const t = numChosen(m, n);
    return [t][n]u8;
}

pub fn choose(comptime l: []const u8, comptime k: u8) ChosenType(l.len, k) {
    std.debug.assert(l.len >= k);
    std.debug.assert(k > 0);

    var ret: ChosenType(l.len, k) = std.mem.zeroes(ChosenType(l.len, k));

    if (k == 1) {
        inline for (0..l.len) |i| {
            ret[i] = [k]u8{l[i]};
        }
        return ret;
    }
    // !!TODO  这里有编译问题
    const c = choose(l[1..], k - 1);
    var i = 0;
    inline for (0..(l.len - 1)) |m| {
        inline for (0..c.len) |n| {
            if (l[m] < c[n][0]) {
                ret[i][0] = l[m];
                inline for (0..c[n].len) |j| {
                    ret[i][j + 1] = c[n][j];
                }
                i += 1;
            }
        }
    }
    return ret;
}

test "simple test" {
    std.debug.print("factorial:{}\n", .{factorial(3)});
}
