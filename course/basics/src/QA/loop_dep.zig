const std = @import("std");
const expect = std.testing.expect;
const StructInner = extern struct {
    outer: StructOuter = std.mem.zeroes(StructOuter),
};

const StructMiddle = extern struct {
    outer: ?*StructInner,
    inner: ?*StructOuter,
};

const StructOuter = extern struct {
    middle: StructMiddle = std.mem.zeroes(StructMiddle),
};

test "circular dependency through pointer field of a struct" {
    const outer: StructOuter = .{};
    try expect(outer.middle.outer == null);
    try expect(outer.middle.inner == null);
}
