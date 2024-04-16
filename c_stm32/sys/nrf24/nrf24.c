#include "nrf24.h"
/**
 * SCK  --- SCK
 * MOSI --- MOSI
 * MISO --- MISO
 * SE   --- GPIO
 * CSN  --- GPIO
 * VCC  --- VCC
 * GND  --- GND
 * IRQ  --- IN GPIO
 *
 * 发送模式和接收模式由 nrf中的寄存器控制
 */
uint8_t RX_BUF[RX_PLOAD_WIDTH];                                    // 接收数据缓存
uint8_t TX_BUF[TX_PLOAD_WIDTH];                                    // 发射数据缓存
uint8_t TX_ADDRESS[TX_ADR_WIDTH] = {0x34, 0x43, 0x10, 0x10, 0x01}; // 定义一个静态发送地址
uint8_t RX_ADDRESS[RX_ADR_WIDTH] = {0x34, 0x43, 0x10, 0x10, 0x01};

static void nrf24GpioInit(void);
static void spiGpioInit(void);
static void spiInit(void);

void NRF24_Config(void)
{
    nrf24GpioInit();
    spiInit();
}

static void nrf24GpioInit(void)
{
    spiGpioInit();
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);
}

static void spiGpioInit(void)
{
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB, ENABLE);

    GPIO_InitTypeDef gpio;
    gpio.GPIO_Pin   = GPIO_Pin_13 | GPIO_Pin_15; // (SCK|MOSI)
    gpio.GPIO_Mode  = GPIO_Mode_AF_PP;
    gpio.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOB, &gpio);

    gpio.GPIO_Pin  = GPIO_Pin_14; // MISO
    gpio.GPIO_Mode = GPIO_Mode_IN_FLOATING;
    GPIO_Init(GPIOB, &gpio);

    gpio.GPIO_Pin   = GPIO_Pin_12; // NSS
    gpio.GPIO_Mode  = GPIO_Mode_Out_PP;
    gpio.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOB, &gpio);
}

static void spiInit(void)
{
    RCC_APB1PeriphClockCmd(RCC_APB1Periph_SPI2, ENABLE);

    SPI_InitTypeDef spi;
    spi.SPI_Direction         = SPI_Direction_2Lines_FullDuplex; // 全双工
    spi.SPI_Mode              = SPI_Mode_Master;
    spi.SPI_DataSize          = SPI_DataSize_8b;
    spi.SPI_CPOL              = SPI_CPOL_Low;             // 空闲时SCK状态, Hith:高 Low:低
    spi.SPI_CPHA              = SPI_CPHA_1Edge;           // 时钟相位, 奇|偶数边缘采样
    spi.SPI_NSS               = SPI_NSS_Soft;             // NSS 片选
    spi.SPI_BaudRatePrescaler = SPI_BaudRatePrescaler_16; // 预分频值
    spi.SPI_CRCPolynomial     = 7;                        // 校验和
    spi.SPI_FirstBit          = SPI_FirstBit_MSB;         // 大小端, 大端

    SPI_Init(SPI2, &spi);
    SPI_Cmd(SPI2, ENABLE);
}

/**
 * @brief  SPI的 I/O配置
 * @param  无
 * @retval 无
 */
