const std = @import("std");
const unicode = std.unicode;

fn codePointInfo(str: []const u8) !void {
    std.debug.print("Code points for: {s} \n", .{str});

    var iter = (try unicode.Utf8View.init(str)).iterator();

    while (iter.nextCodepoint()) |cp| {
        std.debug.print("0x{x} is {u} \n", .{ cp, cp });
    }
}

test "Utf8View:" {
    try codePointInfo("é");
    try codePointInfo("\u{65}\u{301}");
}

test "leng:" {
    const str = "a\u{5360}b";
    std.debug.print("str::len:{}\n", .{str.len}); // 5
    // const len = try std.unicode.utf8ByteSequenceLength("\u{5360}");
    // std.debug.print("len:{}\n", .{len});
}
