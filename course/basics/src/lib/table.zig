const std = @import("std");

pub const String = []const u8;
pub fn Row(comptime num: usize) type {
    return [num]String;
}

// 分割符
pub const Separator = struct {
    pub const Mode = enum {
        ascii,
        box,
        dos,
    };

    const mode_dos = 2;

    const box = [_][4]String{
        .{ "┌", "─", "┬", "┐" },
        .{ "│", "─", "│", "│" },
        .{ "├", "─", "┼", "┤" },
        .{ "└", "─", "┴", "┘" },
    };

    const ascii = [_][4]String{
        .{ "+", "-", "+", "+" },
        .{ "|", "-", "|", "|" },
        .{ "+", "-", "+", "+" },
        .{ "+", "-", "+", "+" },
    };

    const dos = [_][4]String{
        .{ "╔", "═", "╦", "╗" },
        .{ "║", "═", "║", "║" },
        .{ "╠", "═", "╬", "╣" },
        .{ "╚", "═", "╩", "╝" },
    };

    const Position = enum { First, Text, Sep, Last };
    fn get(mode: Mode, row_pos: Position, col_pos: Position) []const u8 {
        const sep_table = switch (mode) {
            .ascii => ascii,
            .box => box,
            .dos => dos,
        };

        return sep_table[@intFromEnum(row_pos)][@intFromEnum(col_pos)];
    }
};

pub fn Table(comptime len: usize) type {
    return struct {
        header: ?Row(len) = null,
        footer: ?Row(len) = null,
        rows: []const Row(len),
        // []const [len][]const u8
        mode: Separator.Mode = .ascii, // 根据左侧类型自动推导 省去 Separator.Mode.ascii
        padding: usize = 0,

        const Self = @This();

        // 定界符
        fn writeRowDelimiter(self: Self, writer: anytype, row_pos: Separator.Position, col_lens: [len]usize) !void {
            inline for (0..len, col_lens) |col_idx, max_len| {
                const first_col = col_idx == 0;
                if (first_col) {
                    try writer.writeAll(Separator.get(self.mode, row_pos, .First));
                } else {
                    try writer.writeAll(Separator.get(self.mode, row_pos, .Sep));
                }

                for (0..max_len) |_| {
                    try writer.writeAll(Separator.get(self.mode, row_pos, .Text));
                }
            }

            try writer.writeAll(Separator.get(self.mode, row_pos, .Last));
            try writer.writeAll("\n");
        }

        fn writeRow(
            self: Self,
            writer: anytype,
            row: []const String,
            col_lens: [len]usize,
        ) !void {
            const m = self.mode;
            for (row, col_lens, 0..) |column, col_len, col_idx| {
                const first_col = col_idx == 0;
                if (first_col) {
                    try writer.writeAll(Separator.get(m, .Text, .First));
                } else {
                    try writer.writeAll(Separator.get(m, .Text, .Sep));
                }

                try writer.writeAll(column);

                const left: usize = col_len - column.len;
                for (0..left) |_| {
                    try writer.writeAll(" ");
                }
            }
            try writer.writeAll(Separator.get(m, .Text, .Last));
            try writer.writeAll("\n");
        }

        // 计算列长度
        fn calculateColumnLens(self: Self) [len]usize {
            var lens = std.mem.zeroes([len]usize);
            if (self.header) |header| {
                for (header, &lens) |column, *n| {
                    n.* = column.len;
                }
            }

            for (self.rows) |row| {
                for (row, &lens) |col, *n| {
                    n.* = @max(col.len, n.*);
                }
            }

            if (self.footer) |footer| {
                for (footer, &lens) |col, *n| {
                    n.* = @max(col.len, n.*);
                }
            }

            for (&lens) |*n| {
                n.* += self.padding;
            }
            return lens;
        }

        pub fn format(
            self: Self,
            comptime fmt: String,
            options: std.fmt.FormatOptions,
            writer: anytype,
        ) !void {
            _ = options;
            _ = fmt;

            const column_lens = self.calculateColumnLens();

            try self.writeRowDelimiter(writer, .First, column_lens);
            if (self.header) |header| {
                try self.writeRow(
                    writer,
                    &header,
                    column_lens,
                );
            }

            try self.writeRowDelimiter(writer, .Sep, column_lens);
            for (self.rows) |row| {
                try self.writeRow(writer, &row, column_lens);
            }

            if (self.footer) |footer| {
                try self.writeRowDelimiter(writer, .Sep, column_lens);
                try self.writeRow(writer, &footer, column_lens);
            }

            try self.writeRowDelimiter(writer, .Last, column_lens);
        }
    };
}

test "normal usage" {
    const t = Table(2){
        // .mode = Separator.Mode.dos,
        // .mode = @enumFromInt(Separator.mode_dos),
        .header = [_]String{ "Version", "Date" },
        .rows = &[_][2]String{
            .{ "0.7.1", "2020-12-13" },
            .{ "0.7.0", "2020-11-08" },
            .{ "0.6.0", "2020-04-13" },
            .{ "0.5.0", "2019-09-30" },
        },
        .footer = null,
    };

    var out = std.ArrayList(u8).init(std.testing.allocator);
    defer out.deinit();
    try out.writer().print("{}", .{t});

    try std.testing.expectEqualStrings(
        \\+-------+----------+
        \\|Version|Date      |
        \\+-------+----------+
        \\|0.7.1  |2020-12-13|
        \\|0.7.0  |2020-11-08|
        \\|0.6.0  |2020-04-13|
        \\|0.5.0  |2019-09-30|
        \\+-------+----------+
        \\
    , out.items);
}

test "footer usage" {
    const t = Table(3){
        .header = [_]String{ "Language", "Files", "xx" },
        .rows = &[_][3]String{
            .{ "Zig", "3", "xx" },
            .{ "Python", "2", "xx" },
        },
        .footer = [3]String{ "Total", "5", "xx" },
    };

    var out = std.ArrayList(u8).init(std.testing.allocator);
    defer out.deinit();
    try out.writer().print("{}", .{t});

    try std.testing.expectEqualStrings(
        \\+--------+-----+--+
        \\|Language|Files|xx|
        \\+--------+-----+--+
        \\|Zig     |3    |xx|
        \\|Python  |2    |xx|
        \\+--------+-----+--+
        \\|Total   |5    |xx|
        \\+--------+-----+--+
        \\
    , out.items);
}
