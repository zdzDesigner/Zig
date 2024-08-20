%option noyywrap

%{
 #include <stdio.h>
 enum yytokentype {
       PRINT = 258,
       IDENTIFIER = 259,
       CHAR = 260,
       COMMA = 261,
       LEFT_BRACKET = 262,
       RIGHT_BRACKET = 263,
       ASSIGN = 264,
       UNION = 265,
       INTERSECT = 266,
       SUBSTRACT = 267,
       NEWLINE = 268
 };
 char yylval;
%}

%%

PRINT       { return PRINT; } 
[A-Z]       { yylval = yytext[0]; return IDENTIFIER;}
[a-z]       { yylval = yytext[0]; return CHAR;}
","         { return COMMA; }
"["         { return LEFT_BRACKET; }
"]"         { return RIGHT_BRACKET; }
"="         { return ASSIGN; }
"∪"         { return UNION; }
"∩"         { return INTERSECT; }
"-"         { return SUBSTRACT; }
\n          { return NEWLINE; }
"//".*      { /* --- comment --- */ }
[ \t]       { /* space or tab\n */ }
.           { printf("unexpected token: (%s)\n", yytext); return -1;}

%%

int main()
{
  int t_token;
  while(t_token = yylex()){
    printf("toke type:%d", t_token);
    if(t_token == IDENTIFIER || t_token == CHAR){
      printf(", val:%c\n", yylval);
    }else{
      printf("\n");
    }
  }
}

