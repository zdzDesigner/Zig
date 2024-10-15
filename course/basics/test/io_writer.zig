const std = @import("std");

pub fn main() !void {
    const devnull = try std.fs.openFileAbsolute("/dev/null", .{ .mode = .write_only });
    var timer = try std.time.Timer.start();
    {
        // Write 1MiB to /dev/null, one byte at a time, using std.io.BufferedWriter
        var bufw = std.io.bufferedWriter(devnull.writer());
        const w = bufw.writer();
        for (0..1 << 20) |i| {
            try w.writeByte(@truncate(i));
        }
        try bufw.flush();

        std.debug.print("BufferedWriter: {}\n", .{std.fmt.fmtDuration(timer.read())});
    }

    {
        timer.reset();
        // Write 1MiB to /dev/null, one byte at a time, using a custom buffering solution
        var buf: [4096]u8 = undefined;
        var idx: usize = 0;
        const w = devnull.writer();
        for (0..1 << 20) |i| {
            buf[idx] = @truncate(i);
            idx += 1;

            if (idx >= buf.len) {
                try w.writeAll(&buf);
                idx = 0;
            }
        }
        try w.writeAll(buf[0..idx]);

        std.debug.print("Custom buffering: {}\n", .{std.fmt.fmtDuration(timer.read())});
    }
}
