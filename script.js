let canvas, ctx, w, h;

function applyTransform(x, y) {
    const a = 4/w * x - 2;
    const b = -4/h * y + 2;
    return {a, b};
}

function f(z, c) {
    const {a, b} = z;

    const nextA = a * a - b * b + c.a;
    const nextB = 2 * a * b + c.b;

    return {a: nextA, b: nextB};
}

function abs(z) {
    const {a, b} = z;
    return Math.sqrt(a * a + b * b);
}

function belongsToMandelbrot(c) {
    let z = {a: 0, b: 0};
    let i;
    for (i = 0; i < 500; i++) {
        z = f(z, c);
        if (abs(z) > 2) return false;
    }
    return true;
}

function drawAxes() {
    ctx.beginPath();
    ctx.moveTo(0, h/2);
    ctx.lineTo(w, h/2);
    ctx.moveTo(w/2, 0);
    ctx.lineTo(w/2, h);
    ctx.stroke();
}

function color(pixels, start, belongs) {
    pixels[start] = belongs ? 0 : 255;
    pixels[start + 1] = belongs ? 0 : 255;
    pixels[start + 2] = belongs ? 0 : 255;
    pixels[start + 3] = 255;
}

function plotMandelbrot() {
    const myImageData = ctx.createImageData(w, h);
    const pixels = myImageData.data;
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            const belongs = belongsToMandelbrot(applyTransform(j, i));
            const start = 4 * (i * w + j);
            color(pixels, start, belongs);
        }
    }

    ctx.putImageData(myImageData, 0, 0);
    drawAxes(ctx);
}

function draw() {
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    w = canvas.width;
    h = canvas.height;
    plotMandelbrot();
}