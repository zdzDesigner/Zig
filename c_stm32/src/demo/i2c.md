# I2C

建立链接:
start(开始)+slave_address(从机地址)+desc(方向)+ack(应答)

desc:
    写:0
    读:1

写数据:
N*(data(每发送8位)+ack(应答))

end(结束):
停止传输信号


复合链接:写入到哪个寄存器
start(开始)+slave_address(从机地址)+desc(方向)+ack(应答)



start(开始):
    SCL:1
    SDA:1->0

end(结束):
    SCL:1
    SDA:0->1


数据传输(有效):
    SCL:1 有效数据 (0值时SDA无效,这么设计为了让SDA切换数据)
    SDA:0低位数据, 1高位数据


ack(nack):
    SCL:1
    SDA:0应答, 1非应答(发送端释放SDA,此时由接收端控制)