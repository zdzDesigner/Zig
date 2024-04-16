const std = @import("std");

test "print" {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("========\n", .{});
    try stdout.print("{}\n", .{true});
    std.debug.print("{}\n", .{true});
}

test "@ describe" {
    const @"cpu.nvic_prio_bits" = "4xx";
    std.debug.print("@:{s}\n", .{@"cpu.nvic_prio_bits"});
}
