fn fib(i: u32) -> u32 {
    if i == 1 || i == 2 {
        return 1;
    }
    return fib(i - 1) + fib(i - 2);
}

fn main() {
    for i in 1..=20 {
        println!("{}", fib(i));
    }
}
