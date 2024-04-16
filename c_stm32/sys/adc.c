#include "adc.h"
#include "stm32f10x.h"
#include "stm32f10x_dma.h"

// !! ADC_Channel_4 规则通道和GPIO关系 GPIO_Pin_4

#define LENGTH           2
#define ADC_DMA_BUF_SIZE 200
#define BUFFER_SIZE      LENGTH *ADC_DMA_BUF_SIZE
// #define BUFFER_SIZE ADC_DMA_BUF_SIZE
uint16_t ADC_DMA_BUF[ADC_DMA_BUF_SIZE][LENGTH];
// uint16_t ADC_DMA_BUF[ADC_DMA_BUF_SIZE];

// Scaler   scaler;
uint16_t ADC_VAL[2] = {0, 0};

static void gpioInit(void);
static void adcInit(void);
static void nvicDmaInit(void);
static void nvicInit(void);
static void dmaInit(void);

void ADC_Config(void)
{
    gpioInit();
    nvicInit();
    dmaInit();
    adcInit();
    // ADC_ITConfig(ADC1, ADC_IT_EOC, ENABLE);

    // scaler = ScalerInit(0, 18000, 1740, 2400);

    // printf("\nesp8366 demo =========xxx====\n");
    // while (1) {
    //     //由于没有使用外部触发，所以使用软件触发ADC转换
    //     ADC_SoftwareStartConvCmd(ADC1, ENABLE);
    //     delay_ms(10);
    //     /* code */
    //     printf("---%d\n", DMA_GetCurrDataCounter(DMA1_Channel1));

    //     if (DMA_GetCurrDataCounter(DMA1_Channel1) == 0) {
    //         uint8_t i = 0;
    //         for (; i < ADC_DMA_BUF_SIZE; i++) {
    //             // printf("1:%d\r\n", ADC_DMA_BUF[i]);  //打印
    //             printf("%d:%d，2:%d\r\n", i, ADC_DMA_BUF[i][0], ADC_DMA_BUF[i][1]);  //打印
    //         }
    //         MYDMA_Enable();  //开始一次DMA传输！
    //     }
    // }
}

static void gpioInit(void)
{
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);
    GPIO_InitTypeDef gpio;
    gpio.GPIO_Pin = GPIO_Pin_4 | GPIO_Pin_5; // 通道要和gpio口匹配, 类似外部事件
    /* gpio.GPIO_Pin  = GPIO_Pin_4 ;  // 通道要和gpio口匹配, 类似外部事件 */
    /* gpio.GPIO_Pin  = GPIO_Pin_5;  // 通道要和gpio口匹配, 类似外部事件 */
    gpio.GPIO_Mode = GPIO_Mode_AIN;
    GPIO_Init(GPIOA, &gpio);
}

