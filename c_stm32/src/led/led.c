#include "led.h"

void LED_GPIO_Config(void)
{
    // RCC->APB2ENR |=(1<<4); // 打开GPIOC时钟
    // GPIOC->CRH &=~(0x0F<<(4*5)); // 配置输出模式, 偏移地址
    // GPIOC->CRH |=(1<<(4*5));
    // GPIOC->ODR &=~(1<<13); // 配置输出低电平
    // GPIOC->ODR |=GPIO_Pin_13; // 配置输出高电平
    // GPIO_ResetBits(GPIOC,GPIO_Pin_13);
    // GPIO_SetBits(GPIOC,GPIO_Pin_13);

    RCC_APB2PeriphClockCmd(LED_RCC, ENABLE);
    GPIO_InitTypeDef GPIO_InitObj;
    GPIO_InitObj.GPIO_Pin = LED_PIN;
    GPIO_InitObj.GPIO_Mode = GPIO_Mode_Out_PP;
    GPIO_InitObj.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(LED_GPIO, &GPIO_InitObj);
    LED_Close();
}

void LED1_GPIO_Config(void)
{
    RCC_APB2PeriphClockCmd(LED1_RCC, ENABLE);
    GPIO_InitTypeDef gpio;
    gpio.GPIO_Pin = LED1_PIN;
    gpio.GPIO_Mode = GPIO_Mode_Out_PP;
    gpio.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(LED1_GPIO, &gpio);
}

void LED_Open(void)
{
    GPIO_ResetBits(LED_GPIO, LED_PIN);
}

// 高位熄灭
void LED_Close(void)
{
    GPIO_SetBits(LED_GPIO, LED_PIN);
}

void LED_Toggle(uint8_t flag)
{
    if (flag) {
        GPIO_ResetBits(LED_GPIO, LED_PIN);
    } else {
        GPIO_SetBits(LED_GPIO, LED_PIN);
    }
}


static uint8_t LED_FLAG = 2;
void LED_FLAG_Toggle()
{
    if (LED_FLAG == 2) {
        LED_FLAG = GPIO_ReadOutputDataBit(LED_GPIO, LED_PIN);
    }
    if (LED_FLAG) {
        GPIO_ResetBits(LED_GPIO, LED_PIN);
        LED_FLAG = 0;
    } else {
        GPIO_SetBits(LED_GPIO, LED_PIN);
        LED_FLAG = 1;
    }
}
