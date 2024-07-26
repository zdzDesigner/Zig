const std = @import("std");

test "getrandom:" {
    var seed: u64 = undefined;
    try std.posix.getrandom(std.mem.asBytes(&seed));

    std.debug.print("seed:{}\n", .{seed});
}

test "getenv:" {
    std.debug.print("env::SHELL:{s}\n", .{std.posix.getenv("SHELL").?});
    std.debug.print("env::SHELL:{s}\n", .{std.posix.getenvZ("SHELL").?});
}

test "uname:" {
    const utsname = std.posix.uname();
    std.debug.print("sysname:{s}\n", .{utsname.sysname});
    std.debug.print("version:{s}\n", .{utsname.version});
    std.debug.print("nodename:{s}\n", .{utsname.nodename});
}
