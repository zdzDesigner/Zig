const std = @import("std");

fn testQuota() u64 {
    @setEvalBranchQuota(90000);

    var i: u64 = 0;
    while (i < std.math.maxInt(u64)) {
        i = i + 1;
    }
    return i;
}

test "setEvalBranchQuota:" {
    // 分支配额(一定是 comptime 模式中执行)
    std.debug.print("i:{}\n", .{comptime testQuota()});
}
