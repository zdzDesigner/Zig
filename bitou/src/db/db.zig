pub const init = @import("config.zig").init;

const std = @import("std");
const mem = std.mem;
const myzql = @import("myzql");
const Conn = myzql.conn.Conn;
const ResultSet = myzql.result.ResultSet;
const TextResultRow = myzql.result.TextResultRow;
const BinaryResultRow = myzql.result.BinaryResultRow;
const ResultRowIter = myzql.result.ResultRowIter;
const TextElems = myzql.result.TextElems;
const PreparedStatement = myzql.result.PreparedStatement;

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
pub fn select(client: *Conn, allocator: mem.Allocator) !void {
    // 预处理 ===================
    const pre_res = try client.prepare(allocator, "select * from operation limit 10");
    defer pre_res.deinit(allocator);
    const pre_rows: PreparedStatement = try pre_res.expect(.stmt);
    // std.debug.print("result:{}\n", .{pre_rows});

    // 执行 ===================
    const res = try client.executeRows(&pre_rows, .{}); // no parameters because there's no ? in the query
    const rows: ResultSet(BinaryResultRow) = try res.expect(.rows);
    const rows_iter: ResultRowIter(BinaryResultRow) = rows.iter();
    while (try rows_iter.next()) |row| {
        const op = try row.structCreate(Operation, allocator);
        std.debug.print("op:{}\n", .{op});
    }
}
pub fn select2(client: *Conn, allocator: mem.Allocator) !void {
    const res = try client.queryRows("select * from operation limit 10");
    const rows: ResultSet(TextResultRow) = try res.expect(.rows);

    std.debug.print("result:{}\n", .{rows});
    const rows_iter: ResultRowIter(TextResultRow) = rows.iter();
    while (try rows_iter.next()) |row| {
        // std.debug.print("row:{any}\n", .{row.col_defs});

        // ============================
        const item: TextElems = try row.textElems(allocator);
        defer item.deinit(allocator); // elems are valid until deinit is called
        // std.debug.print("elems: {any}\n", .{item.elems});

        for (item.elems, 0..) |elem, i| {
            if (elem) |e| {
                std.debug.print("elem:{s},{d}\n", .{ e, i });
            }
        }
    }
}
