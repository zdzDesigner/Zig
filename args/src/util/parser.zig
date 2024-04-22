const std = @import("std");

test "compile var:" {
    const chars = "AAA";
    const lower_chars = blk: {
        var buffer: [chars.len]u8 = undefined;
        break :blk std.ascii.lowerString(&buffer, chars);
    };

    std.debug.print("lower_chars:{s}\n", .{lower_chars});
}

pub const Matcher = *const fn (str: []const u8) ?usize;
pub fn takeAnyOfIgnoreCase(comptime chars: []const u8) Matcher {
    // const lower_chars = blk: {
    //     var buffer: [chars.len]u8 = undefined;
    //     break :blk std.ascii.lowerString(&buffer, chars);
    // };

    return struct {
        const lower_chars = blk: {
            var buffer: [chars.len]u8 = undefined;
            // const ascii_string = std.ascii.lowerString(&buffer, chars);
            _ = std.ascii.lowerString(&buffer, chars);
            const const_buffer = buffer;
            break :blk const_buffer[0..chars.len]; // 变成切片
        };
        fn match(str: []const u8) ?usize {
            for (str, 0..) |c, i| {
                const lc = std.ascii.toLower(c);
                if (std.mem.indexOfScalar(u8, lower_chars, lc) == null) {
                    return i;
                }
            }
            return str.len;
        }
    }.match;
}
test "comptime var:" {
    _ = takeAnyOfIgnoreCase("0123456789ABCDEF"[0..8]);
}