void SPI_NRF_Init(void)
{
    printf("%s\n", "========== SPI_NRF_Init ==========");

    /*开启相应IO端口的时钟*/
    RCC_GPIO_ENABLE();

    /*使能SPIx时钟*/
    RCC_SPI_ENABLE();

    GPIO_InitTypeDef gpio;
    /*配置 SPI_NRF_SPI的 SCK,MISO,MOSI引脚，GPIOA^5,GPIOA^6,GPIOA^7 */
    gpio.GPIO_Pin   = SPI_GPIO_PIN;
    gpio.GPIO_Speed = GPIO_Speed_50MHz;
    gpio.GPIO_Mode  = GPIO_Mode_AF_PP; // 复用功能
    GPIO_Init(SPI_GPIO, &gpio);

    /*配置SPI_NRF_SPI的 CSN 引脚*/
    gpio.GPIO_Pin   = CSN_GPIO_PIN;
    gpio.GPIO_Speed = GPIO_Speed_50MHz;
    gpio.GPIO_Mode  = GPIO_Mode_Out_PP;
    GPIO_Init(CSN_GPIO, &gpio);

    /*SPI_NRF_SPI的 nrf CE 引脚*/
    gpio.GPIO_Pin   = CE_GPIO_PIN;
    gpio.GPIO_Speed = GPIO_Speed_10MHz;
    gpio.GPIO_Mode  = GPIO_Mode_Out_PP;
    GPIO_Init(CE_GPIO, &gpio);

    /*配置SPI_NRF_SPI nrf IRQ引脚*/
    gpio.GPIO_Pin  = IRQ_GPIO_PIN;
    gpio.GPIO_Mode = GPIO_Mode_IPU; // 上拉输入
    GPIO_Init(IRQ_GPIO, &gpio);

    // NRF_CE_HIGH();
    NRF_CSN_LOW();
    /* 这是自定义的宏，用于拉高csn引脚，NRF进入空闲状态 */
    // SPI_I2S_DeInit(SPIx);

    SPI_InitTypeDef spi;
    spi.SPI_Direction = SPI_Direction_2Lines_FullDuplex; // 双线全双工
    spi.SPI_Mode      = SPI_Mode_Master;                 // 主模式
    // spi.SPI_Mode              = SPI_Mode_Slave;                  //从模式
    spi.SPI_DataSize = SPI_DataSize_8b; // 数据大小8位
    spi.SPI_CPOL     = SPI_CPOL_Low;    // 时钟极性，空闲时为低
    spi.SPI_CPHA     = SPI_CPHA_1Edge;  // 第1个边沿有效，上升沿为采样时刻
    // spi.SPI_NSS               = SPI_NSS_Hard;                     //NSS信号由软件产生
    spi.SPI_NSS = SPI_NSS_Soft; // NSS信号由软件产生
    // spi.SPI_BaudRatePrescaler = SPI_BaudRatePrescaler_8;  //8分频，9MHz
    spi.SPI_BaudRatePrescaler = SPI_BaudRatePrescaler_16; // 8分频，9MHz
    // spi.SPI_BaudRatePrescaler = SPI_BaudRatePrescaler_256;          //8分频，9MHz
    spi.SPI_FirstBit      = SPI_FirstBit_MSB; // 高位在前
    spi.SPI_CRCPolynomial = 7;
    SPI_Init(SPIx, &spi);

    /* Enable SPIx  */
    SPI_Cmd(SPIx, ENABLE);
}

/**
 * 用于向NRF读/写一字节数据
 */
uint8_t SPI_NRF_RW(uint8_t dat)
{
    /* 当 SPI发送缓冲器非空时等待 */
    while (SPI_I2S_GetFlagStatus(SPIx, SPI_I2S_FLAG_TXE) == RESET) {}

    /* 通过 SPIx发送一字节数据 */
    SPI_I2S_SendData(SPIx, dat);

    /* 当SPI接收缓冲器为空时等待 */
    while (SPI_I2S_GetFlagStatus(SPIx, SPI_I2S_FLAG_RXNE) == RESET) {}

    // printf("SPI_I2S_FLAG_TXE:%d\n", SPI_I2S_GetFlagStatus(SPIx, SPI_I2S_FLAG_TXE));

    /* Return the byte read from the SPI bus */
    uint8_t ret = SPI_I2S_ReceiveData(SPIx);
    // printf("dat:%d,ret:%d\n", dat,ret);
    return ret;
}

/**
 * @brief   用于向NRF特定的寄存器写入数据
 * @param
 *		@arg reg:NRF的命令+寄存器地址
 *		@arg dat:将要向寄存器写入的数据
 * @retval  NRF的status寄存器的状态
 */
