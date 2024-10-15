const std = @import("std");
const meta = std.meta;
const mem = std.mem;

pub const Sqler = struct {
    const Self = @This();
    allocator: mem.Allocator,
    t_keys: std.ArrayList([]const u8),

    pub fn init(allocator: mem.Allocator, comptime T: type) !Self {
        return .{
            .allocator = allocator,
            .t_keys = try getTKeys(allocator, T),
        };
    }
    pub fn deinit(self: *Self) void {
        self.t_keys.deinit();
    }

    // table key
    fn getTKeys(allocator: mem.Allocator, comptime T: type) !std.ArrayList([]const u8) {
        var list = std.ArrayList([]const u8).init(allocator);
        const fields = meta.fields(T);
        inline for (fields) |field| {
            std.debug.print("name:{s},type:{}\n", .{ field.name, field.type });
            try list.append(field.name);
        }
        return list;
    }
};
