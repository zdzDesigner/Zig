const std = @import("std");

test "isASCII:" {
    std.debug.print("isASCII:{}\n", .{std.ascii.isASCII('r')}); // true (< 128)
    std.debug.print("isASCII:{}\n", .{std.ascii.isASCII(129)}); // false
}

test "isControl:" {
    std.debug.print("isControl:{}\n", .{std.ascii.isControl(0x01)}); // true (0x00<0x1F || ==0x7F)
}
test "isPrint:" {
    std.debug.print("isPrint:{}\n", .{std.ascii.isPrint(0x00)}); // false (isASCII() and !isControl())
}
