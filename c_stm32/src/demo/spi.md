# SPI

# NSS(CS,CSN), SCK, MOSI(DO,SI), MISO(DI,SO)

## NSS 片选(支持多个)
n slave select

## 通信
1. 开始:从NSS片选(哪个片选端口)拉低


n. 结束:从NSS片选(哪个片选端口)拉高



## MOSI
MSB 高位在前
```c
for (var i=0;i<8;i++){
    var MOSI = byte & 0x80;
    byte = byte << 1;
}
```
        0b100000000 &最高位 0x80
          |  
        0b101101001 左移 << 1位
          |
       0b101101001
          |
      0b101101001
          |
     0b101101001
          |  
    0b101101001
          |  
   0b101101001
          |  
  0b101101001
          |  
 0b101101001
          |  
0b101101001
