let canvas, ctx, w, h;
const maxIter = 80;

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
    for (i = 0; i < maxIter; i++) {
        z = f(z, c);
        const ab = abs(z);
        if (ab > 2) return i - Math.log2(Math.log2(ab));
    }
    return i;
}

function drawAxes() {
    ctx.beginPath();
    ctx.moveTo(0, h/2);
    ctx.lineTo(w, h/2);
    ctx.moveTo(w/2, 0);
    ctx.lineTo(w/2, h);
    ctx.stroke();
}

// input: h in [0,360] and s,v in [0,1] - output: r,g,b in [0,1]
function hsv2rgb(h,s,v) {
    let f= (n,k=(n+h/60)%6) => v - v*s*Math.max( Math.min(k,4-k,1), 0);
    return [f(5),f(3),f(1)];
}

function color(pixels, start, speed) {
    const hue = 360 * speed/maxIter;
    const saturation = speed/maxIter;
    const value = 1 - speed / maxIter;
    const [r, g, b] = hsv2rgb(hue, saturation, value);
    pixels[start] = r * 255;
    pixels[start + 1] = g * 255;
    pixels[start + 2] = b * 255;
    pixels[start + 3] = 255;
}

function plotMandelbrot() {
    const myImageData = ctx.createImageData(w, h);
    const pixels = myImageData.data;
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            const speed = belongsToMandelbrot(applyTransform(j, i));
            const start = 4 * (i * w + j);
            color(pixels, start, speed);
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