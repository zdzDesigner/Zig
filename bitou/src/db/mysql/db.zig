const formatter = @import("tree-fmt").defaultFormatter();

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

const config = @import("config.zig");
pub const init = config.init;
const SqlerOld = @import("./sqler_old.zig").Sqler;
pub const Sqler = @import("./sqler.zig").Sqler;
pub const toLimit = @import("./sqler.zig").toLimit;
// pub const getcli = config.getcli;

// pub fn select3(client: *Conn, allocator: mem.Allocator) !void {
//     const res = try client.queryRows("select id,user_id,update_time from operation limit 10");
//     const rows: ResultSet(TextResultRow) = try res.expect(.rows);
//
//     // std.debug.print("result:{}\n", .{rows});
//     const rows_iter: ResultRowIter(TextResultRow) = rows.iter();
//     while (try rows_iter.next()) |row| {
//         // std.debug.print("row:{any}\n", .{row.col_defs});
//
//         // ============================
//         const item: TextElems = try row.textElems(allocator);
//         defer item.deinit(allocator); // elems are valid until deinit is called
//         // std.debug.print("elems: {any}\n", .{item.elems});
//
//         for (item.elems) |elem| {
//             if (elem) |e| {
//                 std.debug.print("elem:{s}\n", .{e});
//             }
//         }
//     }
// }
// pub fn select4(client: *Conn, allocator: mem.Allocator) !void {
//     // _ = allocator;
//     const res = try client.queryRows("select id,update_time from operation limit 10");
//     const rows: ResultSet(TextResultRow) = try res.expect(.rows);
//     // try formatter.format(rows.col_defs, .{
//     //     .slice_elem_limit = 1000,
//     //     .ignore_u8_in_lists = true,
//     // });
//
//     // std.debug.print("result:{any}\n", .{rows.col_defs});
//     const rows_iter: ResultRowIter(TextResultRow) = rows.iter();
//     while (try rows_iter.next()) |row| {
//         // std.debug.print("row:{any}\n", .{row.col_defs});
//         // try formatter.format(row.col_defs, .{
//         //     .name = "row",
//         //     .slice_elem_limit = 1000,
//         //     .ignore_u8_in_lists = true,
//         // });
//
//         // ============================
//         const item: TextElems = try row.textElems(allocator);
//         defer item.deinit(allocator); // elems are valid until deinit is called
//         // try formatter.format(item, .{
//         //     .name = "item",
//         //     .slice_elem_limit = 1000,
//         //     .ignore_u8_in_lists = true,
//         // });
//         // std.debug.print("elems: {any}\n", .{item.elems});
//         //
//         // for (item.elems) |elem| {
//         //     if (elem == null) continue;
//         //     std.debug.print("elem:{s}\n", .{elem.?});
//         // }
//         for (row.col_defs) |col_def| {
//             std.debug.print("name:{s}\n", .{col_def.name});
//         }
//         // for (item.elems, row.col_defs, 0..) |elem, col_def, i| {
//         //     if (elem == null) continue;
//         //     _ = i;
//         //     std.debug.print("elem:{s},name:{s}\n", .{ elem.?, col_def.name });
//         // }
//     }
// }
// pub fn selectx(client: *Conn, allocator: mem.Allocator) !void {
//     // 预处理 ===================
//     const pre_res = try client.prepare(allocator, "select id,user_id,update_time from operation limit 10");
//     defer pre_res.deinit(allocator);
//     const pre_rows: PreparedStatement = try pre_res.expect(.stmt);
//     // std.debug.print("result:{}\n", .{pre_rows});
//     try formatter.format(pre_rows.col_defs, .{
//         .name = "pre_rows",
//         .slice_elem_limit = 1000,
//         .ignore_u8_in_lists = true,
//     });
//
//     // 执行 ===================
//     const res = try client.executeRows(&pre_rows, .{}); // no parameters because there's no ? in the query
//     const rows: ResultSet(BinaryResultRow) = try res.expect(.rows);
//     const rows_iter: ResultRowIter(BinaryResultRow) = rows.iter();
//     while (try rows_iter.next()) |row| {
//         // std.debug.print("col_defs:{any}\n", .{row.col_defs});
//         std.debug.print("packet:{any}\n", .{row.packet});
//         // 第一个name解析问题170
//         // try formatter.format(row.col_defs, .{
//         //     .name = "row",
//         //     .slice_elem_limit = 1000,
//         //     .ignore_u8_in_lists = true,
//         // });
//
//         // try formatter.format(item, .{
//         //     .name = "item",
//         //     .slice_elem_limit = 1000,
//         //     .ignore_u8_in_lists = true,
//         // });
//         // std.debug.print("elems: {any}\n", .{item.elems});
//         //
//         // for (item.elems) |elem| {
//         //     if (elem == null) continue;
//         //     std.debug.print("elem:{s}\n", .{elem.?});
//         // }
//         // for (pre_rows.col_defs) |col_def| {
//         //     std.debug.print("name:{s}\n", .{col_def.name});
//         // }
//         // for (row.scan(dest: anytype), pre_rows.col_defs, 0..) |elem, col_def, i| {
//         //     if (elem == null) continue;
//         //     _ = i;
//         //     std.debug.print("elem:{s},name:{s}\n", .{ elem.?, col_def.name });
//         // }
//     }
// }

