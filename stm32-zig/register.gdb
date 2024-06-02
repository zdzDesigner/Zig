define reg
  shell echo "" > debug/gdb.tmp
  set logging file debug/gdb.tmp
  set logging on
  x/32x $arg0
  set logging off
end





