const std: type = @import("std");
const Type: type = std.builtin.Type;

pub fn Graph(comptime T: type) type {
    if (@typeInfo(T) != .Union)
        @compileError("Invalid Schema");

    return struct {
        nodes: std.ArrayList(Node),
        allocator: std.mem.Allocator,

        pub const Node: type = @Type(.{ .Union = .{
            .decls = &[_]Type.Declaration{},
            .layout = .auto,
            .tag_type = @typeInfo(T).Union.tag_type,
            .fields = blk: {
                var new_fields: [std.meta.fields(T).len]Type.UnionField = undefined;
                for (std.meta.fields(T), 0..) |org_field, i| {
                    const new_struct_fields = [2][1]Type.StructField{
                        .{.{ .alignment = 0, .name = "tag", .type = Tag, .is_comptime = false, .default_value = null }},
                        .{.{ .alignment = 0, .name = "edges", .type = std.ArrayList(Edge), .is_comptime = false, .default_value = null }},
                    };

                    new_fields[i] = Type.UnionField{ .name = org_field.name, .alignment = org_field.alignment, .type = @Type(.{
                        .Struct = .{
                            .layout = .auto,
                            .decls = &[_]Type.Declaration{},
                            .is_tuple = false,
                            .fields = new_struct_fields[0] ++ std.meta.fields(org_field.type) ++ new_struct_fields[1],
                        },
                    }) };
                }

                break :blk &new_fields;
            },
        } });
        pub const Edge: type = struct {
            label: []const u8,
            nodes: []Node,
        };
        const Self: type = @This();

        pub fn init(allocator: std.mem.Allocator) !*Self {
            const self: *Self = try allocator.create(Self);
            self.allocator = allocator;
            self.nodes = std.ArrayList(Node).init(allocator);

            return self;
        }

        pub fn deinit(self: *Self) void {
            self.nodes.deinit();
            self.allocator.destroy(self);
        }

        pub fn addNode(self: *Self, comptime data: T) Tag {
            const tag_name = @tagName(data);
            const tag_value = @field(data, tag_name);
            var node: std.meta.TagPayloadByName(Node, tag_name) = undefined;
            node.tag = Tag.generate();

            const fields = std.meta.fields(@TypeOf(tag_value));
            inline for (fields) |field| {
                @field(node, field.name) = @field(tag_value, field.name);
            }

            self.nodes.append(@unionInit(Node, tag_name, node)) catch unreachable;

            self.sort();
            return node.tag;
        }

        fn sort(self: *Self) void {
            const nodes: []Node = self.nodes.items;
            self.nodes.deinit();

            for (nodes, 0..) |node, i| {
                var min: Node = node;
                var pos: usize = i;

                for (nodes, i..) |nde, j| {
                    const r = Tag.check(@field(nde, @tagName(nde)).tag, @field(nde, @tagName(nde)).tag);
                    if (r == 1) {
                        min = nde;
                        pos = j;
                    }
                }

                nodes[pos] = nodes[i];
                nodes[i] = min;
            }

            self.nodes = std.ArrayList(Node).init(self.allocator);
            self.nodes.appendSlice(nodes);
        }
    };
}

const Union = union(enum) {
    Foo: struct { str: []const u8 },
    Bar: struct { uint: usize },
};

test "Graph: Nodes" {
    const fields = std.meta.fields;
    const node_fields = fields(Graph(Union).Node);
    const union_fields = fields(Union);

    try std.testing.expect(node_fields.len == union_fields.len);
    inline for (fields(node_fields[0].type)) |field| {
        std.debug.print("{s}\n", .{field.name});
    }

    try std.testing.expect(fields(node_fields[0].type).len - 2 == fields(union_fields[0].type).len);
    try std.testing.expect(fields(node_fields[1].type).len - 2 == fields(union_fields[1].type).len);
}

test "Graph: addNode" {
    const graph = try Graph(Union).init(std.testing.allocator);
    defer graph.deinit();

    _ = graph.addNode(.{ .Foo = .{ .str = "edgedb" } });
}

