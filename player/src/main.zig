const std = @import("std");
const time = std.time;
const mem = std.mem;
const znotify = @import("znotify");
const zaudio = @import("zaudio");
const command = @import("./command.zig");

const Sub = fn (sound: *AudioCxt, c: u8) void;
// var list: []const [*:0]const u8 = &.{};
// fn init(val: []const [*:0]const u8) void {
//     list = val;
// }
// fn append(item: [*:0]const u8) !void {
//     list = list ++ .{item};
// }

// const STATE = enum { RUN, STOP, NEXT, PREV };
const state = union(enum) {
    RUN: u8,
};

const songlist = struct {
    var ally: mem.Allocator = undefined;
    var list: std.ArrayList([*:0]const u8) = undefined;
    // const max: usize = @bitCast(std.math.inf(f32));
    const max: usize = std.math.maxInt(usize);
    var index: usize = max;
    fn init(allocator: mem.Allocator) void {
        ally = allocator;
        list = std.ArrayList([*:0]const u8).init(ally);
    }
    fn deinit() void {
        // for (list.items) |item| ally.free(item);
        list.deinit();
    }

    var isloop: bool = false;
    fn loop(val: ?bool) bool {
        if (val) |v| {
            isloop = v;
            return v;
        }
        return isloop;
    }

    fn append(item: [*:0]const u8) !void {
        try list.append(item);
    }
    fn random() void {
        Random.shuffle([*:0]const u8, list.items);
    }

    fn next() ?[*:0]const u8 {
        // if(index == undefined) index = 0;
        if (index == lastIndex() and !isloop) return null;
        index = if (index == max) 0 else index + 1;
        index = if (index > lastIndex()) 0 else index;
        std.debug.print("index:{}\n", .{index});
        return list.items[index];
    }
    fn prev() ?[*:0]const u8 {
        if (index == 0 and !isloop) return null;
        index = if (index == 0) lastIndex() else index - 1;
        std.debug.print("index:{}\n", .{index});
        return list.items[index];
    }

    fn lastIndex() usize {
        return list.items.len - 1;
    }
};

const AudioCxt = struct {
    allocator: mem.Allocator,
    engin: *zaudio.Engine,
    sound: *zaudio.Sound = undefined,
    frames_total: u64 = 0,
    frames: u64 = 0,
    channels: u64 = 0,
    format: zaudio.Format = undefined,
    sound_conf: zaudio.Sound.Config,
    STATE: u8 = 'R',

    fn init(ally: mem.Allocator) !AudioCxt {
        return .{
            .allocator = ally,
            .engin = try zaudio.Engine.create(null),
            .sound_conf = zaudio.Sound.Config.init(),
        };
    }

    fn loadSound(self: *AudioCxt, filepath: ?[*:0]const u8) !void {
        // self.sound_conf.file_path = if (filepath) |v| v else songlist.next();
        self.sound_conf.file_path = filepath orelse songlist.next();
        self.sound = try self.engin.createSound(self.sound_conf);
        // std.debug.print("ok:{}\n", .{self.sound_conf});
        // std.debug.print("sound:{}\n", .{self.sound});
        std.debug.print("path:{s}\n", .{self.sound_conf.file_path.?});
        // return self;
    }

    fn start(self: *AudioCxt) !void {
        try self.sound.start();
        self.frames_total = try self.sound.getLengthInPcmFrames();
        var sample_rate: u32 = undefined;
        var channels: u32 = undefined;
        var format: zaudio.Format = undefined;
        try self.sound.getDataFormat(&format, &channels, &sample_rate, null);
        self.frames = sample_rate;
        self.channels = channels;
        self.format = format;
        // self.frames = self.sound.getTimeInPcmFrames();
        // if (self.frames == 0) {
        //     self.frames = try self.sound.getCursorInPcmFrames();
        // }

        // std.debug.print("frames_total:{}\n", .{frames_total});
    }

    fn stop(self: *AudioCxt) !void {
        try self.sound.stop();
    }

    fn destroy(self: *AudioCxt) void {
        self.sound.destroy();
    }

    fn next(self: *AudioCxt) !void {
        self.sound.destroy();
        try self.loadSound(null);
        try self.start();
    }
    fn prev(self: *AudioCxt) !void {
        self.sound.destroy();
        try self.loadSound(songlist.prev());
        try self.start();
    }
};

const event = struct {
    fn sub(ctx: *AudioCxt, k: u8) void {
        switch (k) {
            'S' => ctx.stop() catch unreachable,
            'R' => ctx.start() catch unreachable,
            'P' => {
                ctx.stop() catch unreachable;
                ctx.next() catch unreachable;
            },
            'O' => {
                ctx.stop() catch unreachable;
                ctx.prev() catch unreachable;
            },
            '"', 'H' => {
                var frames_cur = ctx.sound.getTime();
                // std.debug.print("frames_cur:{d}\n", .{frames_cur});
                const step = ctx.channels * ctx.frames * 10;
                if (k == 'H') {
                    frames_cur = if (frames_cur < step) 0 else frames_cur - step;
                } else {
                    frames_cur = frames_cur + step;
                }
                ctx.sound.seekToPcmFrame(frames_cur) catch |err| {
                    std.debug.print("err ============\n:{any}\n =============\n", .{err});
                };
            },
            else => {},
        }
    }
};

