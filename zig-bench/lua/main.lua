function main()
  for i = 1, 20, 1 do
    print(fib(i))
  end
end

function fib(i)
  if i == 1 or i == 2 then
    return 1
  end

  return fib(i - 1) + fib(i - 2)
end

main()
