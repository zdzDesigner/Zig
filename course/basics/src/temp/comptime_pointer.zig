const std = @import("std");
const meta = std.meta;

pub fn getTKeys(comptime T: type) []const []const u8 {
    const fields = meta.fields(T);
    var list: [fields.len][]const u8 = undefined;
    inline for (fields, 0..) |field, i| {
        // std.debug.print("name:{s},type:{}\n", .{ field.name, field.type });
        list[i] = field.name;
    }
    return list[0..];
}
