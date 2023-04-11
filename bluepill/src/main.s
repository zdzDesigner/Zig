main:
        push    rbp
        mov     rbp, rsp
        sub     rsp, 16
        mov     eax, 1073877016
        mov     ecx, dword ptr [rax]
        or      ecx, 16
        mov     eax, 1073877016
        mov     dword ptr [rax], ecx
        mov     eax, 1073811460
        mov     ecx, dword ptr [rax]
        and     ecx, -15728641
        mov     eax, 1073811460
        mov     dword ptr [rax], ecx
        mov     eax, 1073811460
        mov     ecx, dword ptr [rax]
        or      ecx, 1048576
        mov     eax, 1073811460
        mov     dword ptr [rax], ecx
.LBB0_1:
        mov     dword ptr [rbp - 12], 0
        mov     eax, 1073811468
        mov     ecx, dword ptr [rax]
        xor     ecx, 8192
        mov     eax, 1073811468
        mov     dword ptr [rax], ecx
.LBB0_2:
        cmp     dword ptr [rbp - 12], 100000
        jae     .LBB0_4
        mov     eax, dword ptr [rbp - 12]
        inc     eax
        mov     dword ptr [rbp - 8], eax
        sete    byte ptr [rbp - 4]
        mov     al, byte ptr [rbp - 4]
        test    al, al
        je      .LBB0_5
        jmp     .LBB0_6
.LBB0_4:
        jmp     .LBB0_9
.LBB0_5:
        jmp     .LBB0_7
.LBB0_6:
        movabs  rdi, offset example.main__anon_213
        mov     esi, 16
        xor     eax, eax
        mov     edx, eax
        movabs  rcx, offset .L__unnamed_1
        call    example.panic
.LBB0_7:
        mov     eax, dword ptr [rbp - 8]
        mov     dword ptr [rbp - 12], eax
        jmp     .LBB0_2
.LBB0_9:
        jmp     .LBB0_1

example.panic:
        push    rbp
        mov     rbp, rsp
        call    zig_panic@PLT

example.main__anon_213:
        .ascii  "integer overflow"

.L__unnamed_1:
        .zero   8
        .byte   0
        .zero   7
