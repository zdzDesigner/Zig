#ifndef __PWM_H
#define __PWM_H

#define PWM_CTRL_GPIO_Pin GPIO_Pin_0 | GPIO_Pin_1 | GPIO_Pin_2 | GPIO_Pin_3 | GPIO_Pin_6 | GPIO_Pin_7
#define PWM_CTRL_GPIO_Pin2 GPIO_Pin_8 | GPIO_Pin_9

void PWM_Config(void);
void PWM_Stop(void);
void PWM_Go(void);
void PWM_Back(void);
void PWM_Left(void);
void PWM_Right(void);

#endif
