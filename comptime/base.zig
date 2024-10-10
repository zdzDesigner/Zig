const std = @import("std");
// export fn foo() void {}

fn bar() void {
    _ = add(2, 3);
    // @compileLog(comptime isExclude(IgnoreDir, "fooFn")); // true
    // @compileLog(comptime isExclude(IgnoreDir, "sss")); //false
    _ = comptime isExcludeComptime(IgnoreDir, "fooFn");
    // @compileLog(comptime isExcludeComptime(IgnoreDir, "fooFn")); // true
    // @compileLog(comptime isExcludeComptime(IgnoreDir, "sss")); // false
}

fn isExcludeComptime(comptime I: type, comptime method: []const u8) bool {
    return comptime blk: {
        if (@hasDecl(I, "excludes")) {
            for (@field(I, "excludes")) |name| {
                if (method.len == name.len) break :blk true;
            }
        }
        break :blk false;
    };
}
fn isExclude(I: type, method: []const u8) bool {
    return blk: {
        if (@hasDecl(I, "excludes")) {
            for (@field(I, "excludes")) |name| {
                if (method.len == name.len) break :blk true;
            }
        }
        break :blk false;
    };
}

fn add(a: u8, b: u8) u8 {
    return a + b;
}
const IgnoreDir = struct {
    const excludes = .{"fooFn"};
};
// test "@compileLog::" {
//     _ = bar();
// }

pub fn main() !void {
    _ = bar();
    std.debug.print("xxxxxxx", .{});
}