pub fn main() !void {
    std.debug.print("audioplayer:", .{});
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const ally = gpa.allocator();

    var args = try command.CommandLineArgs.parse(ally);
    defer args.deinit();

    // SongList ===================
    songlist.init(ally);
    defer songlist.deinit();
    _ = songlist.loop(true);

    // try readSongList(ally, "/home/zdz/temp/music/lz/wanj");
    // try readSongList(ally, "/home/zdz/temp/music/beyond");
    // try readSongList(ally, "/home/zdz/temp/music/like");
    // try readSongList(ally, "/home/zdz/temp/music/listening");
    // try readSongList(ally, "/home/zdz/temp/music/lzs");
    // const dirpath = args.get("dir") orelse "/home/zdz/temp/music/listening";
    const dirpath = args.get("dir") orelse "/home/zdz/temp/music/listened";
    // const dirpath = args.get("dir") orelse "/home/zdz/temp/music/ape-resource";
    // const dirpath = args.get("dir") orelse "/home/zdz/temp/music/ape-resource2";
    try readSongList(ally, dirpath);

    zaudio.init(ally);
    defer zaudio.deinit();
    var ctx = try AudioCxt.init(ally);
    try ctx.loadSound(null);
    try ctx.start();
    // const engin = try zaudio.Engine.create(null);
    // const sound = try play(engin);
    // sample =============
    // try zaudio.Engine.playSound(engin, "/home/zdz/temp/music/enya/162635578906628819813c.mp3", null);

    // sound =============

    // ================
    // const thread = try std.Thread.spawn(.{}, listenStop, .{ &ctx, event.sub });
    const thread = try std.Thread.spawn(.{}, controller, .{ &ctx, event.sub });

    // std.debug.print("thread:{}\n", .{thread});
    const thread2 = try std.Thread.spawn(.{}, audoPlay, .{ &ctx, event.sub });
    // std.debug.print("thread:{}\n", .{thread2});
    thread.join();
    thread2.join();
    // thread.detach();
    // ================
    // time.sleep(5e9);
    // try sound.stop();
    // sound.destroy();
    // time.sleep(5e9);
    // sound = try play(engin, &songlist);
    // conf.file_path = songlist.next();
    // sound = try engin.createSound(conf);
    // try sound.start();
    // sound.setVolume(0.25);
    // time.sleep(5e9);
    // sound.setVolume(1);
    std.debug.print("main run ===============", .{});
    // time.sleep(1e13);
}

fn play(engin: *zaudio.Engine) !*zaudio.Sound {
    var conf = zaudio.Sound.Config.init();
    conf.file_path = songlist.next();
    var sound = try engin.createSound(conf);
    std.debug.print("ok:{}\n", .{conf});
    std.debug.print("sound:{}\n", .{sound});
    try sound.start();
    return sound;
}

fn listenStop(
    ctx: *AudioCxt,
    sub: Sub,
) void {
    // std.debug.print("Thread:sound:{}\n", .{sound});
    const reader = std.io.getStdIn().reader();
    while (true) {
        time.sleep(1e9);
        const k = reader.readByte() catch unreachable;
        switch (k) {
            '"', 'H' => {
                var frames_cur = ctx.sound.getTime();
                std.debug.print("frames_cur:{d}\n", .{frames_cur});
                const step = ctx.channels * ctx.frames * 10;
                if (k == 'H') {
                    frames_cur = if (frames_cur < step) 0 else frames_cur - step;
                } else {
                    frames_cur = frames_cur + step;
                }
                ctx.sound.seekToPcmFrame(frames_cur) catch |err| {
                    std.debug.print("err ============\n:{any}\n =============\n", .{err});
                };
            },
            else => {
                sub(ctx, k);
            },
        }
        // if (k == '"') {
        //     const frames_cur = ctx.sound.getTime();
        //     std.debug.print("frames_cur:{d}\n", .{frames_cur});
        //     ctx.sound.seekToPcmFrame(frames_cur + ctx.channels * ctx.frames * 10) catch |err| {
        //         std.debug.print("err ============\n:{any}\n =============\n", .{err});
        //     };
        // } else {
        //     sub(ctx, k);
        // }
    }
}

fn controller(
    ctx: *AudioCxt,
    sub: Sub,
) !void {
    var notifer = znotify.INotify.init(ctx.allocator) catch unreachable;
    defer notifer.deinit();

    try notifer.watchPath("/home/zdz/.zdz/.ctrl_player", .{
        .modify = true,
    });

    var oldtime = std.time.milliTimestamp();
    while (try notifer.poll()) |nevt| {
        const path = notifer.getPath(ctx.allocator, nevt) catch continue;
        defer ctx.allocator.free(path);

        const curtime = std.time.milliTimestamp();
        if (curtime - oldtime < 300) continue;
        oldtime = curtime;

        std.debug.print("path:{s},evt:{s}\n", .{ path, @tagName(nevt.event) });
        const buf = try readFile(path);

        sub(ctx, buf[0]);
    }
}

