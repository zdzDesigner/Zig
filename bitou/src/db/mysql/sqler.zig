const formatter = @import("tree-fmt").defaultFormatter();

const std = @import("std");
const meta = std.meta;
const mem = std.mem;
const myzql = @import("myzql");
const Conn = myzql.conn.Conn;
const ResultSet = myzql.result.ResultSet;
const TextResultRow = myzql.result.TextResultRow;
const BinaryResultRow = myzql.result.BinaryResultRow;
const ResultRowIter = myzql.result.ResultRowIter;
const TextElems = myzql.result.TextElems;
const PreparedStatement = myzql.result.PreparedStatement;

pub const Sqler = struct {
    const Self = @This();
    client: *Conn,
    allocator: mem.Allocator,
    t_name: []const u8 = "",
    // t_keys: std.ArrayList([]const u8),
    // t_keys: []const []const u8,

    pub fn init(allocator: mem.Allocator, client: *Conn, t_name: []const u8) !Self {
        return .{
            .client = client,
            .allocator = allocator,
            .t_name = t_name,
            // .t_keys = getTKeys(T),
        };
    }
    pub fn deinit(_: *Self) void {
        // self.t_keys.deinit();
    }

    // table key
    fn getTKeys(allocator: mem.Allocator, comptime T: type) !std.ArrayList([]const u8) {
        var list = std.ArrayList([]const u8).init(allocator);
        const fields = meta.fields(T);
        inline for (fields) |field| {
            try list.append(field.name);
        }
        return list;
    }

    fn StructTypeMin(comptime T: type, comptime keys: ?[]const []const u8) type {
        if (keys == null) return T;

        const fields = std.meta.fields(T);
        var fields_new: [keys.?.len]std.builtin.Type.StructField = undefined;
        inline for (fields) |field| {
            inline for (keys.?, 0..) |key, i| {
                if (std.mem.eql(u8, key, field.name)) {
                    fields_new[i] = .{
                        .name = field.name,
                        .type = field.type,
                        .alignment = @alignOf(field.type),
                        .is_comptime = false,
                        .default_value = null,
                    };
                }
            }
        }
        return @Type(.{
            .Struct = .{
                .fields = fields_new[0..],
                .decls = &.{},
                .layout = std.builtin.Type.ContainerLayout.auto,
                .is_tuple = false,
            },
        });
    }
    // 混合(字符串申请拷贝)
    fn structTypeAlloc(self: *Self, comptime T: type, val: anytype) !T {
        const fields = std.meta.fields(@TypeOf(val));
        var instance = std.mem.zeroes(T);
        inline for (fields) |field| {
            // std.debug.print("field.type:{}\n", .{field.type});
            if (field.type == []const u8) {
                @field(instance, field.name) = try self.allocator.dupe(u8, @field(val, field.name));
            } else {
                @field(instance, field.name) = @field(val, field.name);
            }
        }
        return instance;
    }
    // 释放(字符串释放)
    pub fn structTypeFree(self: *Self, val: anytype) void {
        const fields = std.meta.fields(@TypeOf(val));
        inline for (fields) |field| {
            if (field.type == []const u8) {
                self.allocator.free(@field(val, field.name));
            }
        }
    }

    pub fn selectSlice(self: *Self, comptime T: type, comptime keys: ?[]const []const u8) ![]T {
        var list = try self.select(T, keys);
        return list.toOwnedSlice();
    }
    pub fn select(self: *Self, comptime T: type, comptime keys: ?[]const []const u8) !std.ArrayList(T) {
        // try formatter.format(keys, .{
        //     .slice_elem_limit = 1000,
        //     .ignore_u8_in_lists = true,
        // });

        const list_keys = try getTKeys(self.allocator, T);
        defer list_keys.deinit();
        // select * from xxx; 使用`*`T fields要和数据库字段顺序保持一致
        const sql_key = try std.mem.join(self.allocator, ",", keys orelse list_keys.items);
        // const sql_key = try std.mem.join(self.allocator, ",", keys orelse &.{"*"});
        defer self.allocator.free(sql_key);
        // std.debug.print("sqlkey:{s}\n", .{sql_key});
        const SQL = try std.fmt.allocPrint(self.allocator, "select {s} from {s} limit 2", .{ sql_key, self.t_name });
        defer self.allocator.free(SQL);
        std.debug.print("SQL:{s}\n", .{SQL});
        // const SQL = "select id,stage_id,user_id,parent_id,update_time,title,data from stage limit 10";

        // 预处理 ===================
        const pre_res = try self.client.prepare(self.allocator, SQL);
        defer pre_res.deinit(self.allocator);

        // 执行 ===================
        // const pre_rows: PreparedStatement = try pre_res.expect(.stmt);
        // std.debug.print("result:{}\n", .{pre_rows});
        const res = try self.client.executeRows(&try pre_res.expect(.stmt), .{}); // no parameters because there's no ? in the query
        const rows: ResultSet(BinaryResultRow) = try res.expect(.rows);
        const rows_iter: ResultRowIter(BinaryResultRow) = rows.iter();
        // const rows_iter: ResultRowIter(BinaryResultRow) = (try res.expect(.rows)).iter();
        var rets = std.ArrayList(T).init(self.allocator);
        // defer {
        //     for (rets.items) |item| {
        //         // std.debug.print("item:{}", .{item});
        //         structTypeFree(self.allocator, item);
        //         // allocator.free(item.title);
        //         // allocator.free(item.data);
        //         // allocator.destroy(item); // error: access of union field 'Pointer' while field 'Struct' is active
        //     }
        //     rets.deinit();
        // }
        const NewT = comptime StructTypeMin(T, keys);
        while (try rows_iter.next()) |row| {
            // @compileLog(self.t_keys.items);
            const op = try row.structCreate(NewT, self.allocator);
            // const op = try row.structCreate(T, self.allocator);
            // const op = try row.structCreate(StructTypeMin(T, &.{ "id", "user_id", "update_time" }), self.allocator);
            defer BinaryResultRow.structDestroy(op, self.allocator); // 全部清除
            // defer allocator.destroy(op); // 不清除内部指针string
            // defer allocator.free(op.*.title);
            // std.debug.print("op:{s}\n", .{op.*.title});

            // const new_t = blk: {
            //     if (keys == null) break :blk op.*;
            //     break :blk try self.structTypeMix(T, op.*);
            // };
            // try rets.append(new_t); // 拷贝[]const u8
            try rets.append(try self.structTypeAlloc(T, op.*)); // 拷贝[]const u8
        }

        // std.debug.print("rets:{any}\n", .{rets.items});
        return rets;
    }

    // fn sqlmount(self: *Self) ![]const u8 {
    //
    // }
};
