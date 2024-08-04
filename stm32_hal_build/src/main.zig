const hal = @import("hal/hal.zig");

export fn zigMain() void {
    hal.HAL_RCC_GPIOB_CLK_ENABLE();
    var type_def = hal.GPIO_InitTypeDef{
        .Pin = hal.GPIO_PIN_12,
        .Mode = hal.GPIO_MODE_OUTPUT_PP,
        .Pull = hal.GPIO_NOPULL,
        .Speed = hal.GPIO_SPEED_FREQ_HIGH,
    };
    hal.HAL_GPIO_Init(hal.GPIOB, &type_def);

    while (true) {
        hal.HAL_GPIO_WritePin(hal.GPIOB, hal.GPIO_PIN_12, hal.GPIO_PIN_RESET);
        hal.HAL_Delay(3000);
        hal.HAL_GPIO_WritePin(hal.GPIOB, hal.GPIO_PIN_12, hal.GPIO_PIN_SET);
        hal.HAL_Delay(10);
    }
}
