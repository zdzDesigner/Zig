pub const init = @import("config.zig").init;

const std = @import("std");
const mem = std.mem;
const myzql = @import("myzql");
const Conn = myzql.conn.Conn;
const ResultSet = myzql.result.ResultSet;
const TextResultRow = myzql.result.TextResultRow;
const ResultRowIter = myzql.result.ResultRowIter;
const TextElems = myzql.result.TextElems;

pub fn select(client: *Conn, allocator: mem.Allocator) !void {
    const res = try client.queryRows("select * from operation limit 10");
    const rows: ResultSet(TextResultRow) = try res.expect(.rows);
    std.debug.print("result:{}\n", .{rows});
    const rows_iter: ResultRowIter(TextResultRow) = rows.iter();
    while (try rows_iter.next()) |row| {
        const elems: TextElems = try row.textElems(allocator);
        defer elems.deinit(allocator); // elems are valid until deinit is called
        std.debug.print("elems: {any}\n", .{elems.elems});
    }
}
