#include "spi.h"



// TODO:: SPI nss(cs,ss) 片选信号, 每个SPI对应着一个片选引脚; 一般推荐使用软件片选(可以设置多个片选)
#define BufferSize 32
static const uint8_t SPI_MASTER_Buffer_Tx[BufferSize] = {0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
                                                         0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C,
                                                         0x0D, 0x0E, 0x0F, 0x10, 0x11, 0x12,
                                                         0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
                                                         0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E,
                                                         0x1F, 0x20};
static uint8_t SPI_SLAVE_Buffer_Rx[BufferSize];
static volatile uint8_t TxIdx = 0, RxIdx = 0;

static void spiInit(void);
static void gpioInit(void);
static void nvicInit(void);

void CHECK_SPI_Config(void) {
    gpioInit();
    nvicInit();
    spiInit();

    /* Enable SPI_MASTER TXE interrupt */
    // SPI_I2S_ITConfig(SPI_MASTER, SPI_I2S_IT_TXE, ENABLE);
    // SPI_I2S_ITConfig(SPI_MASTER, SPI_I2S_IT_RXNE, ENABLE);
    // SPI_I2S_ITConfig(SPI_MASTER, SPI_I2S_IT_ERR, ENABLE);
    /* Enable SPI_SLAVE RXNE interrupt */
    // SPI_I2S_ITConfig(SPI_SLAVE, SPI_I2S_IT_RXNE, ENABLE);
    // SPI_I2S_ITConfig(SPI_SLAVE, SPI_I2S_IT_ERR, ENABLE);


    SPI_Cmd(SPI_MASTER, ENABLE);
    SPI_Cmd(SPI_SLAVE, ENABLE);



    printf("%s\n", "====== CHECK_SPI_Config ======");

    while (1) {
        if (TxIdx == BufferSize) break;
        if (SPI_I2S_GetFlagStatus(SPI_MASTER, SPI_I2S_FLAG_TXE) != RESET) {
            uint8_t v = SPI_MASTER_Buffer_Tx[TxIdx++];
            printf("Master send: %0x\n", v);
            SPI_I2S_SendData(SPI_MASTER, v);
        }
        delay_ms(10);
        if (SPI_I2S_GetFlagStatus(SPI_SLAVE, SPI_I2S_FLAG_RXNE) != RESET) {
            uint8_t ele = SPI_I2S_ReceiveData(SPI_SLAVE);
            printf("SPI_I2S_ReceiveData:%d\n", ele);
            SPI_SLAVE_Buffer_Rx[RxIdx++] = ele;
        }
    }

    while (RxIdx < BufferSize) {}
    BuffercmpUint8(SPI_MASTER_Buffer_Tx, SPI_SLAVE_Buffer_Rx, BufferSize);
}

static void gpioInit(void) {
    // 使能GPIO
    RCC_GPIO_CLK();

    // 主
    GPIO_InitTypeDef gpio;
    gpio.GPIO_Pin   = SPI_MATER_GPIO_Pin;
    gpio.GPIO_Mode  = GPIO_Mode_AF_PP;
    gpio.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(SPI_MATER_GPIO, &gpio);

    // 从
    gpio.GPIO_Pin  = SPI_SLAVE_GPIO_Pin;
    gpio.GPIO_Mode = GPIO_Mode_AF_PP;
    GPIO_Init(SPI_SLAVE_GPIO, &gpio);
}

static void spiInit(void) {
    RCC_MASTER_CLK();
    RCC_SLAVE_CLK();

    SPI_InitTypeDef spi;
    spi.SPI_Direction         = SPI_Direction_2Lines_FullDuplex;  // 全双工
    spi.SPI_Mode              = SPI_Mode_Master;
    spi.SPI_DataSize          = SPI_DataSize_8b;
    spi.SPI_CPOL              = SPI_CPOL_Low;               // 空闲时SCK状态, Hith:高 Low:低
    spi.SPI_CPHA              = SPI_CPHA_1Edge;             // 时钟相位, 奇|偶数边缘采样
    spi.SPI_NSS               = SPI_NSS_Soft;               // NSS 片选,软件片选(不用MUC提供的片选引脚)
    spi.SPI_BaudRatePrescaler = SPI_BaudRatePrescaler_256;  // 预分频值
    spi.SPI_CRCPolynomial     = 7;                          // 校验和
    spi.SPI_FirstBit          = SPI_FirstBit_MSB;           // 大小端, 大端

    SPI_Init(SPI_MASTER, &spi);

    spi.SPI_Mode      = SPI_Mode_Slave;
    SPI_Init(SPI_SLAVE, &spi);
}

static void nvicInit(void) {
    NVIC_InitTypeDef nvic;
    nvic.NVIC_IRQChannel                   = SPI1_IRQn;
    nvic.NVIC_IRQChannelPreemptionPriority = 1;
    nvic.NVIC_IRQChannelSubPriority        = 2;
    nvic.NVIC_IRQChannelCmd                = ENABLE;
    NVIC_Init(&nvic);

    // nvic.NVIC_IRQChannel                   = SPI2_IRQn;
    // nvic.NVIC_IRQChannelPreemptionPriority = 0;
    // nvic.NVIC_IRQChannelSubPriority        = 2;
    // NVIC_Init(&nvic);
}



// void SPI1_IRQHandler(void) {
//     if (SPI_I2S_GetITStatus(SPI_MASTER, SPI_I2S_IT_TXE) != RESET) {
//         /* Send SPI_MASTER data */
//         SPI_I2S_SendData(SPI_MASTER, SPI_MASTER_Buffer_Tx[TxIdx++]);
//         printf("SPI_I2S_IT_TXE:%d\n", TxIdx);
//         /* Disable SPI_MASTER TXE interrupt */
//         if (TxIdx == BufferSize) {
//             SPI_I2S_ITConfig(SPI_MASTER, SPI_I2S_IT_TXE, DISABLE);
//         }
//     }

//     if (SPI_I2S_GetITStatus(SPI_MASTER, SPI_I2S_IT_ERR) != RESET) {
//         printf("%s\n", "SPI_I2S_IT_ERR");
//     }
// }

// void SPI2_IRQHandler(void) {
//     /* Store SPI_SLAVE received data */
//     if (SPI_I2S_GetITStatus(SPI_SLAVE, SPI_I2S_IT_RXNE) != RESET) {
//         uint8_t val = SPI_I2S_ReceiveData(SPI_SLAVE);
//         printf("SPI_I2S_ReceiveData: %d\n", val);
//         SPI_SLAVE_Buffer_Rx[RxIdx++] = val;
//         // SPI_I2S_ClearITPendingBit(SPI_SLAVE, SPI_I2S_IT_RXNE);
//     }
//     if (SPI_I2S_GetITStatus(SPI_SLAVE, SPI_I2S_IT_ERR) != RESET) {
//         printf("%s\n", "SPI_I2S_IT_ERR");
//     }
// }
