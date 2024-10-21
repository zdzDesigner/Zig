const std = @import("std");
const Allocator = std.mem.Allocator;

const Buffer = struct {
    pos: usize,
    data: []u8,
};
pub const Response = struct {
    const Self = @This();
    arena: Allocator,
    buffer: Buffer = Buffer{ .pos = 0, .data = "" },
    pub fn toJSON(self: *Response, value: anytype) !void {
        try std.json.stringify(value, .{}, Writer.init(self));
        self.buffer.data[self.buffer.pos] = 0;
    }
};

// std.io.Writer.
pub const Writer = struct {
    res: *Response,

    pub const Error = Allocator.Error;
    pub const IOWriter = std.io.Writer(Writer, error{OutOfMemory}, Writer.write);

    pub fn init(res: *Response) Writer {
        return .{ .res = res };
    }

    // pub fn truncate(self: Writer, n: usize) void {
    //     const buf = &self.res.buffer;
    //     const pos = buf.pos;
    //     const to_truncate = if (pos > n) n else pos;
    //     buf.pos = pos - to_truncate;
    // }

    pub fn writeByte(self: Writer, b: u8) !void {
        var buf = try self.ensureSpace(1);
        const pos = buf.pos;
        buf.data[pos] = b;
        buf.pos = pos + 1;
    }

    pub fn writeByteNTimes(self: Writer, b: u8, n: usize) !void {
        var buf = try self.ensureSpace(n);
        const pos = buf.pos;
        var data = buf.data;
        for (pos..pos + n) |i| {
            data[i] = b;
        }
        buf.pos = pos + n;
    }
    //
    pub fn writeBytesNTimes(self: Writer, bytes: []const u8, n: usize) !void {
        const l = bytes.len * n;
        var buf = try self.ensureSpace(l);

        var pos = buf.pos;
        var data = buf.data;

        for (0..n) |_| {
            const end_pos = pos + bytes.len;
            @memcpy(data[pos..end_pos], bytes);
            pos = end_pos;
        }
        buf.pos = l;
    }

    pub fn writeAll(self: Writer, data: []const u8) !void {
        var buf = try self.ensureSpace(data.len);
        const pos = buf.pos;
        const end_pos = pos + data.len;
        @memcpy(buf.data[pos..end_pos], data);
        buf.pos = end_pos;
    }

    pub fn write(self: Writer, data: []const u8) Allocator.Error!usize {
        try self.writeAll(data);
        return data.len;
    }

    pub fn print(self: Writer, comptime format: []const u8, args: anytype) Allocator.Error!void {
        return std.fmt.format(self, format, args);
    }

    fn ensureSpace(self: Writer, n: usize) !*Buffer {
        const res = self.res;
        var buf = &res.buffer;
        const pos = buf.pos;
        const required_capacity = pos + n;

        const data = buf.data;
        if (data.len > required_capacity) {
            return buf;
        }

        var new_capacity = data.len;
        while (true) {
            new_capacity +|= new_capacity / 2 + 8;
            if (new_capacity >= required_capacity) break;
        }

        const new = try res.arena.alloc(u8, new_capacity);
        if (pos > 0) {
            @memcpy(new[0..pos], data[0..pos]);
            // reasonable chance that our last allocation was buf, so we
            // might as well try freeing it (ArenaAllocator's free is a noop
            // unless you're frenig the last allocation)
            res.arena.free(data);
        }
        buf.data = new;
        return buf;
    }
};