fn audoPlay(ctx: *AudioCxt, sub: Sub) !void {
    while (true) {
        time.sleep(1e9);
        if (ctx.sound.isPlaying()) { // 正常结束不会调用
            // std.debug.print("position:{any}\n", .{ctx.sound.getPosition()});
            // const seconds = try ctx.sound.getCursorInSeconds();
            // std.debug.print("seconds:{d}\n", .{@as(u32, @intFromFloat(@trunc(seconds * 1000))) * ctx.channels * ctx.frames * 32});

            // const frames_cur = try ctx.sound.getCursorInPcmFrames();
            // std.debug.print("frames_cur:{d}\n", .{frames_cur});
            // const frames_cur = ctx.sound.getTime();
            // std.debug.print("frames_cur:{d}\n", .{frames_cur});

            // const seconds_total = try ctx.sound.getLengthInSeconds();
            // std.debug.print("total:{d}\n", .{@trunc(seconds_total * 100)});

            // const frames = ctx.sound.getTimeInPcmFrames();
            // std.debug.print("frames:{d},channels:{d},format:{any}\n", .{ ctx.frames, ctx.channels, ctx.format });

            // // ctx.sound.setPosition(v: [3]f32)
            // if (frames_cur > ctx.frames_total / 10 and frames_cur < ctx.frames_total / 9) {
            //     std.debug.print("set time: =============== ", .{});
            //     // ctx.sound.setStartTimeInPcmFrames(60 * 1000);
            //     // ctx.sound.setStartTimeInMilliseconds(15 * 1000);
            //     // try ctx.sound.stop();
            //     ctx.sound.seekToPcmFrame(ctx.frames_total / 2) catch |err| {
            //         std.debug.print("err ============\n:{any}\n =============\n", .{err});
            //     };
            //     // try ctx.sound.start();
            // }

            // 未知 采样数据?==================================
            // const t = ctx.sound.getTime();
            // std.debug.print("t:{d}\n", .{t});
            // // std.debug.print("seconds:{d}\n", .{@floatFromInt( seconds * 100)});
            // if (seconds > 5 and seconds < 10) {
            //     std.debug.print("set time: =============== ", .{});
            //     try ctx.sound.setTime(20 * 1000 * 411);
            // }
            // ==================================

            // std.debug.print("=========== not playing ========", .{});
        }
        if (ctx.sound.isAtEnd()) {
            std.debug.print("=========== end ===========\n", .{});
            sub(ctx, 'P');
        }
    }
}

const validtype = struct {
    const valids = &.{ ".flac", ".mp3" };
    fn chek(name: []const u8) bool {
        inline for (valids) |t| {
            if (std.mem.endsWith(u8, name, t)) return true;
        }
        return false;
    }
};

// "/home/zdz/temp/music/lz/wanj"
fn readSongList(ally: mem.Allocator, dirpath: []const u8) !void {
    var dir = try std.fs.openDirAbsolute(dirpath, .{ .iterate = true });
    defer dir.close();
    // std.debug.print("dir:{}\n", .{dir});

    // var tempList = std.ArrayList([]const u8).init(ally);
    // defer tempList.deinit();

    var dirit = dir.iterate();
    while (try dirit.next()) |v| {
        // if (!std.mem.endsWith(u8, v.name, ".flac") and !std.mem.endsWith(u8, v.name, ".mp3")) continue;
        if (!validtype.chek(v.name)) continue;
        // std.debug.print("kind:{} \t name:{s:<30} \n", .{
        //     v.kind,
        //     v.name,
        // });
        const filepath = try std.fs.path.resolve(ally, &.{ dirpath, v.name });
        // std.debug.print("filepath:{s}\n", .{filepath});
        defer ally.free(filepath);

        // try tempList.append(try std.fmt.allocPrintZ(ally, "{s}", .{filepath}));
        try songlist.append(try std.fmt.allocPrintZ(ally, "{s}", .{filepath}));
    }

    songlist.random();
}

fn readFile(filepath: []const u8) ![1]u8 {
    var buf: [1]u8 = undefined;
    const f = try std.fs.cwd().openFile(filepath, .{});
    defer f.close();
    const size = try f.readAll(&buf);
    std.debug.print("size:{}, buf:{s}\n", .{ size, buf });
    return buf;
}

const Random = struct {
    var instance: ?std.rand.DefaultPrng = null;

    pub fn intRange(comptime T: type, min: T, max: T) T {
        var r = random();
        return r.intRangeAtMost(T, min, max);
    }

    pub fn shuffle(comptime T: type, buf: []T) void {
        return random().shuffle(T, buf);
    }

    pub fn random() std.rand.Random {
        if (instance == null) {
            var seed: u64 = undefined;
            std.posix.getrandom(std.mem.asBytes(&seed)) catch unreachable;
            instance = std.rand.DefaultPrng.init(seed);
        }
        return instance.?.random();
    }
};
