const std = @import("std");
// pub const GlobalLinkage = enum {
//     internal,
//     strong,
//     weak,
//     link_once,
// };
// pub const SymbolVisibility = enum {
//     default,
//     hidden,
//     protected,
// };
//
// pub const ExportOptions = struct {
//     name: []const u8,
//     linkage: GlobalLinkage = .strong,
//     section: ?[]const u8 = null,
//     visibility: SymbolVisibility = .default,
// };

// @export(declaration, comptime options: std.builtin.ExportOptions) void

comptime {
    // 重定义符号
    @export(internalName, .{ .name = "fooxx", .linkage = .strong });
}

fn internalName() callconv(.C) void {}
export fn internalName_alias() callconv(.C) void {}

export fn vvv() void {}
export fn @"A function name that is a complete sentence."() void {}
