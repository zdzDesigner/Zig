const std = @import("std");
test "@compileError:" {
    comptime {
        @compileError("xxxxx is error! next command not exec"); // 编译时报错
    }

    std.debug.print("i can exec?", .{});
}
