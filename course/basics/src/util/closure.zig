const std = @import("std");
const mem = std.mem;

// /Try/Zig/zig-pro/bitou/src/route/manager.zig

const Context = struct {
    allocator: mem.Allocator,
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
            fn f() void {
                handle(.{ .allocator = allocator });
            }
        };
        call.allocator = self.allocator;
        emit.listen("message", call.f);
    }
};

const emit = struct {
    fn listen(name: []const u8, handle: fn (payload: u8) void) !void {
        std.debug.print("name:{}\n", .{name});
        std.debug.print("handle:{}\n", .{handle});
    }
};