uint8_t SPI_NRF_WriteReg(uint8_t reg, uint8_t dat)
{
    uint8_t status;
    // NRF_CE_LOW();
    /*置低CSN，使能SPI传输*/
    NRF_CSN_LOW();

    /*发送命令及寄存器号 */
    status = SPI_NRF_RW(reg);

    /*向寄存器写入数据*/
    SPI_NRF_RW(dat);

    /*CSN拉高，完成*/
    NRF_CSN_HIGH();

    /*返回状态寄存器的值*/
    return (status);
}

/**
 * @brief   用于从NRF特定的寄存器读出数据
 * @param
 *		@arg reg:NRF的命令+寄存器地址
 * @retval  寄存器中的数据
 */
uint8_t SPI_NRF_ReadReg(uint8_t reg)
{
    uint8_t reg_val;

    // NRF_CE_LOW();
    NRF_CSN_LOW();
    /*置低CSN，使能SPI传输*/

    /*发送寄存器号*/
    SPI_NRF_RW(reg);

    /*读取寄存器的值 */
    reg_val = SPI_NRF_RW(NOP);

    /*CSN拉高，完成*/
    NRF_CSN_HIGH();

    return reg_val;
}

/**
 * @brief   用于向NRF的寄存器中写入一串数据
 * @param
 *		@arg reg : NRF的命令+寄存器地址
 *		@arg pBuf：用于存储将被读出的寄存器数据的数组，外部定义
 * 	@arg bytes: pBuf的数据长度
 * @retval  NRF的status寄存器的状态
 */
uint8_t SPI_NRF_ReadBuf(uint8_t reg, uint8_t *pBuf, uint8_t bytes)
{
    uint8_t status, byte_cnt;

    NRF_CE_LOW();
    /*置低CSN，使能SPI传输*/
    NRF_CSN_LOW();

    /*发送寄存器号*/
    status = SPI_NRF_RW(reg);

    /*读取缓冲区数据*/
    for (byte_cnt = 0; byte_cnt < bytes; byte_cnt++) {
        pBuf[byte_cnt] = SPI_NRF_RW(NOP); // 从NRF24L01读取数据
        // pBuf[byte_cnt] = SPI_NRF_RW(0x02);  //从NRF24L01读取数据
    }
    /*CSN拉高，完成*/
    NRF_CSN_HIGH();

    return status; // 返回寄存器状态值
}

/**
 * @brief   用于向NRF的寄存器中写入一串数据
 * @param
 *		@arg reg : NRF的命令+寄存器地址
 *		@arg pBuf：存储了将要写入写寄存器数据的数组，外部定义
 * 	@arg bytes: pBuf的数据长度
 * @retval  NRF的status寄存器的状态
 */
uint8_t SPI_NRF_WriteBuf(uint8_t reg, uint8_t *pBuf, uint8_t bytes)
{
    uint8_t status, byte_cnt;
    NRF_CE_LOW();
    /*置低CSN，使能SPI传输*/
    NRF_CSN_LOW();

    /*发送寄存器号*/
    status = SPI_NRF_RW(reg);

    /*向缓冲区写入数据*/
    for (byte_cnt = 0; byte_cnt < bytes; byte_cnt++) {
        // uint8_t temp = *pBuf++;
        // printf("byte_cnt: %d\n", temp);
        // SPI_NRF_RW(temp);  //写数据到缓冲区
        SPI_NRF_RW(*pBuf++); // 写数据到缓冲区
    }

    /*CSN拉高，完成*/
    NRF_CSN_HIGH();

    return (status); // 返回NRF24L01的状态
}

/**
 * @brief  配置并进入接收模式
 * @param  无
 * @retval 无
 */
