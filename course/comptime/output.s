	.text
	.intel_syntax noprefix
	.file	"output"
	.globl	sumArray
	.type	sumArray,@function
sumArray:
	.cfi_startproc
	xor	ecx, ecx
	xor	eax, eax
.LBB0_1:
	cmp	rsi, rcx
	je	.LBB0_3
	add	eax, dword ptr [rdi + 4*rcx]
	inc	rcx
	jmp	.LBB0_1
.LBB0_3:
	ret
.Lfunc_end0:
	.size	sumArray, .Lfunc_end0-sumArray
	.cfi_endproc

	.section	".note.GNU-stack","",@progbits
