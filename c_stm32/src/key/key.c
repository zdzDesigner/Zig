#include "key.h"
#include "delay.h"

void KEY_GPIO_Config(void)
{
    delay_init_x();
    RCC_APB2PeriphClockCmd(KEY_CLK, ENABLE);

    GPIO_InitTypeDef io;
    io.GPIO_Pin = KEY_PIN;
    io.GPIO_Mode = GPIO_Mode_IPU;
    // io.GPIO_Mode = GPIO_Mode_IPD;
    // io.GPIO_Mode = GPIO_Mode_IN_FLOATING;
    GPIO_Init(KEY_GPIO, &io);
}

uint8_t KeyScan(GPIO_TypeDef *GPIOx, uint16_t GPIO_pin)
{
    uint8_t LED_FLAG = 1;
    if (LED_FLAG && GPIO_ReadInputDataBit(GPIOx, GPIO_pin) == KEY_OFF) {
        LED_FLAG = 0;
        delay_ms_x(50);
        if (GPIO_ReadInputDataBit(GPIOx, GPIO_pin) == KEY_OFF) {
            return KEY_OFF;
        }
    } else if (LED_FLAG == 0 && GPIO_ReadInputDataBit(GPIOx, GPIO_pin) == KEY_ON) {
        LED_FLAG = 1;
    }
    return KEY_ON;
}
