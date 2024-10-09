	.text
.set __tmp_reg__, 0
.set __zero_reg__, 1
.set __SREG__, 63
.set __SP_H__, 62
.set __SP_L__, 61
	.file	"base"
	.globl	foo
	.p2align	1
	.type	foo,@function
foo:
	ret
.Lfunc_end0:
	.size	foo, .Lfunc_end0-foo

	.globl	bar
	.p2align	1
	.type	bar,@function
bar:
	ldi	r24, 0
	ldi	r25, 0
	ret
.Lfunc_end1:
	.size	bar, .Lfunc_end1-bar

	.globl	add
	.p2align	1
	.type	add,@function
add:
	add	r24, r22
	clr	r25
	ret
.Lfunc_end2:
	.size	add, .Lfunc_end2-add

