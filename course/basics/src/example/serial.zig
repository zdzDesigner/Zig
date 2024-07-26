const std = @import("std");

test "serial:" {
    const fd = try std.fs.cwd().openFile("/dev/pts/1", .{ .mode = .read_write });
    std.debug.print("fd:{}\n", .{fd});
    defer fd.close();

    const termios = try std.posix.tcgetattr(fd.handle);
    std.debug.print("termios:{}\n", .{termios});
}
