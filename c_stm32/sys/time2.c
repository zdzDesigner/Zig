#include "sys.h"

void TIME2_Init(u16 arr, u16 psc) {
    // 配置使能定时器时钟
    RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2, ENABLE);

    // 初始化定时器
    TIM_TimeBaseInitTypeDef tim;
    tim.TIM_Prescaler     = psc - 1;
    tim.TIM_Period        = arr - 1;
    tim.TIM_ClockDivision = 0;
    // tim.TIM_CounterMode   = TIM_CounterMode_Up;
    tim.TIM_CounterMode = TIM_CounterMode_Up;
    TIM_TimeBaseInit(TIM2, &tim);

    // 定时器中断更新或禁止
    TIM_ITConfig(TIM2, TIM_IT_Update, ENABLE);
    // 先清零不会直接触发中断
    // TIM_ClearITPendingBit(TIM2, TIM_IT_Update);

    // NVIC配置
    NVIC_InitTypeDef nvic;
    nvic.NVIC_IRQChannel                   = TIM2_IRQn;
    nvic.NVIC_IRQChannelPreemptionPriority = 2;
    nvic.NVIC_IRQChannelSubPriority        = 2;
    nvic.NVIC_IRQChannelCmd                = ENABLE;
    NVIC_Init(&nvic);

    // 使能定时器
    TIM_Cmd(TIM2, ENABLE);
    // TIM_ClearFlag(TIM2, TIM_FLAG_Update);
}

// // 中断执行体
// void TIM2_IRQHandler(void) {
//     // static u8 i = 1;
//     // 判断中断状态
//     if (TIM_GetITStatus(TIM2, TIM_IT_Update) != RESET) {
//         // LED_Toggle(i);
//         // i ^= 1;
//         // if (i == 1) {
//         //     LED_Toggle(i);
//         //     i = 0;
//         // } else {
//         //     LED_Toggle(i);
//         //     i = 1;
//         // }
//         // printf("--TIM2--");
//         USART_SendString(USART1, "--TIM2--");
//         // 清除状态
//         TIM_ClearITPendingBit(TIM2, TIM_IT_Update);
//     }
// }