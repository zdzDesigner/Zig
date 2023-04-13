pub const RCC_APB2ENR = @intToPtr(*volatile u32, 0x40021018);
pub const GPIOC_CRH = @intToPtr(*volatile u32, 0x40011004);
pub const GPIOC_ODR = @intToPtr(*volatile u32, 0x4001100C);

export fn main() void {
    RCC_APB2ENR.* |= @as(u32, 1 << 4); // 使能GPIOC
    GPIOC_CRH.* &= ~@as(u32, 0x0F << (4 * 5)); // 配置输出模式
    GPIOC_CRH.* |= @as(u32, 1 << (4 * 5));
    while (true) {
        var i: u32 = 0;
        GPIOC_ODR.* ^= @as(u32, 1 << 13); // 去反
        while (i < 10000) { // 硬等待
            i += 1;
        }
    }
}
