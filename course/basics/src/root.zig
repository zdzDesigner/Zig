const root = @import("root");
const std = @import("std");

const V = struct {};

pub fn main() !void {
    std.debug.print("root type:{}\n", .{@typeInfo(root)});
    // root type:builtin.Type{
    //     .Struct = builtin.Type.Struct{
    //         .layout = builtin.Type.ContainerLayout.auto,
    //         .backing_integer = null,
    //         .fields = {  },
    //         .decls = { builtin.Type.Declaration{ ... } },
    //         .is_tuple = false
    //      }
    // }
    std.debug.print("root:{any}\n", .{root.V});
    // root:root.V

    std.debug.print("hasDecl root.V:{}\n", .{@hasDecl(root, "V")}); // true

    std.debug.print("hasDecl root.main:{}\n", .{@hasDecl(root, "main")}); // true
}
