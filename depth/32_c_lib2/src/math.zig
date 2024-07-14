const libmath = @import("libmath.zig");

pub fn add(a: i32, b: i32) i32 {
    return libmath.add(a, b);
}

pub fn increment(x: i32) i32 {
    return libmath.increment(x);
}
