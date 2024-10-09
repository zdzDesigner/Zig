export fn foo() void {}

export fn bar() bool {
    _ = isExclude(IgnoreDir, "sss");
    _ = add(2, 3);
    return isExcludeComptime(IgnoreDir, "sss");
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

export fn add(a: u8, b: u8) u8 {
    return a + b;
}
const IgnoreDir = struct {};
