%option noyywrap

%{
    #include <stdio.h>
%}

%%

PRINT       { printf("PRINT, '%s'\n", yytext); } 
[A-Z]       { printf("IDENTIFIER, '%s'\n", yytext); }
[a-z]       { printf("STRING, '%s'\n", yytext); }
","         { printf("COMMA, '%s'\n", yytext); }
"["         { printf("LEFT_BRACKET, '%s'\n", yytext); }
"]"         { printf("RIGHT_BRACKET, '%s'\n", yytext); }
"="         { printf("ASSIGN, '%s'\n", yytext); }
"∪"         { printf("UNION, '%s'\n", yytext); }
"∩"         { printf("INTERSECT, '%s'\n", yytext); }
"-"         { printf("SUBSTRACT, '%s'\n", yytext); }
\n          { printf("NEWLINE\n"); }
"//".*      { printf("comment: %s\n", yytext); }
[ \t]       { printf("space or tab\n"); }
.           { printf("unexpected token: (%s)\n", yytext); }

%%

int main()
{
    yylex(); 
}

