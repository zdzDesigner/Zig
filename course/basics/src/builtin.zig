const std = @import("std");

test "TypeId:" {
    std.debug.print("direct:{}\n", .{@typeInfo(struct {}) == std.builtin.TypeId.Struct}); // true
}

fn voidFn() void {}
fn noReturnFn() noreturn {}

test "noreturn:" {

    // noreturn
    const NoReturnFn = @typeInfo(@TypeOf(noReturnFn));

    std.debug.print("NoReturnFn:{}\n", .{NoReturnFn});
    std.debug.print("NoReturnFn.Fn.params:{d}\n", .{NoReturnFn.Fn.params.len});
    std.debug.print("NoReturnFn.Fn.return_type.?:{}\n", .{NoReturnFn.Fn.return_type.?}); // noreturn
    std.debug.print("NoReturnFn.Fn.return_type.? == noreturn:{}\n", .{NoReturnFn.Fn.return_type.? == noreturn}); // false

    // void ============
    std.debug.print("VoidFn:Fn.return_type.?:{}\n", .{@typeInfo(@TypeOf(voidFn)).Fn.return_type.?}); // void
}

const MapLam = struct {
    const Self = @This();
    fn call(self: *Self) !void {
        std.debug.print("self", .{self});
    }
    fn call2(self: *const Self) !void {
        std.debug.print("self", .{self});
    }
};

test "params:" {
    const TFirstParam = @typeInfo(@TypeOf(MapLam.call)).Fn.params[0].type.?;
    std.debug.print("call params[0].type.?:{}\n", .{TFirstParam == *MapLam}); // true

    // const
    std.debug.print("call2 params[0].type.?:{}\n", .{@typeInfo(@TypeOf(MapLam.call2)).Fn.params[0].type.? == *const MapLam}); // true
}
