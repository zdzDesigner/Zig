# flex

```sh
flex ./calc_v1.l

gcc ./lex.yy.c -o calc
```
```sh
➜  ./calc
# 输入 ==========
A = [r,q] 

# 输出 ==========
IDENTIFIER, 'A'
space or tab
ASSIGN, '='
space or tab
LEFT_BRACKET, '['
STRING, 'r'
COMMA, ','
STRING, 'q'
RIGHT_BRACKET, ']'
NEWLINE
```


