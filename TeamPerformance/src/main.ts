type SpinnerElement = CanvasRenderingContext2D;

class Wedge {
	
	private text : string;
	private rot : number;

	constructor(txt: string, rot: number) {
		this.text = txt;
		this.rot = rot;
	}

	draw(ctx : SpinnerElement, global_rot: number) {
		ctx.save();
		ctx.translate(200, 200);
		ctx.rotate(this.rot + global_rot);
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.fillText(this.text, 150, 0)
		ctx.restore();
	}
}

class Stopper {
	private x: number;
	private y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	draw(ctx : CanvasRenderingContext2D) {
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
	public elem : SpinnerElement;
	public rot: number;

	public stopper : Stopper;
	public wedges : Array<Wedge>;

	constructor(e : SpinnerElement) {
		this.elem = e;
		this.rot = 0;

		this.stopper = new Stopper(200, 420);
		this.wedges = [];
	}

	public update = () => {
		this.rot += 0.1;
		if (this.rot > 2*Math.PI) this.rot -= 2*Math.PI;

		this.draw(this.elem);


	}

	public draw = (ctx: CanvasRenderingContext2D) => {
		this.elem.fillStyle = "white";
		this.elem.fillRect(0, 0, 500, 400)
		this.elem.fillStyle = "red";

		this.elem.ellipse(200, 200, 200, 200, 0, 0, 360);
		this.elem.fill();

		this.stopper.draw(ctx);
		for (var i = this.wedges.length - 1; i >= 0; i--) {
			this.wedges[i].draw(ctx, this.rot);
		}
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

	tick() {
		const f = () => {
			spinner.update(this.ctx);
		}
		const spinner = this.spinner;
		//requestAnimationFrame(f);
		setInterval(function(){ f()}, 100);
	},

	start(button : HTMLButtonElement, spinnerElem : HTMLCanvasElement) {
        console.log("Hello World!");
        this.ctx = spinnerElem.getContext("2d");
        this.spinner = new Spinner(this.ctx);

        this.spinner.wedges.push(new Wedge("Spinner", 0))
		this.spinner.wedges.push(new Wedge("Pizza", Math.PI/3))
		this.spinner.wedges.push(new Wedge("Beer", 2*Math.PI/3))
		this.spinner.wedges.push(new Wedge("Beer", 3*Math.PI/3))
		this.spinner.wedges.push(new Wedge("Beer", 4*Math.PI/3))
		this.spinner.wedges.push(new Wedge("Beer", 5*Math.PI/3))

		this.tick();
        
    }
}