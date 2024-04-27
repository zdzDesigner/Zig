pub const RCC_APB2ENR = @as(*volatile u32, @ptrFromInt(0x40021018));
pub const GPIOC_CRH = @as(*volatile u32, @ptrFromInt(0x40011004));
pub const GPIOC_ODR = @as(*volatile u32, @ptrFromInt(0x4001100C));

export fn main() void {
    RCC_APB2ENR.* |= @as(u32, 1 << 4); // 使能GPIOC
    GPIOC_CRH.* &= ~@as(u32, 0x0F << (4 * 5)); // 配置输出模式
    GPIOC_CRH.* |= @as(u32, 1 << (4 * 5));
    while (true) {
        var i: u32 = 0;
        GPIOC_ODR.* ^= @as(u32, 1 << 13); // 去反
        while (i < 10000) { // 硬等待 当前未配置系统时钟 默认8M, 所以比72m慢10倍左右
            i += 1;
        }
    }
}