void NRF_RX_Mode(void)
{
    NRF_CE_LOW();

    SPI_NRF_WriteBuf(NRF_WRITE_REG + RX_ADDR_P0, RX_ADDRESS, RX_ADR_WIDTH); // 写RX节点地址

    SPI_NRF_WriteReg(NRF_WRITE_REG + EN_AA, 0x01); // 使能通道0的自动应答

    SPI_NRF_WriteReg(NRF_WRITE_REG + EN_RXADDR, 0x01); // 使能通道0的接收地址

    SPI_NRF_WriteReg(NRF_WRITE_REG + RF_CH, CHANAL); // 设置RF通信频率

    SPI_NRF_WriteReg(NRF_WRITE_REG + RX_PW_P0, RX_PLOAD_WIDTH); // 选择通道0的有效数据宽度

    SPI_NRF_WriteReg(NRF_WRITE_REG + RF_SETUP, 0x0f); // 设置TX发射参数,0db增益,2Mbps,低噪声增益开启

    SPI_NRF_WriteReg(NRF_WRITE_REG + CONFIG, 0x0f); // 配置基本工作模式的参数;PWR_UP,EN_CRC,16BIT_CRC,接收模式

    /*CE拉高，进入接收模式*/
    NRF_CE_HIGH();
}

/**
 * @brief  配置发送模式
 * @param  无
 * @retval 无
 */
void NRF_TX_Mode(void)
{
    NRF_CE_LOW();
    SPI_NRF_WriteBuf(NRF_WRITE_REG + TX_ADDR, TX_ADDRESS, TX_ADR_WIDTH); // 写TX节点地址
    SPI_NRF_WriteBuf(NRF_WRITE_REG + RX_ADDR_P0, RX_ADDRESS, RX_ADR_WIDTH); // 设置TX节点地址,主要为了使能ACK
    SPI_NRF_WriteReg(NRF_WRITE_REG + EN_AA, 0x01); // 使能通道0的自动应答
    SPI_NRF_WriteReg(NRF_WRITE_REG + EN_RXADDR, 0x01); // 使能通道0的接收地址
    SPI_NRF_WriteReg(NRF_WRITE_REG + SETUP_RETR, 0x1a); // 设置自动重发间隔时间:500us + 86us;最大自动重发次数:10次
    SPI_NRF_WriteReg(NRF_WRITE_REG + RF_CH, CHANAL); // 设置RF通道为CHANAL
    SPI_NRF_WriteReg(NRF_WRITE_REG + RF_SETUP, 0x0f); // 设置TX发射参数,0db增益,2Mbps,低噪声增益开启
    SPI_NRF_WriteReg(NRF_WRITE_REG + CONFIG, 0x0e); // 配置基本工作模式的参数;PWR_UP,EN_CRC,16BIT_CRC,发射模式,开启所有中断

    /*CE拉高，进入发送模式*/
    NRF_CE_HIGH();
    // Delay(0xffff);  //CE要拉高一段时间才进入发送模式
    delay_ms(100);
}

/**
 * @brief   用于向NRF的发送缓冲区中写入数据
 * @param
 *		@arg txBuf：存储了将要发送的数据的数组，外部定义
 * @retval  发送结果，成功返回TXDS,失败返回MAXRT或ERROR
 */
uint8_t NRF_Tx_Dat(uint8_t *txbuf)
{
    uint8_t state;

    /*ce为低，进入待机模式1*/
    NRF_CE_LOW();
    // FIFO_STATUS B:1
    // STATUS B:14
    // CONFIG B:14
    // FIFO_STATUS F:1
    // STATUS F:46
    // CONFIG F:14
    /*写数据到TX BUF 最大 32个字节*/
    SPI_NRF_WriteBuf(WR_TX_PLOAD, txbuf, TX_PLOAD_WIDTH);
    // printf("FIFO_STATUS B:%d\n", SPI_NRF_ReadReg(NRF_READ_REG + NRF_FIFO_STATUS));
    // printf("STATUS B:%d\n", SPI_NRF_ReadReg(NRF_READ_REG + STATUS));
    // printf("CONFIG B:%d\n", SPI_NRF_ReadReg(NRF_READ_REG + CONFIG));
    /*CE为高，txbuf非空，发送数据包 */
    NRF_CE_HIGH();
    // printf("FIFO_STATUS F:%d\n", SPI_NRF_ReadReg(NRF_READ_REG + NRF_FIFO_STATUS));
    // printf("STATUS F:%d\n", SPI_NRF_ReadReg(NRF_READ_REG + STATUS));
    // printf("CONFIG F:%d\n", SPI_NRF_ReadReg(NRF_READ_REG + CONFIG));
    /*等待发送完成中断 */
    while (NRF_Read_IRQ() != 0) {}

    /*读取状态寄存器的值 */
    state = SPI_NRF_ReadReg(STATUS);
    // printf("FIFO_STATUS R:%d\n", SPI_NRF_ReadReg(NRF_READ_REG + NRF_FIFO_STATUS));
    // printf("STATUS R:%d\n", SPI_NRF_ReadReg(NRF_READ_REG + STATUS));
    // printf("CONFIG R:%d\n", SPI_NRF_ReadReg(NRF_READ_REG + CONFIG));
    /*清除TX_DS或MAX_RT中断标志*/
    SPI_NRF_WriteReg(NRF_WRITE_REG + STATUS, state);

    SPI_NRF_WriteReg(FLUSH_TX, NOP); // 清除TX FIFO寄存器

    /*判断中断类型*/
    if (state & MAX_RT) { // 达到最大重发次数
        return MAX_RT;
    }

    if (state & TX_DS) { // 发送完成
        return TX_DS;
    }
    return ERROR; // 其他原因发送失败
}

