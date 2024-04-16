#include "stm32f10x_rcc.h"
#include "pwm.h"

void PWM_Config(void)
{
    // TIMx_CCMR  [capture compare manage registe] 比较捕获寄存器
    // OC
    // IC

    // 使能TIM3
    RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM3, ENABLE);
    // 使能GPIOA, 复用
    // RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA | RCC_APB2Periph_AFIO, ENABLE);
    // 使用默认复用功能的时候,就不必开启 AFIO 使能时钟了.

    // 重映射 pin reset map config 不需要重映射 , 当前只是复用
    // TIM4_REMAP:定时器4的重映像 (TIM4 remapping [AFIO_MAPR map registe])
    // 该位可由软件置’1’或置’0’,控制将TIM4的通道1-4映射到GPIO端口上。
    // 0:没有重映像(TIM4_CH1/PB6,TIM4_CH2/PB7,TIM4_CH3/PB8,TIM4_CH4/PB9);
    // 1:完全映像(TIM4_CH1/PD12,TIM4_CH2/PD13,TIM4_CH3/PD14,TIM4_CH4/PD15)。
    // 注:重映像不影响在PE0上的TIM4_ETR。
    // GPIO_PinRemapConfig(GPIO_Remap_TIM4, ENABLE);  //Timer4部分重映射  TIM4_CH2->PB7

    // GPIO_InitTypeDef gpio;
    // gpio.GPIO_Pin   = GPIO_Pin_6 | GPIO_Pin_7;
    // gpio.GPIO_Mode  = GPIO_Mode_AF_PP;
    // gpio.GPIO_Speed = GPIO_Speed_50MHz;
    // GPIO_Init(GPIOA, &gpio);

    // gpio.GPIO_Pin   = GPIO_Pin_0 | GPIO_Pin_1;
    // gpio.GPIO_Mode  = GPIO_Mode_AF_PP;
    // gpio.GPIO_Speed = GPIO_Speed_50MHz;
    // GPIO_Init(GPIOB, &gpio);

    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA | RCC_APB2Periph_GPIOB, ENABLE);
    GPIO_InitTypeDef gpioCtrl;

    gpioCtrl.GPIO_Pin = PWM_CTRL_GPIO_Pin;
    // gpioCtrl.GPIO_Mode = GPIO_Mode_IPU;
    gpioCtrl.GPIO_Mode = GPIO_Mode_Out_PP;
    gpioCtrl.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOA, &gpioCtrl);
    gpioCtrl.GPIO_Pin = PWM_CTRL_GPIO_Pin2;
    GPIO_Init(GPIOB, &gpioCtrl);
    PWM_Stop();

    // return

    // 完全重映射
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_AFIO | RCC_APB2Periph_GPIOC, ENABLE);
    GPIO_PinRemapConfig(GPIO_FullRemap_TIM3, ENABLE); // PC6,PC7,PC8,PC9
    GPIO_InitTypeDef gpio;

    gpio.GPIO_Pin = GPIO_Pin_6 | GPIO_Pin_7 | GPIO_Pin_8 | GPIO_Pin_9;
    gpio.GPIO_Mode = GPIO_Mode_AF_PP;
    gpio.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOC, &gpio);

    TIM_TimeBaseInitTypeDef tim;
    tim.TIM_Period = 10000 - 1;
    tim.TIM_Prescaler = 0;
    tim.TIM_ClockDivision = TIM_CKD_DIV1;
    // tim.TIM_CounterMode   = TIM_CounterMode_Up;
    tim.TIM_CounterMode = TIM_CounterMode_Down;
    TIM_TimeBaseInit(TIM3, &tim);

    TIM_OCInitTypeDef timoc;
    timoc.TIM_OCMode = TIM_OCMode_PWM2;             // 选择定时器模式:TIM脉冲宽度调制模式2
    timoc.TIM_OutputState = TIM_OutputState_Enable; // 比较输出使能
    timoc.TIM_OCPolarity = TIM_OCPolarity_High;     // 输出极性:TIM输出比较极性高
    timoc.TIM_Pulse = 0;                            // 设置初始PWM脉冲宽度为0
    TIM_OC1Init(TIM3, &timoc);

    timoc.TIM_OCMode = TIM_OCMode_PWM2;             // 选择定时器模式:TIM脉冲宽度调制模式2
    timoc.TIM_OutputState = TIM_OutputState_Enable; // 比较输出使能
    timoc.TIM_OCPolarity = TIM_OCPolarity_High;     // 输出极性:TIM输出比较极性高
    timoc.TIM_Pulse = 0;                            // 设置初始PWM脉冲宽度为0
    TIM_OC2Init(TIM3, &timoc);

    timoc.TIM_OCMode = TIM_OCMode_PWM2;             // 选择定时器模式:TIM脉冲宽度调制模式2
    timoc.TIM_OutputState = TIM_OutputState_Enable; // 比较输出使能
    timoc.TIM_OCPolarity = TIM_OCPolarity_High;     // 输出极性:TIM输出比较极性高
    // timoc.TIM_OCPolarity  = TIM_OCPolarity_Low;     //输出极性:TIM输出比较极性高 高位输出||低位输出
    timoc.TIM_Pulse = 0; // 设置初始PWM脉冲宽度为0
    // timoc.TIM_Pulse       = 1;                       //设置初始PWM脉冲宽度为 最初宽度（高电位）
    TIM_OC3Init(TIM3, &timoc);

    timoc.TIM_OCMode = TIM_OCMode_PWM2;             // 选择定时器模式:TIM脉冲宽度调制模式2
    timoc.TIM_OutputState = TIM_OutputState_Enable; // 比较输出使能
    timoc.TIM_OCPolarity = TIM_OCPolarity_High;     // 输出极性:TIM输出比较极性高
    timoc.TIM_Pulse = 0;                            // 设置初始PWM脉冲宽度为0
    TIM_OC4Init(TIM3, &timoc);

    // TIM_ICInit

    NVIC_InitTypeDef nvic;
    nvic.NVIC_IRQChannel = TIM3_IRQn;
    nvic.NVIC_IRQChannelPreemptionPriority = 2;
    nvic.NVIC_IRQChannelSubPriority = 2;
    nvic.NVIC_IRQChannelCmd = ENABLE;
    NVIC_Init(&nvic);

    TIM_ITConfig(TIM3, TIM_IT_Update, ENABLE);
    // TIM_ITConfig(TIM3, TIM_IT_CC1, ENABLE);
    TIM_ARRPreloadConfig(TIM3, ENABLE);
    TIM_OC1PreloadConfig(TIM3, TIM_OCPreload_Enable);
    TIM_OC2PreloadConfig(TIM3, TIM_OCPreload_Enable);
    TIM_OC3PreloadConfig(TIM3, TIM_OCPreload_Enable);
    TIM_OC4PreloadConfig(TIM3, TIM_OCPreload_Enable);

    TIM_Cmd(TIM3, ENABLE);
}

