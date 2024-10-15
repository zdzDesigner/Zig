extern fn file_write(u64, *const u64) void;

pub fn main() void {
    {
        var s: struct {
            x: u64 = 0,
            y: u64 = 0,
        } = .{};

        for (0..8192) |_| {
            s.x += 1;
            if (s.x % 16 == 0)
                file_write(s.x, &s.y);
        }
    }
    {
        var x: u64 = 0;
        var y: u64 = 0;

        for (0..8192) |_| {
            x += 1;
            if (x % 16 == 0)
                file_write(x, &y);
        }
    }
}
