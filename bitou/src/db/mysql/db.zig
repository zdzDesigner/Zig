pub const init = @import("config.zig").init;

const std = @import("std");
const mem = std.mem;

const formatter = @import("tree-fmt").defaultFormatter();
const myzql = @import("myzql");
const Conn = myzql.conn.Conn;
const ResultSet = myzql.result.ResultSet;
const TextResultRow = myzql.result.TextResultRow;
const BinaryResultRow = myzql.result.BinaryResultRow;
const ResultRowIter = myzql.result.ResultRowIter;
const TextElems = myzql.result.TextElems;
const PreparedStatement = myzql.result.PreparedStatement;

const sqler = @import("./sqler.zig");
// id | user_id | device_id | action_type | action_entity | action_entity_id | update_time
const Operation = struct {
    id: u32,
    user_id: u32,
    device_id: u32,
    action_type: u8,
    action_entity: u8,
    action_entity_id: u32,
    update_time: u32,
};

fn StructType(comptime T: type, keys: []const []const u8) type {
    var fields_new: [keys.len]std.builtin.Type.StructField = undefined;
    const fields = std.meta.fields(T);
    inline for (fields) |field| {
        for (keys, 0..) |key, i| {
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

pub fn select2(client: *Conn, allocator: mem.Allocator) !void {
    var mgr = try sqler.Mgr.init(allocator, Operation);
    defer mgr.deinit();

    // 预处理 ===================
    const pre_res = try client.prepare(allocator, "select id,user_id,update_time from operation limit 10");
    defer pre_res.deinit(allocator);
    const pre_rows: PreparedStatement = try pre_res.expect(.stmt);
    // std.debug.print("result:{}\n", .{pre_rows});

    // 执行 ===================
    const res = try client.executeRows(&pre_rows, .{}); // no parameters because there's no ? in the query
    const rows: ResultSet(BinaryResultRow) = try res.expect(.rows);
    const rows_iter: ResultRowIter(BinaryResultRow) = rows.iter();
    while (try rows_iter.next()) |row| {
        // const op = try row.structCreate(Operation, allocator);
        const op = try row.structCreate(StructType(Operation, &.{ "id", "user_id", "update_time" }), allocator);
        std.debug.print("op:{}\n", .{op.*.id});
    }
}
pub fn select3(client: *Conn, allocator: mem.Allocator) !void {
    const res = try client.queryRows("select id,user_id,update_time from operation limit 10");
    const rows: ResultSet(TextResultRow) = try res.expect(.rows);

    // std.debug.print("result:{}\n", .{rows});
    const rows_iter: ResultRowIter(TextResultRow) = rows.iter();
    while (try rows_iter.next()) |row| {
        // std.debug.print("row:{any}\n", .{row.col_defs});

        // ============================
        const item: TextElems = try row.textElems(allocator);
        defer item.deinit(allocator); // elems are valid until deinit is called
        // std.debug.print("elems: {any}\n", .{item.elems});

        for (item.elems) |elem| {
            if (elem) |e| {
                std.debug.print("elem:{s}\n", .{e});
            }
        }
    }
}
pub fn select4(client: *Conn, allocator: mem.Allocator) !void {
    // _ = allocator;
    const res = try client.queryRows("select id,update_time from operation limit 10");
    const rows: ResultSet(TextResultRow) = try res.expect(.rows);
    // try formatter.format(rows.col_defs, .{
    //     .slice_elem_limit = 1000,
    //     .ignore_u8_in_lists = true,
    // });

    // std.debug.print("result:{any}\n", .{rows.col_defs});
    const rows_iter: ResultRowIter(TextResultRow) = rows.iter();
    while (try rows_iter.next()) |row| {
        // std.debug.print("row:{any}\n", .{row.col_defs});
        // try formatter.format(row.col_defs, .{
        //     .name = "row",
        //     .slice_elem_limit = 1000,
        //     .ignore_u8_in_lists = true,
        // });

        // ============================
        const item: TextElems = try row.textElems(allocator);
        defer item.deinit(allocator); // elems are valid until deinit is called
        // try formatter.format(item, .{
        //     .name = "item",
        //     .slice_elem_limit = 1000,
        //     .ignore_u8_in_lists = true,
        // });
        // std.debug.print("elems: {any}\n", .{item.elems});
        //
        // for (item.elems) |elem| {
        //     if (elem == null) continue;
        //     std.debug.print("elem:{s}\n", .{elem.?});
        // }
        for (row.col_defs) |col_def| {
            std.debug.print("name:{s}\n", .{col_def.name});
        }
        // for (item.elems, row.col_defs, 0..) |elem, col_def, i| {
        //     if (elem == null) continue;
        //     _ = i;
        //     std.debug.print("elem:{s},name:{s}\n", .{ elem.?, col_def.name });
        // }
    }
}
pub fn select(client: *Conn, allocator: mem.Allocator) !void {
    // 预处理 ===================
    const pre_res = try client.prepare(allocator, "select id,user_id,update_time from operation limit 10");
    defer pre_res.deinit(allocator);
    const pre_rows: PreparedStatement = try pre_res.expect(.stmt);
    // std.debug.print("result:{}\n", .{pre_rows});
    try formatter.format(pre_rows.col_defs, .{
        .name = "pre_rows",
        .slice_elem_limit = 1000,
        .ignore_u8_in_lists = true,
    });

    // 执行 ===================
    const res = try client.executeRows(&pre_rows, .{}); // no parameters because there's no ? in the query
    const rows: ResultSet(BinaryResultRow) = try res.expect(.rows);
    const rows_iter: ResultRowIter(BinaryResultRow) = rows.iter();
    while (try rows_iter.next()) |row| {
        std.debug.print("row:{any}\n", .{row.packet});
        std.debug.print("row:{any}\n", .{row.packet.payload});
        // try formatter.format(row.packet.payload, .{
        //     .name = "row",
        //     .slice_elem_limit = 1000,
        //     .ignore_u8_in_lists = true,
        // });

        // try formatter.format(item, .{
        //     .name = "item",
        //     .slice_elem_limit = 1000,
        //     .ignore_u8_in_lists = true,
        // });
        // std.debug.print("elems: {any}\n", .{item.elems});
        //
        // for (item.elems) |elem| {
        //     if (elem == null) continue;
        //     std.debug.print("elem:{s}\n", .{elem.?});
        // }
        // for (pre_rows.col_defs) |col_def| {
        //     std.debug.print("name:{s}\n", .{col_def.name});
        // }
        // for (row.scan(dest: anytype), pre_rows.col_defs, 0..) |elem, col_def, i| {
        //     if (elem == null) continue;
        //     _ = i;
        //     std.debug.print("elem:{s},name:{s}\n", .{ elem.?, col_def.name });
        // }
    }
}