static void adcInit(void)
{
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_ADC1, ENABLE);
    // RCC->CFGR&=~(3<<14);RCC->CFGR|=2<<14; 6分频ADC时钟为12M
    RCC_ADCCLKConfig(RCC_PCLK2_Div6); // 设置分频, ADC1的时钟不大于14MHz
    ADC_DeInit(ADC1);                 // ADC1复位 // RCC->APB2RSTR|=1<<9;

    ADC_InitTypeDef adc;
    adc.ADC_Mode         = ADC_Mode_Independent; // 独立模式; // ADC1->CR1&=0XF0FFFF;ADC1->CR1|=0<<16;
    adc.ADC_ScanConvMode = ENABLE;               // 单通道:DISABLE, 多通道:ENABLE; // ADC1->CR1&=~(1<<8);
    // adc.ADC_ScanConvMode = DISABLE;                // 单通道:DISABLE, 多通道:ENABLE; ADC1->CR1&=~(1<<8);
    // TODO::连续转换会导致数据错乱问题（2020-09-06）
    // adc.ADC_ContinuousConvMode = DISABLE;  // 单次转换:DISABLE, 连续转换:ENABLE; // ADC1->CR2&=~(1<<1);
    // adc.ADC_ContinuousConvMode = DISABLE;                 // 单次转换:DISABLE, 连续转换:ENABLE;  // ADC1->CR2&=~(1<<1); 需要每次主动启动 ADC_SoftwareStartConvCmd
    adc.ADC_ContinuousConvMode = ENABLE;                    // 单次转换:DISABLE, 连续转换:ENABLE;  // ADC1->CR2&=~(1<<1); 需要每次主动启动 ADC_SoftwareStartConvCmd
    adc.ADC_ExternalTrigConv   = ADC_ExternalTrigConv_None; // 外部触发模式, 当前为软件触发; ADC1->CR2&=~(7<<17);ADC1->CR2|=7<<17;软件控制转换 ADC1->CR2|=1<<20;
    // adc.ADC_ExternalTrigConv = ADC_ExternalTrigInjecConv_None;  // 外部触发模式, 当前为软件触发; ADC1->CR2&=~(7<<17);ADC1->CR2|=7<<17;软件控制转换 ADC1->CR2|=1<<20;
    adc.ADC_DataAlign    = ADC_DataAlign_Right; // 数据对齐方式:左:高位在前, 右:低位在前; ADC1->CR2&=~(1<<11);
    adc.ADC_NbrOfChannel = 2;                   // 顺序进行规则转换的ADC通道的数目1 ADC1->SQR1&=~(0XF<<20); ADC1->SQR1|=0<<20;
    ADC_Init(ADC1, &adc);

    // 添加到规则通道
    // ADC_RegularChannelConfig(ADC1, ADC_Channel_4, 1, ADC_SampleTime_239Cycles5);
    // ADC_RegularChannelConfig(ADC1, ADC_Channel_5, 2, ADC_SampleTime_239Cycles5);
    ADC_RegularChannelConfig(ADC1, ADC_Channel_4, 1, ADC_SampleTime_55Cycles5);
    ADC_RegularChannelConfig(ADC1, ADC_Channel_5, 2, ADC_SampleTime_55Cycles5);

    ADC_DMACmd(ADC1, ENABLE); // TODO::开启ADC_DMA
    ADC_Cmd(ADC1, ENABLE);    // 使能ADC1 ADC1->CR2|=0;

    // 使能指定的ADC1的软件转换启动功能 ADC1->CR2|=1<<22;
    // 复位
    ADC_ResetCalibration(ADC1);                    // 使能复位校准     // ADC1->CR2|=1<<3;
    while (ADC_GetResetCalibrationStatus(ADC1)) {} // 等待复位校准结束 // while(ADC1->CR2&1<<3)
    ADC_StartCalibration(ADC1);                    // 开启AD校准       // ADC1->CR2|=1<<2;
    while (ADC_GetCalibrationStatus(ADC1)) {}      // 等待校准结束     // while(ADC1->CR2&1<<2)
    ADC_SoftwareStartConvCmd(ADC1, ENABLE);
}

static void dmaInit(void)
{
    RCC_AHBPeriphClockCmd(RCC_AHBPeriph_DMA1, ENABLE);
    DMA_DeInit(DMA1_Channel1);

    DMA_InitTypeDef dma;
    dma.DMA_PeripheralBaseAddr = (uint32_t)&ADC1->DR; // 外设地址
    dma.DMA_MemoryBaseAddr     = (uint32_t)ADC_DMA_BUF;
    dma.DMA_DIR                = DMA_DIR_PeripheralSRC;
    dma.DMA_Mode               = DMA_Mode_Circular;
    // dma.DMA_Mode               = DMA_Mode_Normal;
    dma.DMA_BufferSize         = BUFFER_SIZE;
    dma.DMA_PeripheralDataSize = DMA_PeripheralDataSize_HalfWord;
    dma.DMA_MemoryDataSize     = DMA_MemoryDataSize_HalfWord;
    dma.DMA_PeripheralInc      = DMA_PeripheralInc_Disable;
    dma.DMA_MemoryInc          = DMA_MemoryInc_Enable;
    dma.DMA_Priority           = DMA_Priority_Medium;
    dma.DMA_M2M                = DMA_M2M_Disable;

    DMA_Init(DMA1_Channel1, &dma);
    // DMA_ITConfig(DMA1_Channel1, DMA_IT_TC, ENABLE); // 这里是正确的(DMA_IT_TC), 原因可查看dma.c文件
    // DMA_ClearITPendingBit(DMA_IT_TC);
    DMA_Cmd(DMA1_Channel1, ENABLE);
}

