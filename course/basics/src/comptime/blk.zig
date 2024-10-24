const std = @import("std");
pub const Matcher = *const fn (str: []const u8) ?usize;

pub fn takeAnyOfIgnoreCase(comptime chars: []const u8) Matcher {
    // 1 error =============
    // const lower_chars = comptime blk: {
    //     var buffer: [chars.len]u8 = undefined;
    //     break :blk std.ascii.lowerString(&buffer, chars);
    // };
    // 2 error =============
    // const lower_chars = comptime blk: {
    //     var buffer: [chars.len]u8 = undefined;
    //     // break :blk std.ascii.lowerString(&buffer, chars);
    //     for (chars, 0..) |c, i| {
    //         buffer[i] = std.ascii.toLower(c);
    //         // buffer[i] = c;
    //     }
    //     break :blk &buffer;
    // };

    // 3 正确=============
    // var buffer: [chars.len]u8 = undefined;
    // _ = std.ascii.lowerString(&buffer, chars);
    // const lower_chars = buffer;

    // 4 正确=============
    const lower_chars = comptime blk: {
        var buffer: [chars.len]u8 = undefined;
        _ = std.ascii.lowerString(&buffer, chars);
        break :blk buffer;
    };

    return struct {
        fn match(str: []const u8) ?usize {
            for (str, 0..) |c, i| {
                const lc = std.ascii.toLower(c);
                // 这里需要是常量
                if (std.mem.indexOfScalar(u8, &lower_chars, lc) == null) {
                    return i;
                }
            }
            return str.len;
        }
    }.match;
}
