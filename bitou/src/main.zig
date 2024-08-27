const std = @import("std");
const mem = std.mem;
const heap = std.heap;
const Allocator = std.mem.Allocator;
const webui = @import("webui");
const json = @import("json");
const db = @import("./db/mysql/db.zig");
const route = @import("./route/router.zig");

pub fn main() !void {
    // webui.setConfig(webui.Config.folder_monitor, true); // 自动刷新
    // webui.setTimeout(0); // 防止超时 Wait forever (never timeout)
    // webui.setConfig(.multi_client, true);

    var gap = heap.GeneralPurposeAllocator(.{}){};
    defer _ = gap.deinit();
    const allocator = gap.allocator();

    var client = try db.init(allocator);
    defer client.deinit();
    try db.select(&client, allocator);

    while (true) {}

    const win = webui.newWindow();
    std.debug.print("win:{any}\n", .{win});
    const router = try route.bind(allocator, win);
    defer router.deinit();
    std.debug.print("router:{}\n", .{router});

    // if (!win.setRootFolder("assets")) return;
    // if (!win.setRootFolder("/home/zdz/Documents/Try/SVG/bitou/dist")) return;
    if (!win.setRootFolder("/home/zdz/Documents/Try/Svg/badnib/client/dist")) return;

    win.setFileHandler(fileHook);

    std.debug.print("getBestBrowser:{}\n", .{win.getBestBrowser()});

    // 内部打开 ========================================
    const ok = win.showBrowser("index.html", .Chrome);
    // const ok = win.show("http://localhost:8086/");
    // const ok = win.show("http://localhost:10001/");
    std.debug.print("show ok:{}\n", .{ok});
    // -------------------------------------------------

    webui.wait();
    webui.clean();
}

fn receive(evt: webui.Event) void {
    const key = evt.element;
    const val = evt.getString();
    std.debug.print("key:{s},val:{s}\n", .{ key, val });
    evt.returnString("xxxxx");

    // =====================
    // var gap = std.heap.GeneralPurposeAllocator(.{}){};
    // defer _ = gap.deinit();
    // const allocator = gap.allocator();
    // const value = json.parse(val, allocator) catch unreachable;
    // const url = value.get("url");
    // std.debug.print("url:{}\n", .{url});
    // if (url.stringPtr) |request| {
    //     // switch (request) {
    //     // mem.eql(u8, request, "/stage")=> evt.returnString("stage");
    //     // }
    //     if (mem.eql(u8, request, "/stage")) {
    //         evt.returnString("stage");
    //     } else if (mem.eql(u8, request, "/operation/list")) {
    //         evt.returnString("operation/list");
    //     }
    // }
    // std.debug.print("stringPtr:{s}\n", .{url.stringPtr.?});

    // defer value.deinit(allocator);
}

fn close(_: webui.Event) void {
    std.debug.print("Exit.\n", .{});
    webui.exit();
}

fn fileHook(filename: []const u8) ?[]const u8 {
    std.debug.print("filename:{s}\n", .{filename});
    // const ret = "xxx";
    // const dist = webui.malloc(ret.len);
    // mem.copyForwards(u8, dist, ret);
    // std.debug.print("dist:{s}\n", .{dist});
    return null;
}
