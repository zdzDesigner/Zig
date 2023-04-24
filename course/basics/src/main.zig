const std = @import("std");
const expect = std.testing.expect;
const deferLogic = @import("./defer.zig");
const pointerLogic = @import("./pointer.zig");
const structLogic = @import("./struct.zig");
const stringLogic = @import("./string.zig");

pub fn main() !void {
    // std.log.info("undefined:{}",.{undefined});
    // error: unable to format type "@TypeOf(undefined)"

    const maxage = undefined;
    std.log.info("{}", .{@TypeOf(maxage)});
    const memory: u32 = undefined;
    std.log.info("{}", .{@TypeOf(memory)});

    const deferRet = deferLogic.deferReturn();
    std.log.info("defer ret: {}", .{deferRet});

    const AllocationError = error{OutOfMemory};
    const mybe_error: AllocationError!u8 = 10;
    std.log.info("mybe_error type: {}", .{@TypeOf(mybe_error)}); // error{OutOfMemory}!u8
    std.log.info("{}", .{@TypeOf(error.OutOfMemory)}); // error{OutOfMemory}
    // std.log.info("{}", .{@ptrToInt(&error.OutOfMemory)}); // error.OutOfMemory
    std.log.info("{}", .{error.OutOfMemory}); // error.OutOfMemory
    std.log.info("{}", .{error.OutOfMemory == error.OutOfMemory}); // true

    pointerLogic.size();
    structLogic.access();
    stringLogic.u();
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
