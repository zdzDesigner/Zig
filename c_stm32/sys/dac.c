#include "dac.h"

#include "sys.h"


void DAC_Config(void) {
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);

    GPIO_InitTypeDef gpio;
    gpio.GPIO_Pin   = GPIO_Pin_4;
    gpio.GPIO_Mode  = GPIO_Mode_AIN;
    // gpio.GPIO_Mode  = GPIO_Mode_Out_PP;
    gpio.GPIO_Speed = GPIO_Speed_50MHz;

    GPIO_Init(GPIOA, &gpio);
    GPIO_SetBits(GPIOA, GPIO_Pin_4);
    // GPIO_PinRemapConfig
    // return
    // DAC
    RCC_APB1PeriphClockCmd(RCC_APB1Periph_DAC, ENABLE);

    DAC_InitTypeDef dac;
    dac.DAC_Trigger                      = DAC_Trigger_None;
    dac.DAC_WaveGeneration               = DAC_WaveGeneration_None;
    dac.DAC_LFSRUnmask_TriangleAmplitude = DAC_LFSRUnmask_Bit0;
    dac.DAC_OutputBuffer                 = DAC_OutputBuffer_Disable;

    DAC_Init(DAC_Channel_1, &dac);
    DAC_Cmd(DAC_Channel_1, ENABLE);
    DAC_SetChannel1Data(DAC_Align_12b_R, 0);
    // DAC_SetDualChannelData()


    
}