static void nvicInit(void)
{
    NVIC_InitTypeDef nvic;
    nvic.NVIC_IRQChannel                   = DMA1_Channel1_IRQn;
    nvic.NVIC_IRQChannelPreemptionPriority = 2;
    nvic.NVIC_IRQChannelSubPriority        = 2;
    nvic.NVIC_IRQChannelCmd                = ENABLE;
    NVIC_Init(&nvic);
}

uint16_t ADC_ReadCh(uint8_t ch)
{

    uint16_t adc_value = 0;

    // uint8_t rank = 2;
    // if (ch == ADC_Channel_4) rank = 1;
    // if (ch == ADC_Channel_5) rank = 2;

    ADC_RegularChannelConfig(ADC1, ch, 1, ADC_SampleTime_7Cycles5); // 设置ADC1通道ch的转换周期为7.5个采样周期，采样次序为1
    // ADC_RegularChannelConfig(ADC1, ch, 1, ADC_SampleTime_55Cycles5); // 设置ADC1通道ch的转换周期为7.5个采样周期，采样次序为1
    // ADC_RegularChannelConfig(ADC1, ch, 1, ADC_SampleTime_239Cycles5 );   //设置ADC1通道ch的转换周期为7.5个采样周期，采样次序为1 */

    // ADC_SoftwareStartConvCmd(ADC1, ENABLE); // !!单次转换转换时，这里需要主动开启,使能软件触发

    while (!ADC_GetFlagStatus(ADC1, ADC_FLAG_EOC)) {}; // 等待转换完成

    adc_value = ADC_GetConversionValue(ADC1); // 获取转换值

    return adc_value;
}

uint16_t ADC_Read()
{
    ADC_SoftwareStartConvCmd(ADC1, ENABLE);           // 使能指定的ADC1的软件转换启动功能 ADC1->CR2|=1<<22;
    while (!ADC_GetFlagStatus(ADC1, ADC_FLAG_EOC)) {} // 等待转换结束 while(!(ADC1->SR&1<<1))
    ADC_ClearFlag(ADC1, ADC_FLAG_EOC);
    return ADC_GetConversionValue(ADC1); // ADC1->DR
}

void ADC_DMA_Avg()
{
    uint16_t i = 0;
    uint16_t htemp[ADC_DMA_BUF_SIZE];
    uint16_t vtemp[ADC_DMA_BUF_SIZE];
    for (i; i < ADC_DMA_BUF_SIZE; i++) {
        *(htemp + i) = ADC_DMA_BUF[i][0];
        *(vtemp + i) = ADC_DMA_BUF[i][1];
        // printf("%d,%d\n", ADC_DMA_BUF[i][0], ADC_DMA_BUF[i][1]);
    }
    ADC_VAL[0] = avg(htemp, ADC_DMA_BUF_SIZE);
    ADC_VAL[1] = avg(vtemp, ADC_DMA_BUF_SIZE);
    // printf("%d,%d\n", ADC_VAL[0], ADC_VAL[1]);
    memset(ADC_DMA_BUF, 0, BUFFER_SIZE); // 清空数组
}

