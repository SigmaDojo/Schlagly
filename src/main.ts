type SpinnerElement = CanvasRenderingContext2D;

class Spinner {
	public elem : SpinnerElement;
	public rot: number;

	constructor(e : SpinnerElement) {
		this.elem = e;
		this.rot = 0;
	}

	public update = () => {
		this.rot+=0.5;
		this.rot = this.rot % 360;

		this.elem.ellipse(200, 200, 200, 200, this.rot, 0, 360)

	}
}

export default {
	ctx : CanvasRenderingContext2D ,
	spinner : Spinner,

    spin(ev : MouseEvent) {
		console.log("Spinning...");
		console.log("Done!");
		console.log(this);
		this.update(this.spinner)
	},

	start(button : HTMLButtonElement, spinnerElem : HTMLCanvasElement) {
        console.log("Hello World!");
        this.ctx = spinnerElem.getContext("2d");
        const spinner = new Spinner(this.ctx);
        setInterval(spinner.update, 1);
        button.onclick = spinner.update;
        
    }
}