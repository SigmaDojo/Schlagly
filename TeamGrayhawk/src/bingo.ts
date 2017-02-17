
var canvas: any = document.getElementById('canvas');
var ctx: any= canvas.getContext('2d');


function drawBingoFn() {
    let t = 0;
    return () => drawFullCircle(['x', 'y', 'z'], t++);
}

window.setInterval(drawBingoFn(), 1);



function drawFullCircle(data: Array<string>, t: number) {
    const numItems = data.length;
    const segmentSizeDegrees = 360 / numItems;

    for (let i=0; i < numItems; i++) {
	let start = i * segmentSizeDegrees;
	let end = start + segmentSizeDegrees;
	drawSegment(ctx, start, end, t);
    }
}



function drawSegment(context: any, startAngle: number, endAngle: number, rotationAngle: number) {
    const centerX = 200;
    const centerY = 200;
    const start = degrees2radians(startAngle + rotationAngle);
    const end = degrees2radians(endAngle + rotationAngle);
    const radius = 150;
    
    context.beginPath();
    context.strokeStyle = 'black';
    context.moveTo(centerX, centerY);
    context.lineTo(centerX + (radius * Math.cos(start)), centerY + (radius * Math.sin(start)));
    context.arc(centerX, centerY, radius, start, end);
    context.moveTo(centerX, centerY);
    context.lineTo(centerX + (radius * Math.cos(end)), centerY + (radius * Math.sin(end)));
    context.fillStyle = degrees2color(endAngle);
    context.fill();
    context.stroke();
}




function degrees2radians(d: number) {
    return ((d % 360) / 360.0) * 2 * Math.PI;
}


function degrees2color(d: number) {
    //const x: number = Math.pow(255, 3) * d / 360;
    const x: number = 255 * d / 360;
    const s: string = x.toString(16);
    
    const color = '#' + leftPad(s, 6, '0');
    console.log(color);
    return color;
}





/* Leftpad FTW!! */
var cache = [
  '',
  ' ',
  '  ',
  '   ',
  '    ',
  '     ',
  '      ',
  '       ',
  '        ',
  '         '
];

function leftPad (str: string, len: number, ch: any) {
  // convert `str` to `string`
  str = str + '';
  // `len` is the `pad`'s length now
  len = len - str.length;
  // doesn't need to pad
  if (len <= 0) return str;
  // `ch` defaults to `' '`
  if (!ch && ch !== 0) ch = ' ';
  // convert `ch` to `string`
  ch = ch + '';
  // cache common use cases
  if (ch === ' ' && len < 10) return cache[len] + str;
  // `pad` starts with an empty string
  var pad = '';
  // loop
  while (true) {
    // add `ch` to `pad` if `len` is odd
    if (len & 1) pad += ch;
    // divide `len` by 2, ditch the remainder
    len >>= 1;
    // "double" the `ch` so this operation count grows logarithmically on `len`
    // each time `ch` is "doubled", the `len` would need to be "doubled" too
    // similar to finding a value in binary search tree, hence O(log(n))
    if (len) ch += ch;
    // `len` is 0, exit the loop
    else break;
  }
  // pad `str`!
  return pad + str;
}
