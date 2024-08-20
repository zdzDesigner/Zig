# flex

- 布局: 由`%%`分割 (可查看生成的`lex.yy.c`文件)
1. 直接导入部分 `%{ %}`
```l
%{
    #include <stdio.h>
%}
```
2. 匹配规则部分
```l
// calc_v1.l

[A-Z]       { printf("IDENTIFIER, '%s'\n", yytext); }

// [A-Z] 正则
// flex 出入的内容`IDENTIFIER, 'A'`, `yytext`表示正则匹配的内容

```
3. 第三部分是执行: yylex是Flex提供的一个函数，利用匹配规则解析输入的字符流







## 运行示例

```sh
# 默认生成`lex.yy.c`文件
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



```sh
flex ./calc_v1.2

gcc ./lex.yy.c -o calc
```
```sh
➜  ./calc
# 输入 ==========
A = [r,q] 

# 输出 ==========
toke type:259, val:A
toke type:264
toke type:262
toke type:260, val:r
toke type:261
toke type:260, val:q
toke type:263
toke type:268
```


