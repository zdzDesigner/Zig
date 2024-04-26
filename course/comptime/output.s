	.text
	.intel_syntax noprefix
	.file	"output"
	.globl	sumArray
	.p2align	4, 0x90
	.type	sumArray,@function
sumArray:
	.cfi_startproc
	test	rsi, rsi
	je	.LBB0_1
	cmp	rsi, 32
	jae	.LBB0_4
	xor	eax, eax
	xor	ecx, ecx
	jmp	.LBB0_7
.LBB0_1:
	xor	eax, eax
	ret
.LBB0_4:
	mov	rcx, rsi
	and	rcx, -32
	vpxor	xmm0, xmm0, xmm0
	xor	eax, eax
	vpxor	xmm1, xmm1, xmm1
	vpxor	xmm2, xmm2, xmm2
	vpxor	xmm3, xmm3, xmm3
	.p2align	4, 0x90
.LBB0_5:
	vpaddd	ymm0, ymm0, ymmword ptr [rdi + 4*rax]
	vpaddd	ymm1, ymm1, ymmword ptr [rdi + 4*rax + 32]
	vpaddd	ymm2, ymm2, ymmword ptr [rdi + 4*rax + 64]
	vpaddd	ymm3, ymm3, ymmword ptr [rdi + 4*rax + 96]
	add	rax, 32
	cmp	rcx, rax
	jne	.LBB0_5
	vpaddd	ymm0, ymm1, ymm0
	vpaddd	ymm1, ymm3, ymm2
	vpaddd	ymm0, ymm1, ymm0
	vextracti128	xmm1, ymm0, 1
	vpaddd	xmm0, xmm0, xmm1
	vpshufd	xmm1, xmm0, 238
	vpaddd	xmm0, xmm0, xmm1
	vpshufd	xmm1, xmm0, 85
	vpaddd	xmm0, xmm0, xmm1
	vmovd	eax, xmm0
	cmp	rcx, rsi
	je	.LBB0_8
	.p2align	4, 0x90
.LBB0_7:
	add	eax, dword ptr [rdi + 4*rcx]
	inc	rcx
	cmp	rsi, rcx
	jne	.LBB0_7
.LBB0_8:
	vzeroupper
	ret
.Lfunc_end0:
	.size	sumArray, .Lfunc_end0-sumArray
	.cfi_endproc

	.section	".note.GNU-stack","",@progbits