void TIM3_IRQHandler()
{
    // static u16 d;
    // char dstr[20];

    if (TIM_GetITStatus(TIM3, TIM_IT_Update) == SET) {
        // d++;
        // sprintf(dstr, "%d", d);  //将d 保留2位小数赋值给dstr
        // OLED_ShowTest(0, 6, dstr);
        TIM_ClearITPendingBit(TIM3, TIM_IT_Update);
    }
}

void PWM_Stop(void)
{
    GPIO_ResetBits(GPIOA, PWM_CTRL_GPIO_Pin);
    GPIO_ResetBits(GPIOB, PWM_CTRL_GPIO_Pin2);
}

void PWM_Go(void)
{
    // 后-右
    GPIO_SetBits(GPIOA, GPIO_Pin_0);
    GPIO_ResetBits(GPIOA, GPIO_Pin_1);
    // 前-右
    GPIO_SetBits(GPIOA, GPIO_Pin_2);
    GPIO_ResetBits(GPIOA, GPIO_Pin_3);
    // 前-左
    GPIO_ResetBits(GPIOB, GPIO_Pin_8);
    GPIO_SetBits(GPIOB, GPIO_Pin_9);
    // 后-左
    GPIO_ResetBits(GPIOA, GPIO_Pin_6);
    GPIO_SetBits(GPIOA, GPIO_Pin_7);
}

void PWM_Back(void)
{
    // 后-右
    GPIO_ResetBits(GPIOA, GPIO_Pin_0);
    GPIO_SetBits(GPIOA, GPIO_Pin_1);
    // 前-右
    GPIO_ResetBits(GPIOA, GPIO_Pin_2);
    GPIO_SetBits(GPIOA, GPIO_Pin_3);
    // 前-左
    GPIO_SetBits(GPIOB, GPIO_Pin_8);
    GPIO_ResetBits(GPIOB, GPIO_Pin_9);
    // 后-左
    GPIO_SetBits(GPIOA, GPIO_Pin_6);
    GPIO_ResetBits(GPIOA, GPIO_Pin_7);
}

void PWM_Left(void)
{
    PWM_Go();
    // 前-左
    GPIO_SetBits(GPIOB, GPIO_Pin_8);
    GPIO_ResetBits(GPIOB, GPIO_Pin_9);
}

void PWM_Right(void)
{
    PWM_Go();
    // 前-右
    // GPIO_ResetBits(GPIOA, GPIO_Pin_2);
    // GPIO_SetBits(GPIOA, GPIO_Pin_3);
    GPIO_ResetBits(GPIOA, GPIO_Pin_0);
    GPIO_SetBits(GPIOA, GPIO_Pin_1);
}
