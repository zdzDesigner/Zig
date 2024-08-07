const std = @import("std");
const webui = @import("webui");
const json = @import("json");
const route = @import("./route/router.zig");
const mem = std.mem;
const heap = std.heap;
const Allocator = std.mem.Allocator;
var allocator: Allocator = undefined;
// router
var router: route.ManageRouter = undefined;

pub fn main() !void {
    // webui.setConfig(webui.Config.folder_monitor, true); // 自动刷新
    // webui.setTimeout(0); // 防止超时 Wait forever (never timeout)
    // webui.setConfig(.multi_client, true);

    var gap = heap.GeneralPurposeAllocator(.{}){};
    defer _ = gap.deinit();
    allocator = gap.allocator();

    const win = webui.newWindow();
    std.debug.print("win:{any}\n", .{win});

    // if (!win.setRootFolder("assets")) return;
    if (!win.setRootFolder("/home/zdz/Documents/Try/SVG/bitou/dist")) return;
    win.setFileHandler(fileHook);

    router = try route.bind(allocator);
    std.debug.print("router:{}\n", .{router});
    // _ = win.bind("message", receive);
    _ = win.bind("/stage", struct {
        fn f(evt: webui.Event) void {
            const key = evt.element;
            std.debug.print("key:{s}\n", .{key});
            const str = std.fmt.allocPrintZ(allocator, "response:{s}", .{key}) catch unreachable;
            defer allocator.free(str);
            evt.returnString(str);
        }
    }.f);
    // _ = win.bind("message", struct {
    //     fn f(evt: webui.Event) void {
    //         std.debug.print("router:{}\n", .{router});
    //         std.debug.print("evt:{}\n", .{evt});
    //         // router.match(path: []const u8)
    //     }
    // }.f);

    std.debug.print("getBestBrowser:{}\n", .{win.getBestBrowser()});
    // std.time.sleep(3000_000_0000);

    // 内部打开 ========================================
    const ok = win.showBrowser("index.html", .Chrome);
    // const ok = win.show("http://localhost:8086/");
    // const ok = win.show("http://localhost:10001/");
    std.debug.print("show ok:{}\n", .{ok});
    // -------------------------------------------------

    // // 浏览器打开=====================================
    // if (win.setPort(10002)) {
    //     webui.openUrl("http://localhost:10002/index.html");
    //     // std.debug.print("getUrl:{s}\n", .{win.getUrl()});
    //     // win.setPublic(true); // 可以用外部浏览器访问
    //     // win.setProxy("http://localhost:8086");
    // }
    // const url = win.startServer("index.html");
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
