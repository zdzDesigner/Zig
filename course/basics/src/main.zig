const std = @import("std");
const expect = std.testing.expect;
const deferLogic = @import("./defer.zig");
const pointerLogic = @import("./pointer.zig");
const structLogic = @import("./struct.zig");
const stringLogic = @import("./string.zig");
const bulidinLogic = @import("./buildin.zig");
const slice = @import("./slice.zig");
const forLogic = @import("./for.zig");
const typeLogic = @import("./type.zig");
const enumLogic = @import("./enum.zig");
const comptimeLogic = @import("./comptime.zig");
const whileLogic = @import("./while.zig");
const unionLogic = @import("./union.zig");
const optionalLogic = @import("./optional.zig");
const errorLogic = @import("./error.zig");
const heapLogic = @import("./heap.zig");
const httpLogic = @import("./lib/http.zig");

pub fn main() !void {
    // std.log.info("undefined:{}", .{undefined});
    // error: unable to format type "@TypeOf(undefined)"
    //
    const maxage = undefined;
    std.log.info("{}", .{@TypeOf(maxage)});
    const memory: u32 = undefined;
    std.log.info("{}", .{@TypeOf(memory)});
    //
    const deferRet = deferLogic.deferReturn();
    std.log.info("defer ret: {d}", .{deferRet});
    std.log.info("defer pointer ret:{}", .{deferLogic.deferReturnPointer()});

    // std.time.sleep(10000); // ? 怎么用

    const AllocationError = error{ xx, bb }; // 枚举
    const mybe_error: AllocationError!u8 = 3;
    std.log.info("mybe_error type: {}", .{@TypeOf(mybe_error)}); // error{xx}!u8
    std.log.info("error type:{}", .{@TypeOf(error{xx})}); // error type:type
    std.log.info("{}", .{@TypeOf(error.xx)}); // error{xx}
    std.log.info("{}", .{@intFromError(error.xx)}); // info: 11
    std.log.info("{}", .{@intFromError(error.bb)}); // info: 12
    std.log.info("{}", .{@intFromPtr(&mybe_error)});

    std.log.info("{}", .{error.xx}); // error.xx
    std.log.info("{}", .{error.xx == error.xx}); // true

    pointerLogic.logic();
    slice.logic();
    structLogic.logic();
    stringLogic.logic();
    // bulidinLogic.conv();
    forLogic.logic();
    typeLogic.logic();
    enumLogic.localEnum();
    comptimeLogic.logic();
    whileLogic.logic();
    unionLogic.logic();
    optionalLogic.logic();
    errorLogic.logic();
    heapLogic.logic();
    try httpLogic.httpServer();
}

// 导入测试
// test {
//     _ = @import("./error.zig");
// }
comptime {
    _ = @import("./base.zig");
    _ = @import("./defer.zig");
    _ = @import("./error.zig");
    _ = @import("./switch.zig");
    // _ = @import("./safe.zig");
    _ = @import("./optimize.zig");
    _ = @import("./pointer.zig");
    _ = @import("./enum.zig");
    _ = @import("./struct.zig");
    _ = @import("./union.zig");
    _ = @import("./string.zig");
}
