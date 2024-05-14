const std = @import("std");

const vv = (
    \\-h, --help                Display this help and exit
    \\-s, --schema <str>        Explicitly set schema type, one of: svd, atdf, json
    \\-o, --output_path <str>   Write to a file
    \\
    \\-j, --json                Write output as JSON
    \\
    \\<str>...
);

test "line:" {
    std.debug.print("vv:{s}\n", .{vv});

    var len_line: u32 = 0;
    var it = std.mem.split(u8, vv, "\n");
    while (it.next()) |line| {
        std.debug.print("line:{s}\n", .{line});
        if (!std.mem.startsWith(u8, line, "-")) continue;
        len_line += 1;
    }
    std.debug.print("len_line:{}\n", .{len_line}); // 4
}

test "char:" {
    for (vv, 0..) |c, i| {
        std.debug.print("c:{c},i:{}\n", .{ c, i });
    } else {
        std.debug.print("end=======", .{});
    }
}

test "TODO::实现格式化Arg:" {}
