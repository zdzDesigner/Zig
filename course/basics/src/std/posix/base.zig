const std = @import("std");

test "getrandom:" {
    var seed: u64 = undefined;
    try std.posix.getrandom(std.mem.asBytes(&seed));

    std.debug.print("seed:{}\n", .{seed});
}
