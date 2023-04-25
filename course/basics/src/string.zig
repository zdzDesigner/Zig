const log = @import("std").log;
const expect = @import("std").testing.expect;

pub fn u() void {
    const char = 'v';
    log.info("c:{c},u:{u},d:{d}", .{ char, char, char });
    // While we're on this subject, 'c' (ASCII encoded character)
    // would work in place for 'u' because the first 128 characters
    // of UTF-8 are the same as ASCII!

}

test "test union" {}
