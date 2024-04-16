## 内存
[memory](https://www.cnblogs.com/pertor/p/9484663.html)


## gpio

- usart (重定向 printf)

```md
RCC_APB2Periph_GPIOA

GPIO_Pin_9
GPIO_Pin_10
```

- adc (采集遥控器数据)

```md
RCC_APB2Periph_GPIOA

GPIO_Pin_4
GPIO_Pin_5
```

- nrf24l01

```md
-STM32F103xCDE_数据手册-中文.pdf 描述
M11 K8 G2 33 51 73 PB12 I/O FT PB12  SPI2_NSS/I2S2_WS/ I2C2_SMBA/USART3_CK(7) TIM1_BKIN(7)
M12 J8 G1 34 52 74 PB13 I/O FT PB13  SPI2_SCK/I2S2_CK USART3_CTS(7)/TIM1_CH1N
L11 H8 F2 35 53 75 PB14 I/O FT PB14  SPI2_MISO/TIM1_CH2N USART3_RTS(7)
L12 G8 F1 36 54 76 PB15 I/O FT PB15  SPI2_MOSI/I2S2_SD  TIM1_CH3N(7)

SPI2
RCC_APB2Periph_GPIOB

● MISO：主设备输入/从设备输出引脚。该引脚在从模式下发送数据，在主模式下接收数据。
● MOSI：主设备输出/从设备输入引脚。该引脚在主模式下发送数据，在从模式下接收数据。
● SCK：串口时钟，作为主设备的输出，从设备的输入
GPIO_Pin_13: SCK
GPIO_Pin_14: MISO
GPIO_Pin_15: MOSI

GPIO_Pin_10: IRQ  => GPIO_Pin_11
GPIO_Pin_11: CE   => GPIO_Pin_10
GPIO_Pin_12: CSN(NSS)
```
