const std = @import("std");
const webui = @import("webui");
const json = @import("json");
const route = @import("./route/router.zig");
const mem = std.mem;
const heap = std.heap;
const Allocator = std.mem.Allocator;

pub fn main() !void {
    // webui.setConfig(webui.Config.folder_monitor, true); // 自动刷新
    // webui.setTimeout(0); // 防止超时 Wait forever (never timeout)
    // webui.setConfig(.multi_client, true);

    var gap = heap.GeneralPurposeAllocator(.{}){};
    defer _ = gap.deinit();
    const allocator = gap.allocator();

    const winm = webui.newWindow();
    std.debug.print("winm:{any}\n", .{winm});

    // if (!winm.setRootFolder("assets")) return;
    if (!winm.setRootFolder("/home/zdz/Documents/Try/SVG/bitou/dist")) return;
    winm.setFileHandler(fileHook);

    try route.bind(allocator);
    _ = winm.bind("message", receive);

    std.debug.print("getBestBrowser:{}\n", .{winm.getBestBrowser()});
    // std.time.sleep(3000_000_0000);

    // 内部打开 ========================================
    const ok = winm.showBrowser("index.html", .Chrome);
    // const ok = winm.show("http://localhost:8086/");
    // const ok = winm.show("http://localhost:10001/");
    std.debug.print("show ok:{}\n", .{ok});
    // -------------------------------------------------

    // // 浏览器打开=====================================
    // if (winm.setPort(10002)) {
    //     webui.openUrl("http://localhost:10002/index.html");
    //     // std.debug.print("getUrl:{s}\n", .{winm.getUrl()});
    //     // winm.setPublic(true); // 可以用外部浏览器访问
    //     // winm.setProxy("http://localhost:8086");
    // }
    // const url = winm.startServer("index.html");
    // std.debug.print("url:{s}\n", .{url});
    // // webui.openUrl(@as([*c]const u8, @ptrCast(url.ptr))[0..url.len :0]);
    // // webui.openUrl(url.ptr[0..url.len :0]);
    // // -----------------------------------------------

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
    if (mem.eql(u8, filename, "/stage")) return "stagexxx";
    if (mem.eql(u8, filename, "/operation/list")) return "operation/list/xxxxxxxxxx";
    return null;
}

// pub fn main() !void {
//     var nwin = webui.newWindow();
//     _ = nwin.show("<html><head><script src=\"webui.js\"></script></head> Hello World ! </html>");
//     webui.wait();
// }
