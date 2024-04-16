#include "stm32f10x_rcc.h"
#include "exti.h"
#include "key.h"
#include "led.h"
// 必须一致 GPIO_Pin_5 GPIO_PinSource5 EXTI_Line5 EXTI9_5_IRQn (5~9)

void MY_EXTI_Config(void)
{
    // EXTI1 , GPIOC使能
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOC | RCC_APB2Periph_AFIO, ENABLE);

    NVIC_PriorityGroupConfig(NVIC_PriorityGroup_1);

    GPIO_InitTypeDef gpio;
    gpio.GPIO_Mode = GPIO_Mode_IPU;
    gpio.GPIO_Pin = GPIO_Pin_5;
    GPIO_Init(GPIOC, &gpio);

    GPIO_EXTILineConfig(GPIO_PortSourceGPIOC, GPIO_PinSource5); // Pin5设置为EXTI输入线 PC[5]

    // EXTIx[3:0]:EXTIx配置(x = 0 ... 3) (EXTI x configuration)
    // 这些位可由软件读写,用于选择EXTIx外部中断的输入源。参看9.2.5节。
    // 0000:PA[x]引脚 0100:PE[x]引脚
    // 0001:PB[x]引脚 0101:PF[x]引脚
    // 0010:PC[x]引脚 0110:PG[x]引脚
    // 0011:PD[x]引脚
    // 初始
    EXTI_InitTypeDef exti;
    exti.EXTI_Line = EXTI_Line5; // 选择EXTI_Line5线进行配置(因为GPIO_EXTILineConfig配额了PC[5])
    exti.EXTI_Mode = EXTI_Mode_Interrupt;
    // exti.EXTI_Trigger = EXTI_Trigger_Falling;
    exti.EXTI_Trigger = EXTI_Trigger_Rising_Falling;
    // exti.EXTI_Trigger = EXTI_Trigger_Rising;
    exti.EXTI_LineCmd = ENABLE;
    EXTI_Init(&exti);

    // 初始NVIC
    NVIC_InitTypeDef nvic;
    nvic.NVIC_IRQChannel = EXTI9_5_IRQn; // 由于EXTI5~EXTI9线使用同一个中断向量，这个中断向量是:EXTI9_5_IRQn
    nvic.NVIC_IRQChannelPreemptionPriority = 3;
    nvic.NVIC_IRQChannelSubPriority = 3;
    nvic.NVIC_IRQChannelCmd = ENABLE;
    NVIC_Init(&nvic);
}

void EXTI9_5_IRQHandler(void)
{
    if (EXTI_GetITStatus(EXTI_Line5) == SET) {
        if (KEY_EXTI_DOWN) {
            LED_Open();
        } else {
            LED_Close();
        }

        // USART_SendString(USART1, "key down");
        EXTI_ClearITPendingBit(EXTI_Line5);
    }
}
