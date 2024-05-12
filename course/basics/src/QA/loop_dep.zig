const std = @import("std");
const expect = std.testing.expect;

//////////// pass 3个可以
const StructInner = extern struct {
    outer: StructOuter = std.mem.zeroes(StructOuter),
};

const StructMiddle = extern struct {
    // outer: ?*StructInner,
    inner: ?*StructOuter,
};

const StructOuter = extern struct {
    middle: StructMiddle = std.mem.zeroes(StructMiddle),
};

test "circular dependency through pointer field of a struct" {
    const outer: StructOuter = .{};
    // try expect(outer.middle.outer == null);
    try expect(outer.middle.inner == null);
}
////////////

//////////// pass
const Foo = struct {
    ptr: *[1]Foo,
};

test {
    const x: Foo = undefined;
    _ = x;
}
////////////

//////////// 2个不行
// pub const DeviceCallback = *const fn (*Device) void;
// pub const Device = struct {
//     callback: DeviceCallback,
// };
// test {
//     _ = DeviceCallback;
// }
