const std = @import("std");
test "struct:" {
    // 构造Struct ======================
    const fields: []const std.builtin.Type.StructField = &.{
        .{
            .name = "name",
            .type = []const u8,
            .is_comptime = false,
            .alignment = @alignOf([]const u8),
            .default_value = null,
        },
    };

    const MyStruct = @Type(.{ .Struct = .{
        .layout = std.builtin.Type.ContainerLayout.auto,
        .decls = &.{},
        .fields = fields[0..fields.len],
        .is_tuple = false,
    } });

    const my_fields = std.meta.fields(MyStruct);
    std.debug.print("@TypeOf(my_fields):{any}\n", .{@TypeOf(my_fields)});
    // @TypeOf(my_fields):[]const builtin.Type.StructField

    std.debug.print("my_fields:{any}\n", .{my_fields[0]});
    // my_fields:builtin.Type.StructField{
    //      .name = { 110, 97, 109, 101 },
    //      .type = []const u8,
    //      .default_value = null,
    //      .is_comptime = false,
    //      .alignment = 8
    // }

    var my_struct = MyStruct{ .name = "xxxx" };
    std.debug.print("@TypeOf(my_fields):{any}\n", .{@TypeOf(my_struct)}); // @TypeOf(my_fields):type.test.@Type.MyStruct

    std.debug.print("my_struct.name:{s}\n", .{my_struct.name}); // xxxx
    @field(my_struct, "name") = "ccccccc";
    std.debug.print("my_struct.name:{s}\n", .{my_struct.name}); // xxxx

}

test "struct pointer:" {
    const V = struct {
        name: []const u8,
    };

    const dest = try std.testing.allocator.create(V);
    defer std.testing.allocator.destroy(dest);

    const child_type = @typeInfo(@TypeOf(dest)).Pointer.child;
    const struct_fields = @typeInfo(child_type).Struct.fields;
    inline for (struct_fields) |field| {
        std.debug.print("name:{s}, field:{any}\n", .{ field.name, field });
        if (std.mem.eql(u8, "name", field.name)) {
            @field(dest, "name") = "zdz";
        }
    }
    std.debug.print("dest:{}\n", .{dest.*});
}
