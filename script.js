let canvas, ctx, w, h;
const maxIter = 500;
let transform;

function applyTransform(x, y) {
    const {sx, sy, tx, ty} = transform;
    return {
        a: sx * x + tx,
        b: sy * y + ty
    }
}

function initTransform() {
    transform = {
        sx: 4/w,
        sy: -4/h,
        tx: -2,
        ty: 2
    }
}

function belongsToMandelbrot(c) {
    let z = {a: 0, b: 0};
    let i;
    for (i = 0; i < maxIter; i++) {
        const nextA = z.a * z.a - z.b * z.b + c.a;
        const nextB = 2 * z.a * z.b + c.b;

        z.a = nextA;
        z.b = nextB;
        const ab = Math.sqrt(z.a * z.a + z.b * z.b);
        if (ab > 2) return i - Math.log2(ab);
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
}

function pan(px, py) {
    const {sx, sy, tx, ty} = transform;
    transform = {
        sx,
        sy,
        tx: tx - sx * px,
        ty: ty - sy * py
    }
    plotMandelbrot();
}

function zoom(zf, zx, zy) {
    const {a, b} = applyTransform(zx, zy);
    const {sx, sy, tx, ty} = transform;
    transform = {
        sx: zf * sx,
        sy: zf * sy,
        tx: zf * tx + a - zf * a,
        ty: zf * ty + b - zf * b
    }
    plotMandelbrot();
}

function registerHandlers() {
    let mouseDown = false;
    canvas.onmousedown = function() {
        mouseDown = true;
    };
    canvas.onmousemove = function(e) {
        if (mouseDown) {
            pan(e.movementX, e.movementY)
        }
    };
    canvas.onmouseup = function() {
        mouseDown = false;
    };
    canvas.onwheel = function(e) {
        e.preventDefault();
        const zf = e.deltaY > 0 ? 1.5 : 1 / 1.5;
        zoom(zf, e.offsetX, e.offsetY);
    }
}

function draw() {
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    w = canvas.width;
    h = canvas.height;
    initTransform();
    registerHandlers();
    plotMandelbrot();
}