// pub fn getTKeys(comptime T: type) []const []const u8 {
//     const fields = std.meta.fields(T);
//     var list: [fields.len][]const u8 = undefined;
//     inline for (fields, 0..) |field, i| {
//         // std.debug.print("name:{s},type:{}\n", .{ field.name, field.type });
//         list[i] = field.name;
//     }
//     return list[0..];
// }

// const Operation = struct {
//     id: u32,
//     user_id: u32,
//     device_id: u32,
//     action_type: u8,
//     action_entity: u8,
//     action_entity_id: u32,
//     update_time: u32,
//
//     const Self = @This();
//     var sqler: SqlerOld = undefined;
//
//     pub fn init(allocator: mem.Allocator, client: *Conn) !Self {
//         SqlerOld = try Sqler.init(allocator, client, "operation");
//         return std.mem.zeroInit(Self, .{});
//     }
//     pub fn deinit(self: *Self) void {
//         _ = self;
//         sqler.deinit();
//     }
//
//     fn get(self: *Self) !void {
//         // fn get(self: *Self) []Self {
//         _ = self;
//         const list = try sqler.select(Self, null);
//         // try sqler.select(Self, &.{ "id", "user_id", "update_time" });
//         // const list = try sqler.select(Self, &.{ "id", "user_id", "action_entity_id" });
//         defer list.deinit();
//         // std.debug.print("res:{any}", .{list.items});
//         try formatter.format(list.items, .{
//             .name = "operation",
//             .slice_elem_limit = 1000,
//             .ignore_u8_in_lists = true,
//         });
//     }
// };

// const Stage = struct {
//     id: u32,
//     user_id: u32,
//     stage_id: u32,
//     parent_id: u32,
//     update_time: u32,
//     title: []const u8,
//     data: []const u8,
//     const Self = @This();
//     var sqler: SqlerOld = undefined;
//
//     pub fn init(allocator: mem.Allocator, client: *Conn) !Self {
//         sqler = try SqlerOld.init(allocator, client, "stage");
//         // pub fn init(allocator: mem.Allocator) !Self {
//         // sqler = try SqlerOld.init(allocator, getcli(), "stage");
//         return std.mem.zeroInit(Self, .{});
//     }
//     pub fn deinit(self: *Self, list: ?[]Self) void {
//         _ = self;
//         if (list) |_list| {
//             defer {
//                 for (_list) |item| sqler.structTypeFree(item);
//                 sqler.allocator.free(_list);
//             }
//         }
//         sqler.deinit();
//     }
//
//     fn get(self: *Self) ![]Self {
//         _ = self;
//         // const list = try sqler.selectSlice(Self, null);
//         const list = try sqler.selectSlice(Self, &.{ "id", "stage_id", "user_id", "parent_id", "update_time", "title", "data" });
//
//         try formatter.format(list, .{
//             .slice_elem_limit = 1000,
//             .ignore_u8_in_lists = true,
//         });
//         return list;
//     }
// };

pub const Stage = struct {
    id: u32,
    user_id: u32,
    stage_id: u32,
    parent_id: u32,
    update_time: u32,
    title: []const u8,
    data: []const u8,
    pub fn tableName() []const u8 {
        return "stage";
    }
};
pub const Article = struct {
    id: u32,
    user_id: u32,
    article_id: u32,
    update_time: u32,
    data: []const u8,

    pub fn tableName() []const u8 {
        return "article";
    }
};

// article
pub fn selectSql(allocator: mem.Allocator, client: *Conn) !void {
    // pub fn selectSql(allocator: mem.Allocator) !void {
    // var sqler = try SqlerOld.init(allocator, client, Operation);
    // defer sqler.deinit();
    // try sqler.select(Operation, null);

    // var opt = try Operation.init(allocator, client);
    // defer opt.deinit();
    // try opt.get();

    // var stage = try Stage.init(allocator, client);
    // const list = try stage.get();
    // defer stage.deinit(list);

    // var sqler = Sqler(Article).init(allocator, getcli());
    var sqler = Sqler(Article).init(allocator, client);
    const list = try sqler.limit("3").selectSlice(null);
    // const list = try sqler.selectSlice(&.{ "article_id", "data" });
    try formatter.format(list, .{
        .slice_elem_limit = 1000,
        .ignore_u8_in_lists = true,
    });
    defer sqler.deinit(list);
}
