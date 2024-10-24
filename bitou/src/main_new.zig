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

    var gpa = heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    // var arena = std.heap.ArenaAllocator.init(allocator);
    // defer arena.deinit(); // 统一释放, 无需单个释放

    // var client = try db.init(allocator);
    // defer client.deinit();
    // try db.selectSql(allocator, &client);

    // _ = try db.init(allocator);
    // try db.select(allocator);

    // std.debug.print("gpa.detectLeaks:{}\n", .{gpa.detectLeaks()});

    // while (true) {}

    const win = webui.newWindow();
    std.debug.print("win:{any}\n", .{win});
    const router = try route.bind(allocator, win);
    defer router.deinit();
    std.debug.print("router:{}\n", .{router});

    // if (!win.setRootFolder("assets")) return; // 发布
    // if (!win.setRootFolder("test/web")) return; // web unit测试
    if (!win.setRootFolder("/home/zdz/Documents/Try/SVG/bitou/dist")) return; // web 开发
    // if (!win.setRootFolder("/home/zdz/Documents/Try/Svg/badnib/client/dist")) return; // P1 测试

    win.setFileHandler(fileHook);

    std.debug.print("getBestBrowser:{}\n", .{win.getBestBrowser()});

    // 内部打开 ========================================
    // const ok = win.show("index.html"); // 无浏览器更新提示
    // const ok = win.showBrowser("index.html", .Chrome);
    // const ok = win.showBrowser("index.html", .Firefox);
    // const ok = win.showBrowser("index.html", .WebView);
    // const ok = win.showBrowser("index.html", .NoBrowser); // 无窗口
    // const ok = win.startServer("index.html"); // 无窗口
    // webui.openUrl(ok.ptr[0..ok.len :0]);
    const ok = win.startServer("http://localhost:10001/"); // 启动服务
    webui.openUrl(try std.fmt.allocPrintZ(allocator, "{s}/index.html", .{ok}));
    std.debug.print("show ok:{any}\n", .{ok});
    // -------------------------------------------------

    // test ======================================================================
    // if (router.match("/stage")) |handle| {
    //     try handle(.{ .allocator = allocator, .evt = null });
    // }
    // end ======================================================================

    webui.wait();
    webui.clean();
}

fn receive(evt: webui.Event) void {
    const key = evt.element;
    const val = evt.getString();
    std.debug.print("key:{s},val:{s}\n", .{ key, val });
    evt.returnString("xxxxx");

    // =====================
    // var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    // defer _ = gpa.deinit();
    // const allocator = gpa.allocator();
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