// 手动控制DMA转换
// 1.DMA_Cmd(DMA1_Channel1, DISABLE)  先失能
// 2.DMA_Cmd(DMA1_Channel1, ENABLE)   再使能
void MYDMA_Enable(void)
{
    // // 错乱问题，先关闭再开启
    // // ADC_SoftwareStartConvCmd(ADC1, DISABLE);
    // DMA_Cmd(DMA1_Channel1, DISABLE); // 关闭USART1 TX DMA1 所指示的通道
    // // printf("%d\n",scaler.conv(&scaler, avg(ADC_DMA_BUF,ADC_DMA_BUF_SIZE)));
    //
    // DMA_SetCurrDataCounter(DMA1_Channel1, BUFFER_SIZE); // 从新设置缓冲大小,指向数组0
    // // ADC_SoftwareStartConvCmd(ADC1, ENABLE);
    // DMA_Cmd(DMA1_Channel1, ENABLE); // 使能USART1 TX DMA1 所指示的通道
    //
    // while (DMA_GetFlagStatus(DMA1_FLAG_TC1)) {}; // 等待搬运完成
    // DMA_ClearFlag(DMA1_FLAG_TC1);                // 清除标志位

    // printf("%d,%d\n", ADC_VAL[0], ADC_VAL[1]);

    // uint16_t i = 0;
    // for (i; i < ADC_DMA_BUF_SIZE; i++) {
    //     // printf("%d,%d\n", ADC_DMA_BUF[i], ADC_DMA_BUF[i]);
    //     if (i % 2 == 0) {
    //         printf("%d\n", ADC_DMA_BUF[i]);
    //     }
    // }

    // for (i; i < ADC_DMA_BUF_SIZE; i++) {
    //     printf("%d,%d\n", ADC_DMA_BUF[i][0], ADC_DMA_BUF[i][1]);
    // }

    // printf("dma ok\n");
}

u16 ADC_AVG_ReadCh(uint8_t ch, u16 times)
{
    u32 total = 0;
    u16 max   = 0;
    u16 min   = 1 << 15;
    u16 cur   = 0;
    u16 t;
    for (t = 0; t < times; t++) {
        cur = ADC_ReadCh(ch);
        if (cur > max) {
            max = cur;
        }
        if (cur < min) {
            min = cur;
        }
        total += cur;
        delay_us(20);
    }
    /* OLED_ShowNum(0, 1, max, 2, 20); */
    /* OLED_ShowNum(0, 3, min, 2, 20); */
    /* OLED_ShowNum(36, 1, (max + min) / 2, 2, 20); */
    return (total - max - min) / (times - 2);
}
u16 ADC_AVG_Read(u16 times)
{
    u32 total = 0;
    u16 max   = 0;       // 设置最小值，大于时替换
    u16 min   = 1 << 15; // 设置最大值，方便小于时替换
    u16 cur   = 0;
    u16 t;
    for (t = 0; t < times; t++) {
        cur = ADC_Read();
        if (cur > max) {
            max = cur;
        }
        if (cur < min) {
            min = cur;
        }
        total += cur;
        delay_us(200);
    }
    /* OLED_ShowNum(0, 1, max, 2, 20); */
    /* OLED_ShowNum(0, 3, min, 2, 20); */
    /* OLED_ShowNum(36, 1, (max + min) / 2, 2, 20); */
    return (total - max - min) / (times - 2);
}

void ADC1_2_IRQHandler(void)
{
    // printf("ADC1_2_IRQHandler\n");
    if (ADC_GetITStatus(ADC1, ADC_IT_EOC) == SET) {
        // printf("IRQ: %d\n", ADC_GetConversionValue(ADC1));
    }
    ADC_ClearITPendingBit(ADC1, ADC_IT_EOC);
}

void DMA1_Channel1_IRQHandler(void)
{
    if (DMA_GetITStatus(DMA1_IT_TC1) != RESET) {
        // printf("%d\n", DMA_GetCurrDataCounter(DMA1_Channel1));

        MYDMA_Enable(); // 开始一次DMA传输！
        DMA_ClearITPendingBit(DMA1_IT_TC1);
    }
}
