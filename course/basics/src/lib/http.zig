const std = @import("std");
const httpz = @import("httpz");
// const limine = @import("custom_import_limine");

pub fn httpServer() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    var app = try httpz.Server().init(allocator, .{ .port = 9030 });

    app.notFound(notFound);

    var router = app.router();
    router.get("/list", list);

    // try app.listen();
    app.listen() catch {};
    nothing();
}
fn list(_: *httpz.Request, res: *httpz.Response) !void {
    res.status = 200;
    res.body = "list data";
}

fn notFound(_: *httpz.Request, res: *httpz.Response) !void {
    res.status = 404;
    res.body = "not found!";
}

fn nothing() void {
    (try unionerror()) orelse noop();
}
fn unionerror() !?void {}

fn noop() void {}
