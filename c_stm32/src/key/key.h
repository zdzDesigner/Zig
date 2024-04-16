#ifndef __KEY_H__
#define __KEY_H__

#include "stm32f10x_gpio.h"

#define KEY_PIN GPIO_Pin_15
#define KEY_GPIO GPIOA
#define KEY_CLK RCC_APB2Periph_GPIOA

#define KEY_ON 1
#define KEY_OFF 0

#define KEY_DOWN (KeyScan(GPIOA, GPIO_Pin_15) == KEY_OFF)

#define KEY_EXTI_DOWN (KeyScan(GPIOC, GPIO_Pin_5) == KEY_OFF)

void KEY_GPIO_Config(void);
uint8_t KeyScan(GPIO_TypeDef *GPIOx, uint16_t GPIO_pin);

#endif
