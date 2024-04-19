const std = @import("std");

const Point = struct {
    x: u32,
    y: u32,

    pub var z: u32 = 1;
};
test "print" {
    const stdout = std.io.getStdOut().writer();
    try stdout.print("========\n", .{});
    try stdout.print("{}\n", .{true});
    std.debug.print("{}\n", .{true});

    try std.json.stringify(&Point{ .x = 1, .y = 2 }, .{}, std.io.getStdOut().writer());
}

test "@ describe" {
    const @"cpu.nvic_prio_bits" = "4xx";
    std.debug.print("@:{s}\n", .{@"cpu.nvic_prio_bits"});
}

const Product = struct {
    id: i32,
    title: []const u8,
    description: []const u8,
    images: []const []const u8,

    pub fn format(
        product: Product,
        comptime _: []const u8,
        _: std.fmt.FormatOptions,
        writer: anytype,
    ) !void {
        try writer.writeAll("Product{\n");
        _ = try writer.print("\tid: {},\n", .{product.id});
        _ = try writer.print("\ttitle: {s},\n", .{product.title});
        _ = try writer.print("\tdescription: {s},\n", .{product.description});
        try writer.writeAll("\timages: [\n");

        for (product.images) |image| _ = try writer.print("\t\t{s},\n", .{image});

        try writer.writeAll("\t],\n");
        try writer.writeAll("}\n");
    }
};

// 打印所有属性
const T = struct {
    name: []const u8,
    pub fn format(
        self: @This(),
        comptime _: []const u8,
        _: std.fmt.FormatOptions,
        _: anytype,
    ) !void {
        try std.json.stringify(&self, .{}, std.io.getStdOut().writer());
    }
};
test "format:" {
    const p = Product{
        .id = 1,
        .title = "Zed Plushy",
        .description = "Cool Zed",
        .images = &.{
            "Image 1",
            "Image 2",
            "Image 3",
        },
    };

    // Now you can print with {} format specifier.
    std.debug.print("{}\n", .{p});

    std.debug.print("{}\n", .{T{ .name = "xxx" }});
}
