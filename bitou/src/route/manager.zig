const std = @import("std");
const webui = @import("webui");
const myzql = @import("myzql");
const mem = std.mem;

// 上下文
pub const Context = struct {
    allocator: mem.Allocator,
    dbcli: *myzql.conn.Conn,
    evt: ?webui.Event,
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
    dbcli: *myzql.conn.Conn,
    routes: std.ArrayList(Router),

    pub fn init(allocator: mem.Allocator, win: webui, dbcli: *myzql.conn.Conn) ManageRouter {
        return .{
            .allocator = allocator,
            .win = win,
            .dbcli = dbcli,
            .routes = std.ArrayList(Router).init(allocator),
        };
    }

    pub fn deinit(self: Self) void {
        self.routes.deinit();
    }

    // 添加路由
    pub fn use(self: *Self, path: [:0]const u8, handle: Handle) !void {
        const call = struct {
            var allocator: mem.Allocator = undefined;
            var dbcli: *myzql.conn.Conn = undefined;
            fn f(evt: webui.Event) void {
                return handle(.{ .evt = evt, .allocator = allocator, .dbcli = dbcli }) catch unreachable;
            }
        };
        call.allocator = self.allocator;
        call.dbcli = self.dbcli;
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
