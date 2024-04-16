#include "dma.h"

#include "sys.h"

// TODO:: 因为有多个通道所以使能中断用的是 DMA_IT_TC(所有通道共用) , 中断中监听的 DMAx_IT_TCx 这个
// TODO:: 原因如下: 在中断使能时 DMA_ITConfig 第一个参数就是具体通道, 而在中断监听时DMA_GetITStatus 参数中没有通道选择
// TODO:: 设计: 为了保证 XX_GetITStatus 中断参数的一致性, 所以多通道中断都要注意这点

#define BUFFER_SIZE 32

// static uint8_t FLAG_TC = 0;

// 目标 存放到 SRAM 中
uint32_t DST_Buffer[BUFFER_SIZE];



/**
 * 源数据
 * const 关键字使得数据存放到flash中
 */
const uint32_t SRC_Buffer[BUFFER_SIZE] = {
    0x01020304, 0x05060708, 0x090A0B0C, 0x0D0E0F10,
    0x11121314, 0x15161718, 0x191A1B1C, 0x1D1E1F20,
    0x21222324, 0x25262728, 0x292A2B2C, 0x2D2E2F30,
    0x31323334, 0x35363738, 0x393A3B3C, 0x3D3E3F40,
    0x41424344, 0x45464748, 0x494A4B4C, 0x4D4E4F50,
    0x51525354, 0x55565758, 0x595A5B5C, 0x5D5E5F60,
    0x61626364, 0x65666768, 0x696A6B6C, 0x6D6E6F70,
    0x71727374, 0x75767778, 0x797A7B7C, 0x7D7E7F80};


void DMA_M2M_Config(void) {
    RCC_AHBPeriphClockCmd(M2M_DMA_CLK, ENABLE);

    DMA_DeInit(M2M_DMA_CHANNEL);

    DMA_InitTypeDef dma;
    // 源地址
    dma.DMA_PeripheralBaseAddr = (uint32_t)SRC_Buffer;
    // 目标地址
    dma.DMA_MemoryBaseAddr = (uint32_t)DST_Buffer;
    // 方向 外设到内存
    dma.DMA_DIR = DMA_DIR_PeripheralSRC;
    // 模式: 不循环
    dma.DMA_Mode = DMA_Mode_Normal;

    // 大小
    dma.DMA_BufferSize         = BUFFER_SIZE;
    dma.DMA_PeripheralDataSize = DMA_PeripheralDataSize_Word;
    dma.DMA_MemoryDataSize     = DMA_MemoryDataSize_Word;
    // 外设自增
    dma.DMA_PeripheralInc = DMA_PeripheralInc_Enable;
    // 内存自增
    dma.DMA_MemoryInc = DMA_MemoryInc_Enable;
    // 优先级
    dma.DMA_Priority = DMA_Priority_High;
    // 是否内存到内存
    dma.DMA_M2M = DMA_M2M_Enable;

    DMA_ITConfig(M2M_DMA_CHANNEL, DMA_IT_TC, ENABLE);  // 这里注意: 是 DMA_IT_TC; 不是 DMA1_IT_TCx
    DMA_ITConfig(M2M_DMA_CHANNEL, DMA_IT_HT, ENABLE);
    DMA_ITConfig(M2M_DMA_CHANNEL, DMA_IT_TE, ENABLE);

    DMA_Init(M2M_DMA_CHANNEL, &dma);
    DMA_ClearFlag(DMA_FLAG_TCx);
    DMA_Cmd(M2M_DMA_CHANNEL, ENABLE);
}

void DMA_NVIC_Config() {
    NVIC_InitTypeDef nvic;
    nvic.NVIC_IRQChannel                   = DMA_IRQn;
    nvic.NVIC_IRQChannelPreemptionPriority = 1;
    nvic.NVIC_IRQChannelSubPriority        = 1;
    nvic.NVIC_IRQChannelCmd                = ENABLE;
    NVIC_Init(&nvic);
}

void DMA_M2M_Demo(void) {
    DMA_M2M_Config();
    DMA_NVIC_Config();
    printf("%s\n", "========== DMA_M2M_Demo ==========");
    /* 等待DMA传输完成 */
    // while (DMA_GetFlagStatus(DMA_FLAG_TCx) == RESET) {}
    // uint8_t TransferStatus = Buffercmp(SRC_Buffer, DST_Buffer, BUFFER_SIZE);
    //     printf("TransferStatus: %d\n", TransferStatus);
}

// void DMA1_Channel2_IRQHandler(void) {
//     if (DMA_GetITStatus(DMA_IT_TCx) == SET) {
//         /* 比较源数据与传输后数据 */
//         uint8_t TransferStatus = Buffercmp(SRC_Buffer, DST_Buffer, BUFFER_SIZE);
//         printf("TransferStatus: %d\n", TransferStatus);
//         DMA_ClearITPendingBit(DMA_IT_TCx);
//     }
//     if (DMA_GetITStatus(DMA_IT_HTx) == SET) {
//         /* 比较源数据与传输后数据 */
//         printf("DMA_IT_HTx\n");
//         DMA_ClearITPendingBit(DMA_IT_HTx);
//     }

//     if (DMA_GetITStatus(DMA_IT_TEx) == SET) {
//         /* 比较源数据与传输后数据 */
//         printf("DMA_IT_TEx\n");
//         DMA_ClearITPendingBit(DMA_IT_TEx);
//     }
// }