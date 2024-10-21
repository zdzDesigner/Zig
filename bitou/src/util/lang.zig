pub fn toZ(val: []const u8) [:0]const u8 {
    return val.ptr[0..val.len :0];
}
