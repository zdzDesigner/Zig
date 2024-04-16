#include <stdarg.h>
#include "wifi.h"
#include "usart.h"


u8 WIFI_RX_BUF[WIFI_DR_LIMIT];
u8 WIFI_TX_BUF[WIFI_DR_LIMIT];

char* WIFI_RX_STR;

vu16 WIFI_RX_STA = 0;

static u8 esp8266_cmd(char* cmd, char* ack, u16 count);

void USART2_IRQHandler(void) {
    uint8_t temp;
    // static uint8_t flag = 0;
    if (USART_GetITStatus(USART2, USART_IT_RXNE) == SET) {
        temp = USART_ReceiveByte(USART2);
        // printf("%d\n",temp);
        // USART_SendByte(USART1, temp);


        if ((WIFI_RX_STA & 1 << 15) || WIFI_RX_STA >= WIFI_DR_LIMIT) {
            // WIFI_RX_BUF[WIFI_RX_STA] = '\0';
        } else {
            if (WIFI_RX_STA == 0) {
                // TIM_Cmd(TIM2, ENABLE);
            }
            if (temp) {
                WIFI_RX_BUF[WIFI_RX_STA++] = temp;
                // TIM_SetCounter(TIM2, 0);
            }
        }
        USART_ClearITPendingBit(USART2, USART_IT_RXNE);
    }


    // 监测溢出
    // if (USART_GetITStatus(USART2, USART_IT_ORE) == SET) {
    //     USART_ClearITPendingBit(USART2, USART_IT_ORE);
    //     USART_ReceiveData(USART2);  //这句一定要加
    // }
}



/**
 * UASRT3 初始
 */
void WIFI_USART_Start(void) {
    // 使能USART2, GPIO
    RCC_APB1PeriphClockCmd(RCC_APB1Periph_USART2, ENABLE);
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB, ENABLE);

    GPIO_InitTypeDef gpio;
    gpio.GPIO_Pin   = GPIO_Pin_1;
    gpio.GPIO_Mode  = GPIO_Mode_Out_PP;
    gpio.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOB, &gpio);
    GPIO_ResetBits(GPIOB, GPIO_Pin_1);

    USART_DeInit(USART2);

    // 配置GPIO
    // GPIO_InitTypeDef gpio;
    gpio.GPIO_Pin   = GPIO_Pin_10;
    gpio.GPIO_Mode  = GPIO_Mode_AF_PP;
    gpio.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOB, &gpio);


    gpio.GPIO_Pin  = GPIO_Pin_11;
    gpio.GPIO_Mode = GPIO_Mode_IN_FLOATING;
    GPIO_Init(GPIOB, &gpio);

    // 配置串口
    USART_InitTypeDef usart;
    usart.USART_BaudRate            = 115200;
    usart.USART_Mode                = USART_Mode_Rx | USART_Mode_Tx;
    usart.USART_HardwareFlowControl = USART_HardwareFlowControl_None;
    usart.USART_Parity              = USART_Parity_No;
    usart.USART_StopBits            = USART_StopBits_1;
    usart.USART_WordLength          = USART_WordLength_8b;
    USART_Init(USART2, &usart);



    // 开启
    USART_Cmd(USART2, ENABLE);
    // 使能中断
    USART_ITConfig(USART2, USART_IT_RXNE, ENABLE);


    // 中断
    NVIC_InitTypeDef nvic;
    nvic.NVIC_IRQChannel                   = USART2_IRQn;
    nvic.NVIC_IRQChannelPreemptionPriority = 2;
    nvic.NVIC_IRQChannelSubPriority        = 2;
    nvic.NVIC_IRQChannelCmd                = ENABLE;
    NVIC_Init(&nvic);


    // 一定不能在中断函数中初始和清除
    WIFI_TIM_Start(300, 7200);
    TIM_Cmd(TIM2, DISABLE);
}


/**
 * TIM2 初始
 */

void WIFI_TIM_Start(u16 arr, u16 psc) {
    RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2, ENABLE);

    // TIM
    TIM_TimeBaseInitTypeDef tim;
    tim.TIM_Prescaler     = psc - 1;
    tim.TIM_Period        = arr - 1;
    tim.TIM_CounterMode   = TIM_CounterMode_Up;
    tim.TIM_ClockDivision = TIM_CKD_DIV1;
    TIM_TimeBaseInit(TIM2, &tim);
    // 使能
    TIM_Cmd(TIM2, ENABLE);

    // 中断
    TIM_ITConfig(TIM2, TIM_IT_Update, ENABLE);
    TIM_ClearITPendingBit(TIM2, TIM_IT_Update);

    NVIC_InitTypeDef nvic;
    nvic.NVIC_IRQChannel                   = TIM2_IRQn;
    nvic.NVIC_IRQChannelPreemptionPriority = 1;
    nvic.NVIC_IRQChannelSubPriority        = 2;
    nvic.NVIC_IRQChannelCmd                = ENABLE;
    NVIC_Init(&nvic);
}

