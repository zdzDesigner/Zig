#include "usart.h"

// static void USART_SendByte(USART_TypeDef* USARTx, uint16_t Data);

#define USART_RX_BUF_SIZE 255
uint8_t USART_RX_BUF[USART_RX_BUF_SIZE];

static void gpioInit(void);
static void usartInit(void);
static void dmaInit(void);
static void nvicInit(void);
static void Receive_DataPack(void);

static void gpioInit(void)
{
  // GPIO 时钟使能
  RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);
  // GPIO 端口模式设置
  GPIO_InitTypeDef gpio;
  gpio.GPIO_Pin = GPIO_Pin_9;
  gpio.GPIO_Mode = GPIO_Mode_AF_PP;
  gpio.GPIO_Speed = GPIO_Speed_50MHz;
  GPIO_Init(GPIOA, &gpio);

  gpio.GPIO_Pin = GPIO_Pin_10;
  gpio.GPIO_Mode = GPIO_Mode_IN_FLOATING;
  GPIO_Init(GPIOA, &gpio);
}

// 初始串口
static void usartInit(void)
{
  // 串口 时钟使能
  RCC_APB2PeriphClockCmd(RCC_APB2Periph_USART1, ENABLE);
  // 串口参数初始化
  USART_InitTypeDef usart;
  usart.USART_BaudRate = 115200;
  usart.USART_Mode = USART_Mode_Rx | USART_Mode_Tx;
  usart.USART_HardwareFlowControl = USART_HardwareFlowControl_None; // 软件,硬件流控制
  usart.USART_Parity = USART_Parity_No;
  usart.USART_StopBits = USART_StopBits_1;
  usart.USART_WordLength = USART_WordLength_8b;
  USART_Init(USART1, &usart);
  USART_Cmd(USART1, ENABLE);
}

static void dmaInit(void)
{
  RCC_AHBPeriphClockCmd(RCC_AHBPeriph_DMA1, ENABLE);
  DMA_DeInit(DMA1_Channel5); // 查看具体DMA手册找到USART占用的MDA通道

  DMA_InitTypeDef dma;
  dma.DMA_PeripheralBaseAddr = (uint32_t)&USART1->DR; // 外设地址
  dma.DMA_MemoryBaseAddr = (uint32_t)USART_RX_BUF;    // 内存地址
  dma.DMA_DIR = DMA_DIR_PeripheralSRC;
  dma.DMA_Mode = DMA_Mode_Normal;
  // dma.DMA_Mode               = DMA_Mode_Circular;            // 循环
  dma.DMA_BufferSize = USART_RX_BUF_SIZE;                   // 传输大小
  dma.DMA_PeripheralDataSize = DMA_PeripheralDataSize_Byte; // 传输数据单位
  dma.DMA_MemoryDataSize = DMA_MemoryDataSize_Byte;         // 和外设单位一致
  dma.DMA_PeripheralInc = DMA_PeripheralInc_Disable;        // 外设地址不自增
  dma.DMA_MemoryInc = DMA_MemoryInc_Enable;                 // 内存地址自增
  dma.DMA_Priority = DMA_Priority_Medium;                   // 优先级
  dma.DMA_M2M = DMA_M2M_Disable;                            // 非内存到内存

  // 初始配置DMA, 通道
  DMA_Init(DMA1_Channel5, &dma);
  // 清除TC标志位
  // DMA_ClearFlag(DMA1_FLAG_TC5);
  // 设置中断
  // DMA_ITConfig(DMA1_Channel5, DMA_IT_TE, ENABLE);
  // 使能
  DMA_Cmd(DMA1_Channel5, ENABLE);

  // delay_ms(1000);
  // printf("DMA_GetCurrDataCounter: %d\n", DMA_GetCurrDataCounter(DMA1_Channel5));
}

// 串口中断: USART1（通用异步收发器1）的中断
// 当 USART1 模块接收到数据或者发送完成后，会产生相应的中断事件，这些中断事件会触发中断服务程序（IRQ），开发者可以在中断服务程序中处理相应的数据接收和发送操作。
static void nvicInit(void)
{
  NVIC_InitTypeDef nvic;
  nvic.NVIC_IRQChannel = USART1_IRQn;
  nvic.NVIC_IRQChannelPreemptionPriority = 2;
  nvic.NVIC_IRQChannelSubPriority = 2;
  nvic.NVIC_IRQChannelCmd = ENABLE;
  NVIC_Init(&nvic);
}

static void MYDMA_Enable(void)
{
  DMA_Cmd(DMA1_Channel5, DISABLE);                          // 关闭USART1 TX DMA1 所指示的通道
  DMA_SetCurrDataCounter(DMA1_Channel5, USART_RX_BUF_SIZE); // 从新设置缓冲大小,指向数组0
  DMA_Cmd(DMA1_Channel5, ENABLE);                           // 使能USART1 TX DMA1 所指示的通道
}

