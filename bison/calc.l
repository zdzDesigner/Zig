%{
#include "calc.tab.h"
%}

%%

[0-9]+  { yylval = atoi(yytext); return NUMBER; }
[ \t]   { /* 忽略空白字符 */ }
\n      { return '\n'; }
.       { return yytext[0]; }

%%

int yywrap(void) {
    return 1;
}

