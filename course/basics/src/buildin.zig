const std = @import("std");
const log = std.log;

pub fn logic() void {
    std.debug.print("------ buildin --------\n", .{});
    const runner = @import("root");
    std.debug.print("root runner: {any}\n", .{runner}); // runner: main
    std.debug.print("typeof root runner: {any}\n", .{@TypeOf(runner)}); //
    std.debug.print("typeinfo root runner: {any}\n", .{@typeInfo(runner)}); //
    // typeinfo root runner: 
    // builtin.Type{ 
    //   .Struct = builtin.Type.Struct{ 
    //     .layout = builtin.Type.ContainerLayout.Auto, 
    //     .backing_integer = null, 
    //     .fields = {  }, 
    //     .decls = { builtin.Type.Declaration{ ... } }, 
    //     .is_tuple = false 
    //   } 
    // }

}

fn conv() void {
    log.info("force convert @intCast:{d}", .{@as(u32, @intCast(10))});
    log.info("force convert @TypeOf(@intCast):{}", .{@TypeOf(@as(u32, @intCast(10)))});
    // std.log.info("{}", .{@TypeOf(val)});
}

test "root" {
    const build_runner = @import("root");
    std.debug.print("build_runner: {any}\n", .{build_runner}); // test_runner
}
