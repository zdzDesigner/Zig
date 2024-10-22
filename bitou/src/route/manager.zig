const std = @import("std");
const webui = @import("webui");
const myzql = @import("myzql");
const mem = std.mem;
const heap = std.heap;
const json = std.json;

// 上下文
pub const Context = struct {
    const Self = @This();
    allocator: mem.Allocator,
    evt: ?webui.Event,
    // arena: ?heap.ArenaAllocator = null,

    var arena: heap.ArenaAllocator = undefined;
    pub fn init(allocator: mem.Allocator, evt: webui.Event) Context {
        arena = heap.ArenaAllocator.init(allocator);
        return .{
            .allocator = allocator,
            .evt = evt,
            // .arena = arena,
            // .arena = heap.ArenaAllocator.init(allocator),
        };
    }
    pub fn deinit(_: *const Self) void {
        arena.deinit();
    }
    pub fn getPath(self: *const Self) ?[]u8 {
        return self.evt.?.element;
    }
    pub fn getData(self: *const Self, comptime T: type) !?json.Parsed(T) {
        if (self.evt) |evt| {
            std.debug.print("==path==:{s}\n", .{evt.element});
            std.debug.print("==data==:{s}\n", .{evt.getString()});
            return try json.parseFromSlice(T, self.allocator, evt.getString(), .{});
            // return try json.parseFromSlice(T, arena.allocator(), evt.getString(), .{});
            // self.data = try json.parseFromSlice(T, self.allocator, evt.getString(), .{});
            // return self.data;
        }
        return null;
    }
};
// const ErrorRoute = error{};
const Handle = fn (Context) anyerror!void;
// const Handle = *const fn (Context) anyerror!void;

// 路由
pub const Router = struct {
    path: []const u8,
    handle: *const Handle,
    pub fn init(path: []const u8, handle: *const Handle) Router {
        return .{
            .path = path,
            .handle = handle,
        };
    }
};

pub const ManageRouter = struct {
    const Self = @This();
    allocator: mem.Allocator,
    win: webui,
    routes: std.ArrayList(Router),

    pub fn init(allocator: mem.Allocator, win: webui) ManageRouter {
        return .{
            .allocator = allocator,
            .win = win,
            .routes = std.ArrayList(Router).init(allocator),
        };
    }

    pub fn deinit(self: Self) void {
        self.routes.deinit();
    }

    // 添加路由
    pub fn get(self: *Self, path: [:0]const u8, handle: Handle) !void {
        try self.method("get", path, handle);
    }
    pub fn post(self: *Self, path: [:0]const u8, handle: Handle) !void {
        try self.method("post", path, handle);
    }
    pub fn put(self: *Self, path: [:0]const u8, handle: Handle) !void {
        try self.method("put", path, handle);
    }
    pub fn delete(self: *Self, path: [:0]const u8, handle: Handle) !void {
        try self.method("delete", path, handle);
    }
    pub fn method(self: *Self, comptime method_name: []const u8, path: [:0]const u8, handle: Handle) !void {
        const all_path = try std.fmt.allocPrintZ(self.allocator, "/{s}{s}", .{ method_name, path });
        defer self.allocator.free(all_path);
        try self.use(all_path, handle);
    }
    pub fn use(self: *Self, path: [:0]const u8, handle: Handle) !void {
        const call = struct {
            var allocator: mem.Allocator = undefined;
            var dbcli: *myzql.conn.Conn = undefined;
            fn f(evt: webui.Event) void {
                // return handle(.{ .evt = evt, .allocator = allocator }) catch unreachable;
                return handle(Context.init(allocator, evt)) catch unreachable;
            }
        };
        call.allocator = self.allocator;
        _ = self.win.bind(path, call.f);
        try self.routes.append(Router.init(path, handle));
    }

    pub fn match(self: Self, path: []const u8) ?*const Handle {
        var last = self.routes.items.len;
        while (last > 0) : (last -= 1) {
            const router = self.routes.items[last - 1];
            if (mem.eql(u8, path, router.path)) {
                return router.handle;
            }
        }
        return null;
    }
};
// pub fn createRoute() Router {}
