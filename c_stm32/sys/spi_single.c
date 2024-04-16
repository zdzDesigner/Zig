#include "spi_single.h"

#include "sys.h"


/* Private define ------------------------------------------------------------*/
#define BufferSize 32

/* Private macro -------------------------------------------------------------*/
/* Private variables ---------------------------------------------------------*/

static uint8_t SPI_MASTER_Buffer_Tx[BufferSize] = {0x01, 0x02, 0x03, 0x04, 0x05, 0x06,
                                                   0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C,
                                                   0x0D, 0x0E, 0x0F, 0x10, 0x11, 0x12,
                                                   0x13, 0x14, 0x15, 0x16, 0x17, 0x18,
                                                   0x19, 0x1A, 0x1B, 0x1C, 0x1D, 0x1E,
                                                   0x1F, 0x20};
static uint8_t SPI_SLAVE_Buffer_Rx[BufferSize];
volatile uint8_t TxId = 0, RxId = 0;


static uint8_t spiRW(SPI_TypeDef* spi, uint8_t dat);

/* Private functions ---------------------------------------------------------*/
static void RCC_Configuration(void);
static void GPIO_Configuration(void);
static void NVIC_Configuration(void);


void CHECK_SPI_SINGLE_Config(void) {
    RCC_Configuration();
    /* NVIC configuration ------------------------------------------------------*/
    // NVIC_Configuration();
    GPIO_Configuration();

    SPI_InitTypeDef spi;
    spi.SPI_Direction = SPI_Direction_2Lines_FullDuplex;
    // spi.SPI_Direction = SPI_Direction_1Line_Tx; // TODO::单线有问题
    spi.SPI_Mode              = SPI_Mode_Master;
    spi.SPI_DataSize          = SPI_DataSize_8b;
    spi.SPI_CPOL              = SPI_CPOL_Low;
    spi.SPI_CPHA              = SPI_CPHA_2Edge;
    spi.SPI_NSS               = SPI_NSS_Soft;
    spi.SPI_BaudRatePrescaler = SPI_BaudRatePrescaler_16;
    spi.SPI_FirstBit          = SPI_FirstBit_MSB;
    spi.SPI_CRCPolynomial     = 7;
    SPI_Init(SPI_MASTER, &spi);

    /* SPI_SLAVE configuration*/
    spi.SPI_Mode = SPI_Mode_Slave;
    SPI_Init(SPI_SLAVE, &spi);

    // /* Enable SPI_MASTER TXE interrupt */
    // SPI_I2S_ITConfig(SPI_MASTER, SPI_I2S_IT_TXE, ENABLE);
    // SPI_I2S_ITConfig(SPI_MASTER, SPI_I2S_IT_RXNE, ENABLE);
    // /* Enable SPI_SLAVE RXNE interrupt */
    // SPI_I2S_ITConfig(SPI_SLAVE, SPI_I2S_IT_RXNE, ENABLE);

    /* Enable SPI_SLAVE */
    SPI_Cmd(SPI_SLAVE, ENABLE);
    /* Enable SPI_MASTER */
    SPI_Cmd(SPI_MASTER, ENABLE);
    printf("%s\n", "========= CHECK_SPI_SINGLE_Config =========");
    // delay_ms(1000);
    // delay_ms(1000);
    // TraceElementU8(SPI_SLAVE_Buffer_Rx, BufferSize, "SPI_SLAVE_Buffer_Rx");
    /* Transfer procedure */


    while (1) {
        if (TxId == BufferSize) break;
        // 方式一
        // uint8_t v = SPI_MASTER_Buffer_Tx[TxId++];
        // printf("Master send: %0x\n", v);
        // spiRW(SPI_MASTER, v);
        // SPI_SLAVE_Buffer_Rx[RxId++] = spiRW(SPI_SLAVE, 0);

        // 方式二
        if (SPI_I2S_GetFlagStatus(SPI_MASTER, SPI_I2S_FLAG_TXE) != RESET) {
            uint8_t v = SPI_MASTER_Buffer_Tx[TxId++];
            printf("Master send: %0x\n", v);
            SPI_I2S_SendData(SPI_MASTER, v);
        }
        delay_ms(1);
        if (SPI_I2S_GetFlagStatus(SPI_SLAVE, SPI_I2S_FLAG_RXNE) != RESET) {
            uint8_t ele = SPI_I2S_ReceiveData(SPI_SLAVE);
            printf("SPI_I2S_ReceiveData:%d\n", ele);
            SPI_SLAVE_Buffer_Rx[RxId++] = ele;
        }
    }

    while (RxId < BufferSize) {}
    uint8_t equal = BuffercmpUint8(SPI_MASTER_Buffer_Tx, SPI_SLAVE_Buffer_Rx, BufferSize);
    printf("equal: %d\n", equal);
}

