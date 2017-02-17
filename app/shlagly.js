var Shlagly = (function () {
'use strict';

class Spinner {
    constructor(e) {
        this.update = () => {
            this.rot += 0.5;
            this.rot = this.rot % 360;
            this.elem.ellipse(200, 200, 200, 200, this.rot, 0, 360);
        };
        this.elem = e;
        this.rot = 0;
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
    start(button, spinnerElem) {
        console.log("Hello World!");
        this.ctx = spinnerElem.getContext("2d");
        const spinner = new Spinner(this.ctx);
        setInterval(spinner.update, 1);
        button.onclick = spinner.update;
    }
};

return main;

}());