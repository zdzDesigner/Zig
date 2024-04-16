#ifndef __NRF24_H
#define __NRF24_H

#include "stm32f10x_gpio.h"



#define TX_ADR_WIDTH 5   // 发射地址宽度
#define TX_PLOAD_WIDTH 4 // 发射数据通道有效数据宽度0~32Byte

#define RX_ADR_WIDTH 5
#define RX_PLOAD_WIDTH 4

#define CHANAL 40 // 频道选择

// NRF24L01寄存器操作命令
#define NRF_READ_REG 0x00  // 读配置寄存器,低5位为寄存器地址
#define NRF_WRITE_REG 0x20 // 写配置寄存器,低5位为寄存器地址
#define RD_RX_PLOAD 0x61   // 读RX有效数据,1~32字节,应用于接收模式下,读取完成后自动清除FIFO
#define WR_TX_PLOAD 0xA0   // 写TX有效数据,1~32字节,应用于发射模式下
#define FLUSH_TX 0xE1      // 清除TX FIFO寄存器.发射模式下用
#define FLUSH_RX 0xE2      // 清除RX FIFO寄存器.接收模式下用,传输应答信号过程中用这个指令会让应答数据不能完整传输
#define REUSE_TX_PL 0xE3   // 重新使用上一包数据,CE为高,数据包被不断发送.发射过程中必须禁止用这个功能
#define NOP 0xFF           // 空操作,可以用来读状态寄存器



// SPI(NRF24L01)寄存器地址
//  CONFIG
// bit0:1接收模式,0发射模式;
// bit1:1上电 0掉电;
// bit2:CRC模式; 0八位CRC 1 16位CRC
// bit3:CRC使能;1使能 0不使能(若是使能自动应答,这一位必须为高)
// bit4 可屏蔽中断 MAX_RT 1 屏蔽 0不屏蔽 发生中断IRQ为低电平(最大重发中断)
// bit5 可屏蔽中断TX_DS 1屏蔽 0不 数据发送完成并收到应答
// bit6 可屏蔽中断RX_DR 接收数据完成 1屏蔽 0不屏蔽
// bit7 默认为0

// SETUP_RETR
// 建立自动重发;
// bit3:0,自动重发计数器;0000 15次
// bit7:4,自动重发延时 0000 250*x+86us

// RF_SETUP
// bit4: pll lock允许,仅用于测试模式,应当为1
// bit3: 传输速率(0:1Mbps,1:2Mbps);
// bit2:1,发射功率 11 0dbm;
// bit0:低噪声放大器增益

// STATUS
// bit0:TX FIFO满标志;
// bit3:1,接收数据通道号(最大:6);接收到数据的通道号码
// bit4,达到最多次重发 max_rt中断
// bit5:数据发送完成中断;写1清除中断
// bit6:接收数据中断; 写1清除中断

// OBSERVE_TX
// bit7:4,数据包丢失计数器;
// bit3:0,重发计数器

// NRF_FIFO_STATUS
// bit0,RX FIFO寄存器空标志;
// bit1,RX FIFO满标志;
// bit2,3,保留
// bit4,TX FIFO空标志;
// bit5,TX FIFO满标志;
// bit6,1,循环发送上一数据包.0,不循环;

#define CONFIG 0x00          // 配置寄存器地址;
#define EN_AA 0x01           // bit0~5,使能自动应答功能 (自动应答必然启动CRC)对应通道0~5
#define EN_RXADDR 0x02       // bit0~5,接收数据通道允许,对应通道0~5
#define SETUP_AW 0x03        // bit1,0:设置地址宽度(所有数据通道) 01,3字节; 10,4字节; 11,5字节;(默认11)
#define SETUP_RETR 0x04      // 建立自动重发
#define RF_CH 0x05           // RF通道,bit6:0,工作通道频率
#define RF_SETUP 0x06        // 传输增益
#define STATUS 0x07          // 状态寄存器
#define OBSERVE_TX 0x08      // 发送检测寄存器,
#define CD 0x09              // 载波检测寄存器,bit0,载波检测;
#define RX_ADDR_P0 0x0A      // 数据通道0接收地址,最大长度5个字节,低字节在前
#define RX_ADDR_P1 0x0B      // 数据通道1接收地址,最大长度5个字节,低字节在前
#define RX_ADDR_P2 0x0C      // 数据通道2接收地址,最低字节可设置,高字节,必须同RX_ADDR_P1[39:8]相等;
#define RX_ADDR_P3 0x0D      // 数据通道3接收地址,最低字节可设置,高字节,必须同RX_ADDR_P1[39:8]相等;
#define RX_ADDR_P4 0x0E      // 数据通道4接收地址,最低字节可设置,高字节,必须同RX_ADDR_P1[39:8]相等;
#define RX_ADDR_P5 0x0F      // 数据通道5接收地址,最低字节可设置,高字节,必须同RX_ADDR_P1[39:8]相等;
#define TX_ADDR 0x10         // 发送地址(低字节在前),ShockBurstTM模式下,RX_ADDR_P0与此地址相等
#define RX_PW_P0 0x11        // 接收数据通道0有效数据宽度(1~32字节),设置为0则非法
#define RX_PW_P1 0x12        // 接收数据通道1有效数据宽度(1~32字节),设置为0则非法
#define RX_PW_P2 0x13        // 接收数据通道2有效数据宽度(1~32字节),设置为0则非法
#define RX_PW_P3 0x14        // 接收数据通道3有效数据宽度(1~32字节),设置为0则非法
#define RX_PW_P4 0x15        // 接收数据通道4有效数据宽度(1~32字节),设置为0则非法
#define RX_PW_P5 0x16        // 接收数据通道5有效数据宽度(1~32字节),设置为0则非法
#define NRF_FIFO_STATUS 0x17 // FIFO状态寄存器;