static void RCC_Configuration(void) {
    /* Enable SPI_MASTER clock and GPIO clock for SPI_MASTER and SPI_SLAVE */
    RCC_APB2PeriphClockCmd(SPI_MASTER_GPIO_CLK | SPI_SLAVE_GPIO_CLK | SPI_MASTER_CLK, ENABLE);
    /* Enable SPI_SLAVE Periph clock */
    RCC_APB1PeriphClockCmd(SPI_SLAVE_CLK, ENABLE);
}

static void GPIO_Configuration(void) {
    GPIO_InitTypeDef gpio;

    /* Configure SPI_MASTER pins: SCK and MOSI ---------------------------------*/
    /* Configure SCK and MOSI pins as Alternate Function Push Pull */
    gpio.GPIO_Pin   = SPI_MASTER_PIN_SCK | SPI_MASTER_PIN_MOSI;
    gpio.GPIO_Speed = GPIO_Speed_50MHz;
    gpio.GPIO_Mode  = GPIO_Mode_AF_PP;
    GPIO_Init(SPI_MASTER_GPIO, &gpio);

    /* Configure SPI_SLAVE pins: SCK and MISO ---------------------------------*/
    /* Configure SCK and MOSI pins as Input Floating */
    // gpio.GPIO_Pin  = SPI_SLAVE_PIN_SCK;
    // gpio.GPIO_Mode = GPIO_Mode_IN_FLOATING;
    // GPIO_Init(SPI_SLAVE_GPIO, &gpio);
    /* Configure MISO pin as Alternate Function Push Pull */
    gpio.GPIO_Pin  = SPI_SLAVE_PIN_SCK | SPI_SLAVE_PIN_MISO;
    gpio.GPIO_Mode = GPIO_Mode_AF_PP;
    GPIO_Init(SPI_SLAVE_GPIO, &gpio);
}

void NVIC_Configuration(void) {
    NVIC_InitTypeDef nvic;


    /* Configure and enable SPI_MASTER interrupt -------------------------------*/
    nvic.NVIC_IRQChannel                   = SPI_MASTER_IRQn;
    nvic.NVIC_IRQChannelPreemptionPriority = 1;
    nvic.NVIC_IRQChannelSubPriority        = 2;
    nvic.NVIC_IRQChannelCmd                = ENABLE;
    NVIC_Init(&nvic);

    /* Configure and enable SPI_SLAVE interrupt --------------------------------*/
    // nvic.NVIC_IRQChannel                   = SPI_SLAVE_IRQn;
    // nvic.NVIC_IRQChannelPreemptionPriority = 0;
    // nvic.NVIC_IRQChannelSubPriority        = 1;
    // NVIC_Init(&nvic);
}


void SPI1_IRQHandler(void) {
    if (SPI_I2S_GetITStatus(SPI_MASTER, SPI_I2S_IT_TXE) != RESET) {
        /* Send SPI_MASTER data */
        uint8_t ele = SPI_MASTER_Buffer_Tx[TxId++];
        SPI_I2S_SendData(SPI_MASTER, ele);
        printf("SPI_I2S_IT_TXE:%d\n", ele);
        /* Disable SPI_MASTER TXE interrupt */
        if (TxId == BufferSize) {
            SPI_I2S_ITConfig(SPI_MASTER, SPI_I2S_IT_TXE, DISABLE);
        }
    }

    // if (SPI_I2S_GetITStatus(SPI_MASTER, SPI_I2S_IT_RXNE) != RESET) {
    //     printf("SPI_I2S_IT_RXNE\n");
    // }
}

/**
  * @brief  This function handles SPI2 global interrupt request.
  * @param  None
  * @retval None
  */
void SPI2_IRQHandler(void) {
    /* Store SPI_SLAVE received data */
    if (SPI_I2S_GetITStatus(SPI_SLAVE, SPI_I2S_IT_RXNE) != RESET) {
        uint8_t ele = SPI_I2S_ReceiveData(SPI_SLAVE);
        printf("SPI_I2S_ReceiveData:%d\n", ele);
        SPI_SLAVE_Buffer_Rx[RxId++] = ele;
    }
}


/**
  * 用于向NRF读/写一字节数据
  */
static uint8_t spiRW(SPI_TypeDef* spi, uint8_t dat) {
    /* 当 SPI发送缓冲器非空时等待 */
    while (SPI_I2S_GetFlagStatus(spi, SPI_I2S_FLAG_TXE) == RESET) {}

    /* 通过 spi发送一字节数据 */
    SPI_I2S_SendData(spi, dat);

    /* 当SPI接收缓冲器为空时等待 */
    while (SPI_I2S_GetFlagStatus(spi, SPI_I2S_FLAG_RXNE) == RESET) {}

    /* Return the byte read from the SPI bus */
    uint8_t ret = SPI_I2S_ReceiveData(spi);
    return ret;
}