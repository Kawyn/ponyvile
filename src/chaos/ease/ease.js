function easeInOutQuart(x) {
    return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}

function easeOutQuint(x) {
    return 1 - Math.pow(1 - x, 5);
}