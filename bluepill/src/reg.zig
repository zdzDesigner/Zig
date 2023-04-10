const PERIPH_BASE = 0x40000000; // 总线基地址
const APB1PERIPH_BASE = PERIPH_BASE; // APB1基地址
const APB2PERIPH_BASE = PERIPH_BASE + 0x00010000; // APB2基地址
const AHBPERIPH_BASE = PERIPH_BASE + 0x00020000; // AHB基地址 实际是:0x00018000

pub const GPIO_TypeDef = struct {
    CRL: u32,
    CRH: u32,
    IDR: u32,
    ODR: u32,
    BSRR: u32,
    BRR: u32,
    LOCK: u32,
};
pub const GPIOC_BASE = APB2PERIPH_BASE + 0x00001000;
pub const GPIOC = @intToPtr(*volatile GPIO_TypeDef, GPIOC_BASE);

pub const RCC_TypeDef = struct {
    CR: u32,
    CFGR: u32,
    CIR: u32,
    APB2RSTR: u32,
    APB1RSTR: u32,
    AHBENR: u32,
    APB2ENR: u32,
    APB1ENR: u32,
    BDCR: u32,
    CSR: u32,
};

pub const RCC_BASE = AHBPERIPH_BASE + 0x1000; // 时钟基地址
pub const RCC = @intToPtr(*volatile RCC_TypeDef, RCC_BASE);

const Pin = struct {};

// Used like
pub inline fn set(self: *Pin) void {
    writeReg(&self.instance.BSRR, @enumToInt(self.pin));
}
// ----------------------------------------------------------------------------
// Register utilities
// ----------------------------------------------------------------------------
pub inline fn setBit(reg: *volatile u32, bit: u32) void {
    reg.* |= bit;
}

pub inline fn toggleBit(reg: *volatile u32, bit: u32) void {
    reg.* ^= bit;
}

pub inline fn clearBit(reg: *volatile u32, bit: u32) void {
    reg.* &= ~bit;
}

pub inline fn readBit(reg: *volatile u32, bit: u32) u32 {
    return readReg(reg) & bit;
}

pub inline fn isBitSet(reg: *volatile u32, bit: u32) bool {
    return (readReg(reg) & bit) == bit;
}

pub inline fn clearReg(reg: *volatile u32) void {
    reg.* = 0x0;
}

pub inline fn writeReg(reg: *volatile u32, val: u32) void {
    reg.* = val;
}

pub inline fn readReg(reg: *volatile u32) u32 {
    return reg.*;
}

pub inline fn modifyReg(reg: *volatile u32, clear_mask: u32, set_mask: u32) void {
    return writeReg(reg, (readReg(reg) & ~clear_mask) | set_mask);
}

pub inline fn writeType(comptime T: type, reg: *volatile T, val: T) void {
    reg.* = val;
}

pub inline fn readType(comptime T: type, reg: *volatile T) T {
    return reg.*;
}
