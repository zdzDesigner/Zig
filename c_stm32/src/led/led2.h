#ifndef __LED2_H
#define __LED2_H

#include "sys.h"

#define LED0_PIN  GPIO_Pin_8
#define LED0_GPIO GPIOA
#define LED0_RCC  RCC_APB2Periph_GPIOA

// typedef struct {
//     void (*LED_ON)(void);      // 开灯
//     void (*LED_OFF)(void);     // 关灯
//     void (*LED_TOGGLE)(void);  // 反转
// } LED_Type;



// static void LED0_ON(void);
// static void LED0_OFF(void);
// static void LED0_TOGGLE(void);

// LED_Type LED0 = {
//     LED0_ON,
//     LED0_OFF,
//     LED0_TOGGLE
// };

#endif