const std = @import("std");

fn StructTypeMin(comptime T: type, keys: []const []const u8) type {
    const fields = std.meta.fields(T);
    var fields_new: [keys.len]std.builtin.Type.StructField = undefined;
    inline for (fields) |field| {
        inline for (keys, 0..) |key, i| {
            if (std.mem.eql(u8, key, field.name)) {
                fields_new[i] = .{
                    .name = field.name,
                    .type = field.type,
                    .alignment = @alignOf(field.type),
                    .is_comptime = false,
                    .default_value = null,
                };
            }
        }
    }
    return @Type(.{
        .Struct = .{
            .fields = fields_new[0..],
            .decls = &.{},
            .layout = std.builtin.Type.ContainerLayout.auto,
            .is_tuple = false,
        },
    });
}

fn structTypeMix(allocator: std.mem.Allocator, comptime T: type, val: anytype) !T {
    const fields = std.meta.fields(@TypeOf(val));
    var instance = std.mem.zeroes(T);
    inline for (fields) |field| {
        std.debug.print("field.type:{}\n", .{field.type});
        if (field.type == []const u8) {
            @field(instance, field.name) = try allocator.dupe(u8, @field(val, field.name));
        } else {
            @field(instance, field.name) = @field(val, field.name);
        }
    }
    return instance;
}
fn free(allocator: std.mem.Allocator, val: anytype) void {
    const fields = std.meta.fields(@TypeOf(val));
    inline for (fields) |field| {
        if (field.type == []const u8) {
            allocator.free(@field(val, field.name));
        }
    }
}