void PRINT_Config(void)
{
  gpioInit();
  nvicInit();
  usartInit();
  dmaInit();

  // 非空中断模式
  // USART_ITConfig(USART1, USART_IT_RXNE, ENABLE);

  // 空闲中断模式
  USART_ITConfig(USART1, USART_IT_IDLE, ENABLE);
  USART_DMACmd(USART1, USART_DMAReq_Rx, ENABLE);
  // 使能串口

  printf("========= PRINT_Config =========\n");
  // while (1) {
  //     /* code */
  //     delay_ms(10);
  //     if (USART_RX_BUF[0]) {
  //         // Receive_DataPack();
  //         delay_ms(10);                      //延时10ms,让DMA继续接收后面数据的同时,也能跑跑其它进程
  //         printf("1:%s\r\n", USART_RX_BUF);  //打印
  //         memset(USART_RX_BUF, 0, 255);      //清空数组
  //         MYDMA_Enable();                    //开始一次DMA传输！
  //     }
  // }
}

void USART_SendByte(USART_TypeDef *USARTx, uint16_t Data)
{
  USART_SendData(USARTx, Data);
  while (USART_GetFlagStatus(USARTx, USART_FLAG_TXE) == RESET) {
  };
}

void SendByte(char ch)
{
  USART_SendByte(USART1, ch);
}

void USART_SendString(USART_TypeDef *USARTx, char *str)
{
  while (*str != '\0') {
    USART_SendByte(USARTx, *str++);
  }
  while (USART_GetFlagStatus(USARTx, USART_FLAG_TC) == RESET) {
  }
}

// 查询法
uint8_t USART_ReceiveByte(USART_TypeDef *USARTx)
{
  while (USART_GetFlagStatus(USARTx, USART_FLAG_RXNE) == RESET) {
  }
  return (uint8_t)USART_ReceiveData(USARTx);
}

static void Receive_DataPack(void)
{
  /* 接收的数据长度 */
  uint8_t buff_length = 100;
  uint8_t i = 0;

  /* 关闭DMA ，防止干扰 */
  DMA_Cmd(DMA1_Channel5, DISABLE); /* 暂时关闭dma，数据尚未处理 */

  /* 获取接收到的数据长度 单位为字节*/
  buff_length = USART_RX_BUF_SIZE - DMA_GetCurrDataCounter(DMA1_Channel5);

  // printf("%d\n", buff_length);
  // printf("%s\n", USART_RX_BUF);
  USART_SendString(USART1, USART_RX_BUF);
  /* 获取数据长度 */
  // Usart_Rx_Sta = buff_length;
  // for (; i < USART_RX_BUF_SIZE; i++) {
  //     // printf("--\n");
  //     printf("%c\n ", USART_RX_BUF[i]);
  // }

  /* 清DMA标志位 */
  DMA_ClearFlag(DMA1_FLAG_TC5);

  /* 重新赋值计数值，必须大于等于最大可能接收到的数据帧数目 */
  memset(USART_RX_BUF, 0, 255);
  // DMA1_Channel5->CNDTR = USART_RX_BUF_SIZE;
  DMA_SetCurrDataCounter(DMA1_Channel5, USART_RX_BUF_SIZE);

  /* 此处应该在处理完数据再打开，如在 DataPack_Process() 打开*/
  DMA_Cmd(DMA1_Channel5, ENABLE);

  /* 给出信号 ，发送接收到新数据标志，供前台程序查询 */

  /* 标记接收完成，在 DataPack_Handle 处理*/
  // Usart_Rx_Sta |= 0xC000;

  /*
DMA 开启，等待数据。注意，如果中断发送数据帧的速率很快，MCU来不及处理此次接收到的数据，
中断又发来数据的话，这里不能开启，否则数据会被覆盖。有2种方式解决：

1. 在重新开启接收DMA通道之前，将Rx_Buf缓冲区里面的数据复制到另外一个数组中，
然后再开启DMA，然后马上处理复制出来的数据。

2. 建立双缓冲，重新配置DMA_MemoryBaseAddr的缓冲区地址，那么下次接收到的数据就会
保存到新的缓冲区中，不至于被覆盖。
*/
}

// 中断法
void USART1_IRQHandler(void)
{
  // uint8_t temp;
  // if (USART_GetITStatus(USART1, USART_IT_RXNE) != RESET) {
  //     temp = USART_ReceiveByte(USART1);
  //     // printf("val = %c\n", temp);
  //     SendByte(temp);
  // }
  // USART_ClearITPendingBit(USART1, USART_IT_RXNE);

  if (USART_GetITStatus(USART1, USART_IT_IDLE) != RESET) {
    Receive_DataPack();
    // 读取数据会清除中断标志位
    USART_ReceiveData(USART1);
  }
}
