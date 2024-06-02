const std = @import("std");

test "random index:" {
    var seed: u32 = undefined;
    std.posix.getrandom(std.mem.asBytes(&seed)) catch unreachable;

    var instance = std.rand.DefaultPrng.init(seed);
    const random = instance.random();
    std.debug.print("val:{}\n", .{random.intRangeLessThan(u8, 10, 100)});
    std.debug.print("val:{}\n", .{random.intRangeLessThan(u8, 10, 100)});
    std.debug.print("val:{}\n", .{random.intRangeLessThan(u8, 10, 100)});
    std.debug.print("val:{}\n", .{random.intRangeLessThan(u8, 10, 100)});
}

test "random buf:" {
    var seed: u64 = undefined;
    std.posix.getrandom(std.mem.asBytes(&seed)) catch unreachable;

    var prng = std.rand.DefaultPrng.init(seed);
    const random = prng.random();

    var list = [_]u32{ 23, 5, 1, 9, 8 };
    random.shuffle(u32, &list);

    std.debug.print("list:{any}\n", .{list});

    var names = [_][]const u8{ "aa", "bb", "cc", "dd", "ee" };
    random.shuffle([]const u8, &names);
    std.debug.print("names:{s}\n", .{names});
}

// shuffle