pub const Tag = struct {
    bytes: [16]u8,

    var clock_sequence: u16 = 0;
    var last_timestamp: u64 = 0;

    const encoded_pos = [16]u8{ 1, 3, 5, 6, 9, 11, 13, 14, 17, 19, 21, 22, 25, 26, 28, 30 };
    const hex_to_nibble = [_]u8{0xff} ** 48 ++ [_]u8{
        0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07,
        0x08, 0x09, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0xff,
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0xff,
    } ++ [_]u8{0xff} ** 152;

    pub fn generate() Tag {
        const ts: u64 = @intCast(std.time.milliTimestamp());
        const last = @atomicRmw(u64, &last_timestamp, .Xchg, ts, .monotonic);
        const sequence = if (ts <= last)
            @atomicRmw(u16, &clock_sequence, .Add, 1, .monotonic) + 1
        else
            @atomicLoad(u16, &clock_sequence, .monotonic);

        var bytes: [16]u8 = undefined;
        const ts_buf = std.mem.asBytes(&ts);
        bytes[0] = ts_buf[5];
        bytes[1] = ts_buf[4];
        bytes[2] = ts_buf[3];
        bytes[3] = ts_buf[2];
        bytes[4] = ts_buf[1];
        bytes[5] = ts_buf[0];

        const seq_buf = std.mem.asBytes(&sequence);
        // sequence + version
        bytes[6] = (seq_buf[1] & 0x0f) | 0x70;
        bytes[7] = seq_buf[0];

        std.crypto.random.bytes(bytes[8..]);

        //variant
        bytes[8] = (bytes[8] & 0x3f) | 0x80;

        return .{ .bytes = bytes };
    }

    pub fn parse(hex: []const u8) !Tag {
        var bytes: [16]u8 = undefined;

        if (hex.len != 32 or hex[0] != '#' or hex[8] != '-' or hex[16] != '-' or hex[24] != '-') {
            return error.InvalidTag;
        }

        inline for (encoded_pos, 0..) |i, j| {
            const hi = hex_to_nibble[hex[i + 0]];
            const lo = hex_to_nibble[hex[i + 1]];
            if (hi == 0xff or lo == 0xff) {
                return error.InvalidTag;
            }
            bytes[j] = hi << 4 | lo;
        }
        return .{ .bytes = bytes };
    }

    pub fn eql(self: Tag, other: Tag) bool {
        inline for (self.bytes, other.bytes) |a, b| {
            if (a != b) return false;
        }
        return true;
    }

    pub fn toHex(self: Tag, hex: []u8) void {
        std.debug.assert(hex.len >= 32);
        const alphabet = "0123456789abcdef";

        hex[0] = '#';
        hex[8] = '-';
        hex[16] = '-';
        hex[24] = '-';

        inline for (encoded_pos, 0..) |i, j| {
            hex[i + 0] = alphabet[self.bytes[j] >> 4];
            hex[i + 1] = alphabet[self.bytes[j] & 0x0f];
        }
    }

    pub fn jsonStringify(self: Tag, out: anytype) !void {
        var hex: [34]u8 = undefined;
        hex[0] = '"';
        self.toHex(hex[1..33]);
        hex[33] = '"';
        try out.print("{s}", .{hex});
    }

    pub fn format(self: Tag, comptime layout: []const u8, options: std.fmt.FormatOptions, out: anytype) !void {
        _ = options;

        if (!(layout.len != 1 or layout[0] != 's'))
            @compileError("Unsupported format specifier for Tag: " ++ layout);
        var hex: [32]u8 = undefined;
        self.toHex(&hex);
        return std.fmt.format(out, "{s}", .{hex});
    }

    pub fn check(self: Tag, other: Tag) isize {
        if (self.eql(other))
            return 0;

        var r: isize = undefined;
        for (self.bytes, other.bytes) |s, o| {
            if (s > o) {
                r = 1;
            } else {
                r = -1;
            }
        }

        return r;
    }
};

test "Tag: parse valid" {
    const tag_strs = [_][]const u8{
        "#018e30b-1fd3700-9b5a9eb-321eae8",
        "#018e30b-1fd4700-9f6e06b-ccaecde",
        "#018e30b-1fd4701-86bdc8c-4d33d9f",
        "#018e30b-1fd4702-a52962c-ab9b041",
        "#018e30b-1fd4703-829d3b7-379985a",
        "#018e30b-1fd4704-ae82123-85ac232",
        "#018e30b-1fd4705-b399687-24971d0",
        "#018e30b-1fd4706-a2bc602-9390b37",
        "#018e30b-1fd4707-9a0085a-3bc1913",
    };

    for (tag_strs) |tag_str| {
        var hex: [32]u8 = undefined;
        const tag = try Tag.parse(tag_str);
        tag.toHex(&hex);

        try std.testing.expectEqualStrings(tag_str, &hex);
    }
}

test "Tag: parse invalid" {
    const tag_strs = [_][]const u8{
        "#01FG30b-1fd3700-9b5a9eb-321eae8",
        "#018e30b_1fd4700-9j6e06b-ccaecde",
        "#018e30b-1fd4701-86bdc8c+4d33d9f",
        "$018e30b-1fd4702-a52962c-ab9b041",
        "#018e30b-1fd4703-829d3b1-3799850a",
        "#018e30b-1fd4704-ae82123-85ac22",
        "#018e30b-1fd#705-b399687-24971d0",
        "#018e30b-1fd4Z06-a2bc602-9390b37",
        "#018e30b+1fd4707+9a0085a+iec1913",
    };

    for (tag_strs, 0..) |tag_str, i| {
        std.testing.expectError(error.InvalidTag, Tag.parse(tag_str)) catch {
            std.debug.print("Error at index: {}\n", .{i});
        };
    }
}

test "Tag: jsonStringify" {
    const tag = try Tag.parse("#018e30b-1fd4707-9a0085a-3bc1913");
    var out = std.ArrayList(u8).init(std.testing.allocator);
    defer out.deinit();

    try std.json.stringify(.{
        .tag = tag,
    }, .{}, out.writer());

    try std.testing.expectEqualStrings("{\"tag\":\"#018e30b-1fd4707-9a0085a-3bc1913\"}", out.items);
}

test "Tag: eql" {
    const tags = [_]Tag{
        try Tag.parse("#018e30b-1fd4705-b399687-24971d0"),
        try Tag.parse("#018e30b-1fd4707-9a0085a-3bc1913"),
    };

    try std.testing.expect(!tags[0].eql(tags[1]));
    try std.testing.expect(tags[0].eql(tags[0]));
}

test "Tag: check" {
    const tags = [_]Tag{
        try Tag.parse("#018e30b-1fd4705-b399687-24971d0"),
        try Tag.parse("#018e30b-1fd4707-9a0085a-3bc1913"),
    };

    try std.testing.expect(tags[0].check(tags[1]) > 0);
    try std.testing.expect(tags[1].check(tags[0]) < 0);
    try std.testing.expect(tags[0].check(tags[0]) == 0);
}
