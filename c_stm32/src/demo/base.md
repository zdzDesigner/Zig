## 概念
FCLK 主频率 



# 别名对照
PERIPH 片上外设
RCC (reset and clock control) 复位和时钟控制
CRL (control register low)
ODR (out data register)

SRAM (Static Random Access Memory) 静态存储器

IRQ (interrupt request) 中断请求

CRC (Cyclic Redundancy Check) 循环冗余校验



## 标志位

TE (Transfer error)  传输错误
TC (Transfer complete) 传输完成

## 词
<!-- USART -->
Parity 奇偶校验
<!-- TIMx -->
Prescaler 预分频 
Period 周期  ARR

Division 除法, ClockDivision 分频 [8,9]
Priority [praɪˈɒrəti]优先级

Repetition [ˌrepəˈtɪʃn] 重复

Polarity [pəˈlærəti] 极性, 两极  SPI_CPOL

Preload 预加载

Calibration [ˌkælɪˈbreɪʃn]  校准 ADC

Phase [feɪz]  相位  SPI_CPHA

Alternate [ɔːlˈtɜːnət]   交替,替代的,备用的  Alternate function I/O  (AFIO)

<!--  -->

# | &
置高位(1)用|
清零用& 一般结合~使用


# GPIOA5口

```c
    RCC->APB2ENR |= (1<<2); // 使能A
    GPIOA->CRL &= ~(0x0F<<5*4); // 清空低8位寄存器5口状态MF
    GPIOA->CRL |= (0x1<<5*4); // 赋值低8位寄存器5口状态MF
    GPIOA->ODR &= ~(1<<5); // 低电平
``` 


# GPIOB4口

```c
    RCC->APB2ENR |= (1<<3);
    GPIOB->CRL &= ~(0x0F<<4*4);
    GPIOB->CRL |= (0b0A<<4*4)
    GPIOB->ODR &= ~(1<<4)
```


# GPIOD14
```c
    RCC->APB2ENR |= (1<<6);
    GPIOD->CRH &= ~(0x0F<<6*4);
    GPIOD->CRH |= (0x01<<6*4)
    GPIOD->ODR |= (1<<14);
```







# 主线
中断(interrupted)------------ EXTI
                |   |---- EXTI_Linex (全部AFIO)?
                |
                ------------ USART
                |   |---- TXE, TC
                |   |---- RXNE 有数据
                |   |---- IDLE 空闲
                |
                |
                ------------ ADC
                |   |---- EOC 
                |   |---- 通道 
                |
                ------------ TIM (pwm 输出, 部分AFIO)
                |   |---- TIM_IT_Update (TIMx->SR)
                |   |---- DMA_IT_TC status DMAx_IT_TCx (TIMx->SR)
                |
                ------------ DMA
                    |---- GL,HT,TC,TE (DMAx->ISR)
                    |---- 通道
