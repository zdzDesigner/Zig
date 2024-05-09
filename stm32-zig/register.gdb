define reg
  shell echo "" > gdb.tmp
  set logging file gdb.tmp
  set logging on
  x/32x $arg0
  set logging off
end





