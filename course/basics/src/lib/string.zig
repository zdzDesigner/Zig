const std = @import("std");
inline fn isSpace(v: u8) bool {
    return v == 32;
}

pub fn trim(str: []const u8) ?[]const u8 {
    var head: usize = 0;
    var ishead = false;
    var tail: usize = 0;
    var istail = false;

    const str_len = str.len;
    const mid_len = str_len / 2;
    for (0..str_len) |index| {
        if (!ishead and !isSpace(str[index])) {
            head = index;
            ishead = true;
        }

        if (!istail and !isSpace(str[(str_len - 1) - index])) {
            tail = str_len - index;
            istail = true;
        }
        if (index > mid_len) break;
    }

    if (head >= tail) return null;

    // std.debug.print("head:{d},tail:{d},ret:{s},ret:{d}\n", .{ head, tail, str[head..tail], str[head..tail].len });
    return str[head..tail];
}

test "test trim" {
    try std.testing.expect(isSpace(' '));
    try std.testing.expect(trim(" ") == null);
    try std.testing.expect(trim("  ") == null);
    try std.testing.expect(std.mem.eql(u8, trim("   abc   ").?, "abc"));
}
