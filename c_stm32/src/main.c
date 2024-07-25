// // #include "led.h"
// #include "printf.h"
// #include "delay.h"
// #include "nrf24/nrf24.h"
// #include "usart.h"
// #include "util/scale.h"
//
// extern uint16_t ADC_VAL[2];
// extern uint8_t  TX_BUF[RX_PLOAD_WIDTH];
//
// static int send()
// {
//     /* 进入发送模式 */
//     ADC_Config();
//     Scaler scalerH = ScalerInit(0, 255, 1670, 2370);
//     Scaler scalerV = ScalerInit(0, 255, 1710, 2380);
//     printf("%s\n", "adc send start");
//     NRF_TX_Mode();
//     // delay_ms(100);
//
//     u16 hval = 0;
//     u16 vval = 0;
//     while (1) {
//         // printf("--------\n");
//         delay_ms(100);
//         ADC_DMA_Avg();
//         /* 发送模式 */
//         hval = scalerH.conv(&scalerH, ADC_VAL[0]);
//         vval = scalerV.conv(&scalerV, ADC_VAL[1]);
//         // hval = ADC_VAL[0];
//         // vval = &scaler, ADC_VAL[1];
//         // //
//         printf("hval:%d,vval:%d\n", hval, vval);
//         // TX_BUF[0] = (uint8_t)hval;
//         // TX_BUF[1] = (uint8_t)vval;
//         // NRF_Tx_Dat(TX_BUF);
//         // uint8_t NrfStatus = NRF_Tx_Dat(TX_BUF);
//         // printf("%s\n", "send ");
//         // printf("send after status:%d\n", NrfStatus);
//     }
//     return 0;
// }
//
// static int send2()
// {
//     ADC_Config();
//     /* PWM_Config(); */
//     u16    ch4    = 0;
//     u16    ch5    = 0;
//     Scaler scaler = ScalerInit(0, 18000, 1740, 2400);
//     // Scaler scaler = ScalerInit(0, 18000, 0, 4095);
//     while (1) {
//         delay_ms(30);
//         // delay_ms_stk(1000);
//         // count++;
//         // printf("%ld\n",count);
//         // ch4 = ADC_AVG_Read(1000);
//         ch4 = ADC_AVG_ReadCh(ADC_Channel_4, 1000);
//         // ch4 = scaler.conv(&scaler, ch4);
//         ch5 = ADC_AVG_ReadCh(ADC_Channel_5, 1000);
//         // ch5 = scaler.conv(&scaler, ch5);
//         printf("--%d, %d\n", ch4, ch5);
//         // printf("--%d\n", ch4);
//         // printf("--\n");
//
//         // TIM_SetCompare1(TIM3, 0);
//         /* TIM_SetCompare1(TIM3, val); */
//         /* TIM_SetCompare2(TIM3, val); */
//         // TIM_SetCompare2(TIM3, 0);
//         // TIM_SetCompare2(TIM3, 10);
//         // TIM_SetCompare2(TIM3, 100);
//         // TIM_SetCompare2(TIM3, 500);
//         // TIM_SetCompare2(TIM3, 1000);
//         // TIM_SetCompare2(TIM3, 2000);
//         // TIM_SetCompare2(TIM3, 10000);
//     }
//     return 0;
// }
//
// static int send_demo()
// {
//     while (1) {
//         delay_ms(30);
//         printf("ssssss\n");
//     }
//     return 0;
// }
//
// int main()
// {
//     // 定义中断组
//     NVIC_PriorityGroupConfig(NVIC_PriorityGroup_2);
//
//     delay_init();
//     PRINT_Config();
//     // LED_GPIO_Config();
//
//     return send();
//     // return send2();
//     // return send_demo();
// }

// extern int _start();

// int main()
int _start()
{
    while (1) {}
    return 0;
}
