; ModuleID = 'BitcodeBuffer'
source_filename = "base"
target datalayout = "e-P1-p:16:8-i8:8-i16:8-i32:8-i64:8-f32:8-f64:8-n8-a:8"
target triple = "avr-unknown-unknown-eabi"

; Function Attrs: minsize mustprogress nofree norecurse noredzone nosync nounwind optsize willreturn memory(none)
define dso_local void @foo() local_unnamed_addr addrspace(1) #0 {
  ret void
}

; Function Attrs: minsize mustprogress nofree norecurse noredzone nosync nounwind optsize willreturn memory(none)
define dso_local noundef zeroext i1 @bar() local_unnamed_addr addrspace(1) #0 {
  ret i1 false
}

; Function Attrs: minsize mustprogress nofree norecurse noredzone nosync nounwind optsize willreturn memory(none)
define dso_local zeroext i8 @add(i8 zeroext %0, i8 zeroext %1) local_unnamed_addr addrspace(1) #0 {
  %3 = add nuw i8 %1, %0
  ret i8 %3
}

attributes #0 = { minsize mustprogress nofree norecurse noredzone nosync nounwind optsize willreturn memory(none) "frame-pointer"="none" "target-cpu"="avr2" "target-features"="+addsubiw,+avr0,+avr1,+avr2,-avr25,-avr3,-avr31,-avr35,-avr4,-avr5,-avr51,-avr6,-avrtiny,-break,-des,-eijmpcall,-elpm,-elpmx,+ijmpcall,-jmpcall,-lowbytefirst,+lpm,-lpmx,+memmappedregs,-movw,-mul,-rmw,-smallstack,-special,-spm,-spmx,+sram,-tinyencoding,-xmega,-xmega3,-xmegau" }
