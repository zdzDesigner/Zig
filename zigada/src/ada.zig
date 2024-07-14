// const ada = @cImport({
//     @cInclude("ada_c.h");
// });

const std = @import("std");
const mem = std.mem;

// ----------------------------------------------
pub const ada_url = ?*anyopaque; // *void
pub const ada_string = extern struct {
    // data: [*c]const u8 = @import("std").mem.zeroes([*c]const u8),
    // length: usize = @import("std").mem.zeroes(usize),
    data: [*c]const u8,
    length: usize,
};

pub extern fn ada_is_valid(url: ada_url) bool;
pub extern fn ada_parse(input: [*c]const u8, length: usize) ada_url;
pub extern fn ada_free(url: ada_url) void;
// get
pub extern fn ada_get_origin(url: ada_url) ada_string;
pub extern fn ada_get_href(url: ada_url) ada_string;
pub extern fn ada_get_protocol(url: ada_url) ada_string;
pub extern fn ada_get_port(url: ada_url) ada_string;
// set
pub extern fn ada_set_host(url: ada_url, input: [*c]const u8, length: usize) bool;
pub extern fn ada_set_port(url: ada_url, input: [*c]const u8, length: usize) bool;

// ----------------------------------------------
const UrlError = error{ErrorParse};

pub const Url = struct {
    url: ada_url,

    const Self = @This();
    pub fn init(source: []const u8) !Self {
        const url = ada_parse(&source[0], source.len);
        if (!ada_is_valid(url)) return UrlError.ErrorParse;
        return .{
            .url = url,
        };
    }

    pub fn deinit(self: *Self) void {
        ada_free(self.url);
    }

    pub fn getOrigin(self: *Self) []const u8 {
        const origin = ada_get_origin(self.url);
        return origin.data[0..origin.length];
    }

    pub fn getHref(self: *Self) []const u8 {
        const href = ada_get_href(self.url);
        return href.data[0..href.length];
    }

    pub fn getProtocol(self: *Self) []const u8 {
        const protocol = ada_get_protocol(self.url);
        return protocol.data[0..protocol.length];
    }

    pub fn getPort(self: *Self) []const u8 {
        const port = ada_get_port(self.url);
        return port.data[0..port.length];
    }

    pub fn setHost(self: *Self, host: []const u8) bool {
        return ada_set_host(self.url, &host[0], host.len);
    }
    pub fn setPort(self: *Self, port: []const u8) bool {
        return ada_set_port(self.url, &port[0], port.len);
    }
};
