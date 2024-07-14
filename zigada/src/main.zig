const std = @import("std");
const ada = @import("zigada");

pub fn main() !void {
    var url = try ada.Url.init("http://www.baidu.com/xxx");
    std.debug.print("url:{any}\n", .{url.url.?});
    std.debug.print("origin:{s}\n", .{url.getOrigin()});
    std.debug.print("href:{s}\n", .{url.getHref()});
    std.debug.print("protocol:{s}\n", .{url.getProtocol()});
    std.debug.print("port:{s}\n", .{url.getPort()});

    if (!url.setPort("8080")) return;
    std.debug.print("port:{s}\n", .{url.getPort()});
    std.debug.print("href:{s}\n", .{url.getHref()});
    url.deinit();
}
