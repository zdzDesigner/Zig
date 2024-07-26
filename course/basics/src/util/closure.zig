const std = @import("std");
const mem = std.mem;

// /Try/Zig/zig-pro/bitou/src/route/manager.zig

const Context = struct {
    allocator: mem.Allocator,
    payload: []const u8,
    // .....
};

const Tv = struct {
    allocator: mem.Allocator,

    fn init(allocator: mem.Allocator) Tv {
        return .{ .allocator = allocator };
    }

    fn use(self: *Tv, handle: fn (Context) void) !void {
        const call = struct {
            var allocator: mem.Allocator = undefined;
            fn f(payload: []const u8) void {
                handle(.{ .allocator = allocator, .payload = payload });
            }
        };
        call.allocator = self.allocator;
        emit.listen("message", call.f);
    }
};

const emit = struct {
    fn listen(name: []const u8, handle: fn (payload: []const u8) void) !void {
        std.debug.print("name:{}\n", .{name});
        std.debug.print("handle:{}\n", .{handle});
    }
};
