# GPIO

## Register
### CRL,CRH
> MODE,CNF


### IDR
> 输入电平

### ODR
> 数出高低电平

### BSRR    GPIO_SetBits()
> 可设置高低位, 常用作置高位(1)

### BRR     GPIO_ResetBits()
> 用于清除, 常用于置低位(0)



## GPIO Mode



## GPIO INPUT
> gpio 输入模式

### GPIO_Mode_IPU 上拉输入

### GPIO_Mode_IPD 下拉输入

### GPIO_Mode_IN_FLOATING 浮空输入
> 和 复用推挽输出 成对使用


### GPIO_Mode_AIN 模拟输入


## GPIO OUTPUT
> 输出模式

### GPIO_MODE_IPD, GPIO_MODE_IPU
> GPIO_MODE_IPD 下拉电阻, 低电平 : 下拉检测高位
> GPIO_MODE_IPU 上拉电阻, 高电平 : 下拉检测低位


### GPIO_Mode_AF_PP 复用推挽输出
> 并非作为通用IO口使用, 辅助其它外片内外设

