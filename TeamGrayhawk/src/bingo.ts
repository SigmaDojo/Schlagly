const btn: HTMLButtonElement = <HTMLButtonElement> document.getElementById('btn');
const result: HTMLDivElement = <HTMLDivElement> document.getElementById('result');
const canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById('canvas');
const ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D> canvas.getContext('2d');

let data: Array<string>;
let currentTick:number = 0;
let speed: number = 0;
let spinHandler: number;
let brakeHandler: number;

const COLORS: Array<string> =
    ["#87a96b", "#EEE8AA", "#FFFACD", "#B0C4DE",
     "#BDB76B", "#90EE90", "#F0FFF0", "#F4A460",
     "#E0FFFF", "#B0E0E6", "#87CEEB", "#D8BFD8"];

function getColor(i: number) {
    return COLORS[i];
}

function init(list: Array<string>) {
    data = list;
    btn.onclick = startSpinner;
    clearResult();
    drawFullCircle();
}

function drawFullCircle() {
    const numItems = data.length;
    const segmentSizeDegrees = 360 / numItems;

    for (let i=0; i < numItems; i++) {
        let start = currentTick + (i * segmentSizeDegrees);
        let end = start + segmentSizeDegrees;
        let color = getColor(i);
        drawSegment(ctx, data[i], start, end, color);
    }
    drawTriangle();
}

function drawTriangle() {
    ctx.beginPath();
    ctx.moveTo(185, 20);
    ctx.lineTo(215, 20);
    ctx.lineTo(200, 45);
    ctx.fillStyle = 'black';
    ctx.fill();
}

function drawSegment(context: CanvasRenderingContext2D, label: string, startAngle: number, endAngle: number, color: string) {
    const centerX = 200;
    const centerY = 200;
    const start = degrees2radians(startAngle);
    const mid = degrees2radians(startAngle + (0.5*(endAngle-startAngle)));
    const end = degrees2radians(endAngle);
    const radius = 150;

    context.beginPath();
    context.strokeStyle = 'black';
    context.moveTo(centerX, centerY);
    context.lineTo(centerX + (radius * Math.cos(start)),
                   centerY + (radius * Math.sin(start)));
    context.arc(centerX, centerY, radius, start, end);
    context.moveTo(centerX, centerY);
    context.lineTo(centerX + (radius * Math.cos(end)),
                   centerY + (radius * Math.sin(end)));
    context.fillStyle = color;
    context.fill();
    context.stroke();

    drawLabel(context, label, mid);
}

function drawLabel(context: CanvasRenderingContext2D, label: string, degree: number) {
    context.save();
    context.translate(200,200);
    context.rotate(degree + (Math.PI * 0.5));
    context.fillStyle = 'black';
    context.font = "11px Arial";
    context.textAlign = 'center';
    context.fillText(label, 0, -120);
    context.translate(-200,-200);
    context.restore();

}

function degrees2radians(d: number) {
    return ((d % 360) / 360.0) * 2 * Math.PI;
}

function tick() {
    currentTick = currentTick + speed;
    drawFullCircle();
}

function decreaseSpeed() {
    speed = speed - 1;
    if (speed === 0) {
        stopSpinner();
    }
}

function setSpeed(x: number) {
    speed = x;
}

function startSpinner() {
    const randomSpinTime = 1500 * Math.random();
    btn.disabled = true;
    spinHandler = window.setInterval(tick, 30);
    window.setTimeout(brakeSpinner, randomSpinTime);
    setSpeed(20);
    clearResult();
}

function stopSpinner() {
    window.clearInterval(spinHandler);
    window.clearInterval(brakeHandler);
    btn.disabled = false;
    showResult();
}

function brakeSpinner() {
    brakeHandler = window.setInterval(decreaseSpeed, 100);
}

function clearResult() {
    result.innerText = '';
}

function showResult() {
    const responses: Array<string> = [
        "You got ",
        "OMG! It's ",
        "LOL - you got ",
        "I regret to inform that you got ",
        "YEAH! Time for ",
        "F$#k! ",
        "How about some ",
        "What are the odds! It's ",
        "Can you believe it? ",
        "You got lucky - it's "
    ];

    const randomResponse: string = responses[Math.floor(Math.random() * responses.length)];
    result.innerText = randomResponse + getCurrentValue() + "!";
}

function getCurrentValue(): string {
    const translatedTick = (currentTick + 90) % 360;
    const x = data.length - 1 - Math.trunc(data.length * translatedTick/360);
    return data[x];
}
