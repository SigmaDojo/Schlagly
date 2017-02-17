var Shlagly = (function () {
'use strict';

class Wedge {
    constructor(txt, rot) {
        this.text = txt;
        this.rot = rot;
    }
    draw(ctx, global_rot) {
        ctx.save();
        ctx.translate(200, 200);
        ctx.rotate(this.rot + global_rot);
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(this.text, 150, 0);
        ctx.restore();
    }
}
class Stopper {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    draw(ctx) {
        ctx.save();
        /*ctx.translate(this.x, this.y);*/
        ctx.beginPath();
        ctx.moveTo(380, 200);
        ctx.lineTo(450, 170);
        ctx.lineTo(450, 230);
        ctx.closePath();
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.restore();
    }
}
class Spinner {
    constructor(e) {
        this.update = () => {
            this.rot += 0.1;
            if (this.rot > 2 * Math.PI)
                this.rot -= 2 * Math.PI;
            this.draw(this.elem);
        };
        this.draw = (ctx) => {
            this.elem.fillStyle = "white";
            this.elem.fillRect(0, 0, 500, 400);
            this.elem.fillStyle = "red";
            this.elem.ellipse(200, 200, 200, 200, 0, 0, 360);
            this.elem.fill();
            this.stopper.draw(ctx);
            for (var i = this.wedges.length - 1; i >= 0; i--) {
                this.wedges[i].draw(ctx, this.rot);
            }
        };
        this.elem = e;
        this.rot = 0;
        this.stopper = new Stopper(200, 420);
        this.wedges = [];
    }
}
var main = {
    ctx: CanvasRenderingContext2D,
    spinner: Spinner,
    spin(ev) {
        console.log("Spinning...");
        console.log("Done!");
        console.log(this);
        this.update(this.spinner);
    },
    tick() {
        const f = () => {
            spinner.update(this.ctx);
        };
        const spinner = this.spinner;
        //requestAnimationFrame(f);
        setInterval(function () { f(); }, 100);
    },
    start(button, spinnerElem) {
        console.log("Hello World!");
        this.ctx = spinnerElem.getContext("2d");
        this.spinner = new Spinner(this.ctx);
        this.spinner.wedges.push(new Wedge("Spinner", 0));
        this.spinner.wedges.push(new Wedge("Pizza", Math.PI / 3));
        this.spinner.wedges.push(new Wedge("Beer", 2 * Math.PI / 3));
        this.spinner.wedges.push(new Wedge("Beer", 3 * Math.PI / 3));
        this.spinner.wedges.push(new Wedge("Beer", 4 * Math.PI / 3));
        this.spinner.wedges.push(new Wedge("Beer", 5 * Math.PI / 3));
        this.tick();
    }
};

return main;

}());