// TIM中断
void TIM2_IRQHandler(void) {
    if (TIM_GetITStatus(TIM2, TIM_IT_Update) == SET) {
        WIFI_RX_STA |= 1 << 15;
        TIM_ClearITPendingBit(TIM2, TIM_IT_Update);
        TIM_Cmd(TIM2, DISABLE);
        TIM_SetCounter(TIM2, 0);
        USART_SendString(USART1, "--TIM2:IT--\r\n");
    }
}



void WIFI_Esp8266(void) {
    GPIO_ResetBits(GPIOB, GPIO_Pin_1);
    delay_ms(1000);
    GPIO_SetBits(GPIOB, GPIO_Pin_1);
    delay_ms(1000);
    GPIO_ResetBits(GPIOB, GPIO_Pin_1);
    delay_ms(1000);
    GPIO_SetBits(GPIOB, GPIO_Pin_1);
    delay_ms(1000);
    // USART_SendString(USART2, "aa");
    // esp8266_cmd("AT+CWMODE_CUR", "1", 50);
    esp8266_cmd("AT+CWMODE_CUR?\r\n", "1", 10);
    // if (esp8266_cmd("AT+CWMODE_CUR?\r\n", "1", 20)) {
    //     esp8266_cmd("AT+CWMODE=1\r\n", "OK", 30);
    // }


    // esp8266_cmd("AT+RST\r\n", "OK", 20);
    esp8266_cmd("AT+RST\r\n", "ready", 200);
    delay_ms(1000);
    delay_ms(1000);
    delay_ms(1000);



    printf("连接WIFI\n");
    if (!esp8266_cmd("AT+CWJAP_CUR?\r\n", "No AP", 50)) {
        printf("连接WIFI\n");
        while (esp8266_cmd("AT+CWJAP=\"lmy\",\"lmyzdz(3(\"\r\n", "WIFI GOT IP", 60)) {};
    }


    //=0：单路连接模式     =1：多路连接模式
    printf("连接模式\n");
    if (!esp8266_cmd("AT+CIPMUX?\r\n", "OK", 50)) {
        while (esp8266_cmd("AT+CIPMUX=0\r\n", "OK", 20)) {};
    }

    //建立TCP连接  这四项分别代表了 要连接的ID号0~4   连接类型  远程服务器IP地址   远程服务器端口号
    printf("建立TCP连接\n");
    while (esp8266_cmd("AT+CIPSTART=\"TCP\",\"192.168.101.5\",6002\r\n", "CONNECT", 60)) {};

    // AT+CIPMODE?
    //是否开启透传模式  0：表示关闭 1：表示开启透传 AT+CIPMODE? => CIPMODE:1
    printf("开启透传模式\n");
    esp8266_cmd("AT+CIPMODE=1\r\n", "OK", 200);


    // //透传模式下 开始发送数据的指令 这个指令之后就可以直接发数据了
    // // while (esp8266_cmd("AT+CIPSEND\r\n", "OK", 50)){};
    esp8266_cmd("AT+CIPSEND\r\n", ">", 50);
    delay_ms(1000);
    USART_SendString(USART2, "today!");
    delay_ms(1000);
    delay_ms(1000);
    // printf("退出透传模式\n");
    // USART_SendString(USART2, "+++");
    delay_ms(1000);
    delay_ms(1000);
    USART_SendString(USART2, "today again!");
    delay_ms(1000);
    delay_ms(1000);
    USART_SendString(USART2, "today again!");
    delay_ms(1000);
    delay_ms(1000);
    USART_SendString(USART2, "today again!");
    // while (esp8266_cmd("AT", "OK", 50)) {};
}

static u8 esp8266_cmd(char* cmd, char* ack, u16 count) {
    // TIM_Cmd(TIM2, ENABLE);
    WIFI_RX_STA = 0;
    // memset(WIFI_RX_BUF, '\0', 0);
    memset(WIFI_RX_BUF, '\0', WIFI_DR_LIMIT);
    // // USART_SendString(USART1, cmd);
    USART_SendString(USART2, cmd);
    while (count > 0) {
        delay_ms(10);
        if (WIFI_RX_STA) {
            // if (WIFI_RX_STA & 1 << 15) {
            printf("WIFI_RX_BUF:%s\n", WIFI_RX_BUF);
            if (strstr((char*)WIFI_RX_BUF, ack) != 0) {
                // printf("strstr: %s\n", strstr((char*)WIFI_RX_BUF, ack));
                return 0;
            }
            // WIFI_RX_STA = 0;
            return 1;
        }
        printf("%d+", count);
        count--;
    }

    return 1;
}



void WIFI_Printf(char* fmt, ...) {
    u16 i, j;
    va_list ap;
    va_start(ap, fmt);
    vsprintf((char*)WIFI_TX_BUF, fmt, ap);
    va_end(ap);
    i = strlen((const char*)WIFI_TX_BUF);                                //此次发送数据的长度
    for (j = 0; j < i; j++) {                                            //循环发送数据
        while (USART_GetFlagStatus(USART2, USART_FLAG_TC) == RESET) {};  //循环发送,直到发送完毕
        USART_SendData(USART2, WIFI_TX_BUF[j]);
    }
}
