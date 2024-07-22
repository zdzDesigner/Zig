const std = @import("std");
const webui = @import("webui");
const mem = std.mem;

// 上下文
pub const Context = struct {
    allocator: mem.Allocator,
    evt: webui.Event,
};
const Handle = fn (Context) void;

// 路由
pub const Router = struct {
    path: []const u8,
    // pub fn init(path: []const u8) Router {
    //     return .{
    //         .path = path,
    //     };
    // }
    handle: *const Handle,
    pub fn init(path: []const u8, handle: Handle) Router {
        return .{
            .path = path,
            .handle = handle,
        };
    }
};

// 路由管理
// pub fn ManageRouter(comptime T: type) type {
//     return struct {
//         const Self = @This();
//         routes: std.ArrayList(T),
//         // allocator: mem.Allocator,
//
//         pub fn init(allocator: mem.Allocator) Self {
//             return .{
//                 .routes = std.ArrayList(T).init(allocator),
//                 .allocator = allocator,
//             };
//         }
//
//         // 添加路由
//         pub fn use(self: *Self, path: []const u8, handle: Handle) !void {
//             try self.routes.append(Router.init(path, handle));
//         }
//
//         pub fn match(self: Self, path: []const u8) ?void {
//             // self.routes.items
//             var last = self.routes.items.len;
//             while (last > 0) : (last -= 1) {
//                 const router = self.routes.items[last - 1];
//                 if (mem.eql(u8, path, router.path)) |reqpath| {
//                     std.debug.print("reqpath:{s}\n", .{reqpath});
//                 }
//             }
//         }
//     };
// }
// pub const ManageRouter = struct {
//     var routes: std.ArrayList(Router) = undefined;
//     var allocator: mem.Allocator = undefined;
//
//     pub fn init(ally: mem.Allocator) void {
//         allocator = ally;
//         routes = std.ArrayList(Router).init(allocator);
//     }
//
//     // 添加路由
//     pub fn use(path: []const u8, handle: Handle) !void {
//         try routes.append(Router.init(path, handle));
//     }
//
//     pub fn match(path: []const u8) ?void {
//         // self.routes.items
//         var last = routes.items.len;
//         while (last > 0) : (last -= 1) {
//             const router = routes.items[last - 1];
//             if (mem.eql(u8, path, router.path)) |reqpath| {
//                 std.debug.print("reqpath:{s}\n", .{reqpath});
//             }
//         }
//     }
// };
pub const ManageRouter = struct {
    allocator: mem.Allocator,
    routes: std.ArrayList(Router),

    const Self = @This();

    pub fn init(allocator: mem.Allocator) ManageRouter {
        return .{
            .allocator = allocator,
            .routes = std.ArrayList(Router).init(allocator),
        };
    }

    // 添加路由
    pub fn use(self: *Self, path: [:0]const u8, handle: Handle) !void {
        try self.routes.append(Router.init(path, handle));
    }

    pub fn match(self: Self, path: []const u8) ?void {
        // self.routes.items
        var last = self.routes.items.len;
        while (last > 0) : (last -= 1) {
            const router = self.routes.items[last - 1];
            if (mem.eql(u8, path, router.path)) |reqpath| {
                std.debug.print("reqpath:{s}\n", .{reqpath});
            }
        }
    }
};
// pub const ManageRouter = struct {
//     allocator: mem.Allocator,
//     win: webui,
//     routes: std.ArrayList(Router),
//
//     const Self = @This();
//
//     pub fn init(allocator: mem.Allocator, win: webui) ManageRouter {
//         return .{
//             .allocator = allocator,
//             .win = win,
//             .routes = std.ArrayList(Router).init(allocator),
//         };
//     }
//
//     // 添加路由
//     pub fn use(self: *Self, path: [:0]const u8, handle: Handle) !void {
//         _ = self.win.bind(path, struct {
//             fn f(evt: webui.Event) void {
//                 return handle(.{
//                     .evt = evt,
//                     .allocator = self.allocator,
//                 });
//             }
//         }.f);
//         try self.routes.append(Router.init(path, handle));
//     }
//
//     pub fn match(self: Self, path: []const u8) ?void {
//         // self.routes.items
//         var last = self.routes.items.len;
//         while (last > 0) : (last -= 1) {
//             const router = self.routes.items[last - 1];
//             if (mem.eql(u8, path, router.path)) |reqpath| {
//                 std.debug.print("reqpath:{s}\n", .{reqpath});
//             }
//         }
//     }
// };
// pub fn createRoute() Router {}
