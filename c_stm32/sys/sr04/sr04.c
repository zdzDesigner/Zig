#include "sr04.h"



static void gpioInit(void);

void SR04_Config(void){
    printf("%s\n","====== SR04_Config ======");
    gpioInit();
}


static void gpioInit(void){
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOC, ENABLE);

    GPIO_InitTypeDef gpio;

    gpio.GPIO_Pin = GPIO_Pin_11;
    gpio.GPIO_Mode = GPIO_Mode_IPU;
    GPIO_Init(GPIOC,&gpio);

    gpio.GPIO_Pin = GPIO_Pin_12;
    gpio.GPIO_Mode = GPIO_Mode_Out_PP;
    gpio.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOC,&gpio);

}