#define MAX_RT 0x10 // 达到最大重发次数中断标志位
#define TX_DS 0x20  // 发送完成中断标志位	  //

#define RX_DR 0x40 // 接收到数据中断标志位

// #define SPI_3 1
#define SPI_2 1
// #define SPI_1 1
// *****************
#if defined(SPI_3)
#define SPIx SPI3

#define CSN_GPIO GPIOA
#define CSN_GPIO_PIN GPIO_Pin_0

#define CE_GPIO GPIOA
#define CE_GPIO_PIN GPIO_Pin_1

#define RCC_SPI_ENABLE() RCC_APB1PeriphClockCmd(RCC_APB1Periph_SPI3, ENABLE);
#endif

// *****************
#if defined(SPI_2)
#define SPIx SPI2

#define SPI_GPIO GPIOB
#define SPI_GPIO_PIN GPIO_Pin_13 | GPIO_Pin_14 | GPIO_Pin_15

#define CSN_GPIO GPIOB
#define CSN_GPIO_PIN GPIO_Pin_12

#define CE_GPIO GPIOB
#define CE_GPIO_PIN GPIO_Pin_11

#define IRQ_GPIO GPIOB
#define IRQ_GPIO_PIN GPIO_Pin_10

#define RCC_GPIO_ENABLE() RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB, ENABLE);
#define RCC_SPI_ENABLE() RCC_APB1PeriphClockCmd(RCC_APB1Periph_SPI2, ENABLE);
#endif

// *****************
#if defined(SPI_1)
#define SPIx SPI1

#define SPI_GPIO GPIOA
#define SPI_GPIO_PIN GPIO_Pin_5 | GPIO_Pin_6 | GPIO_Pin_7

#define CSN_GPIO GPIOA
#define CSN_GPIO_PIN GPIO_Pin_4

#define CE_GPIO GPIOA
#define CE_GPIO_PIN GPIO_Pin_3

#define IRQ_GPIO GPIOA
#define IRQ_GPIO_PIN GPIO_Pin_2

#define RCC_GPIO_ENABLE() RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);
#define RCC_SPI_ENABLE() RCC_APB2PeriphClockCmd(RCC_APB2Periph_SPI1, ENABLE);
#endif

#define NRF_CSN_HIGH() GPIO_SetBits(CSN_GPIO, CSN_GPIO_PIN)
#define NRF_CSN_LOW() GPIO_ResetBits(CSN_GPIO, CSN_GPIO_PIN) // csn置低

#define NRF_CE_HIGH() GPIO_SetBits(CE_GPIO, CE_GPIO_PIN)
#define NRF_CE_LOW() GPIO_ResetBits(CE_GPIO, CE_GPIO_PIN) // CE置低

#define NRF_Read_IRQ() GPIO_ReadInputDataBit(IRQ_GPIO, IRQ_GPIO_PIN) // 中断引脚

void SPI_NRF_Init(void);
uint8_t SPI_NRF_RW(uint8_t dat);
uint8_t SPI_NRF_ReadReg(uint8_t reg);
uint8_t SPI_NRF_WriteReg(uint8_t reg, uint8_t dat);

uint8_t SPI_NRF_ReadBuf(uint8_t reg, uint8_t *pBuf, uint8_t bytes);
uint8_t SPI_NRF_WriteBuf(uint8_t reg, uint8_t *pBuf, uint8_t bytes);

void NRF_TX_Mode(void);
void NRF_RX_Mode(void);
uint8_t NRF_Rx_Dat(uint8_t *rxbuf);
uint8_t NRF_Tx_Dat(uint8_t *txbuf);
uint8_t NRF_Check(void);

#endif // __NRF24_H
