const std = @import("std");
fn readReturnAddress() void {
    std.debug.print("@returnAddress:{}\n", .{@returnAddress()});
}
// @returnAddress()=> 获取当前函数的返回地址, 用于内存释放
test "@returnAddress:" {
    readReturnAddress();
}