/**
 * @brief   用于从NRF的接收缓冲区中读出数据
 * @param
 *		@arg rxBuf ：用于接收该数据的数组，外部定义
 * @retval
 *		@arg 接收结果
 */
uint8_t NRF_Rx_Dat(uint8_t *rxbuf)
{
    uint8_t state;
    NRF_CE_HIGH(); // 进入接收状态
    /*等待接收中断*/
    while (NRF_Read_IRQ() != 0) {}

    NRF_CE_LOW(); // 进入待机状态
    /*读取status寄存器的值  */
    state = SPI_NRF_ReadReg(STATUS);

    /* 清除中断标志*/
    SPI_NRF_WriteReg(NRF_WRITE_REG + STATUS, state);

    /*判断是否接收到数据*/
    if (state & RX_DR) {                                     // 接收到数据
        SPI_NRF_ReadBuf(RD_RX_PLOAD, rxbuf, RX_PLOAD_WIDTH); // 读取数据
        SPI_NRF_WriteReg(FLUSH_RX, NOP);                     // 清除RX FIFO寄存器
        return RX_DR;
    }
    return ERROR; // 没收到任何数据
}

/**
 * @brief  主要用于NRF与MCU是否正常连接
 * @param  无
 * @retval SUCCESS/ERROR 连接正常/连接失败
 */
uint8_t NRF_Check(void)
{
    // uint8_t buf[5] = {0xA5, 0xA5, 0xA5, 0xA5, 0xA5};
    // uint8_t buf[5] = {0x01, 0x01, 0x01, 0x01, 0x01};
    uint8_t buf[5] = {0xc2, 0xc2, 0xc2, 0xc2, 0xc2};
    uint8_t buf1[5];
    uint8_t i;

    /*写入5个字节的地址.  */
    SPI_NRF_WriteBuf(NRF_WRITE_REG + TX_ADDR, buf, 5);

    /*读出写入的地址 */
    SPI_NRF_ReadBuf(TX_ADDR, buf1, 5);

    /*比较*/
    for (i = 0; i < 5; i++) {
        // printf("%0x\n", buf1[i]);
        if (buf1[i] != buf[0]) break;
    }

    if (i == 5) {
        return SUCCESS; // MCU与NRF成功连接
    }
    return ERROR; // MCU与NRF不正常连接
}

uint8_t NRF_Config(void)
{
    // 已有
    // SPI_NRF_ReadReg(NRF_READ_REG + CONFIG);

    // 造轮子
    NRF_CE_LOW();
    NRF_CSN_LOW();
    /*发送寄存器号*/
    uint8_t status = SPI_NRF_RW(NRF_READ_REG + CONFIG);
    uint8_t dat    = SPI_NRF_RW(NOP);
    printf("status:%d,dat:%d\n", status, dat);
    NRF_CSN_HIGH();
    return status;
}
