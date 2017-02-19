type SpinnerElement = CanvasRenderingContext2D;

class Wedge {
	
	private text : string;
	private color : string;
	private start : number;
	private stop : number;


	constructor(txt: string, color: string, startAngle: number, stopAngle: number) {
		this.text = txt;
		this.color = color;
		this.start = startAngle;
		this.stop = stopAngle;

	}

	public width() : number { return this.stop-this.start }

	public draw(ctx : SpinnerElement, global_rot: number) {
		ctx.save();
		ctx.translate(200, 200);
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.arc(0, 0, 200, global_rot+this.start, global_rot+this.stop);
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "black";
		ctx.fill();
		ctx.stroke();
		/* Drawing the text */
		ctx.rotate(global_rot + this.textAngle());
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		//ctx.strokeText(this.text, 150, 0);
		ctx.fillText(this.text, 150, 0)
		ctx.restore();
	}

	private textAngle() : number {
		return this.start + (this.width()/2)
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
		ctx.translate(this.x, this.y);
		ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(30, -20);
        ctx.lineTo(30, 20);
        ctx.closePath();
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.restore();
	}
}

class Spinner {
	private rot: number;

	private speed : number;

	public stopper : Stopper;
	public wedges : Array<Wedge>;

	constructor() {
		this.rot = 0;
		this.speed = 0;

		this.stopper = new Stopper(420 ,200);
		this.wedges = [];
	}

	public update = () => {
		this.rot += 0.1*this.speed;
		while (this.rot > 2*Math.PI) this.rot -= 2*Math.PI;
	}

	public isStopped() : boolean {
		return this.speed == 0;
	}

	public startSpin = () => {
		this.speed = 20;
	}

	public stop = () => {
		const id = setInterval( () => {
			this.speed -= 0.1;
			if (this.speed <= 0) {
				this.speed = 0;
				clearInterval(id);
			}
		}, 10)
		
	}

	public draw = (ctx: CanvasRenderingContext2D) => {
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, 500, 400)
		ctx.fillStyle = "red";

		/*this.elem.ellipse(200, 200, 200, 200, 0, 0, 360);
		this.elem.fill();
		*/
		this.stopper.draw(ctx);
		for (var i =  0; i < this.wedges.length; i++) {
			this.wedges[i].draw(ctx, this.rot);
		}
	}
}

class App {
	public ctx : CanvasRenderingContext2D;
	public spinner : Spinner;

	constructor(ctx: CanvasRenderingContext2D) {
		this.ctx = ctx;
		this.spinner = new Spinner();


		const choices = ["Spinner", "Pizza", "Code", "Beer", "Cola", "Fanta", "Burger", "Candy"];
        let i : number = 0;
        const wedgeWidth = (2*Math.PI)/choices.length;
        let lastColour : string = "";
        let firstColour : string = "";
        for (let ch in choices) {
        	let colour = "";
        	do {
        		colour = this.randomColour();
        	} while (colour == lastColour || colour == firstColour);
        	if (i == 0) {firstColour = colour;}
        	lastColour = colour;

        	this.spinner.wedges.push(new Wedge(choices[ch], colour, i*wedgeWidth, (i+1)*wedgeWidth))
        	i++;
        }

        this.tick();
	}

	public spin() {
		if (this.spinner.isStopped()) {
			this.spinner.startSpin();
		} else {
			this.spinner.stop();
		}
	}

	tick() {
		const f = () => {
			spinner.update();
			spinner.draw(this.ctx);
		}
		const spinner = this.spinner;
		//requestAnimationFrame(f);
		setInterval(function(){ f()}, 100);
	}

	private colours = ["red", "green", "blue", "silver", "black", "purple", "#aa5555", "#aaaa30"]
	private randomColour() : string {
		let id = Math.floor(Math.random()*this.colours.length);
		return this.colours[id];
	}
}

export default {


	start(button : HTMLButtonElement, spinnerElem : HTMLCanvasElement) {
        const ctx = spinnerElem.getContext("2d");
        const app = new App(ctx)
        button.onclick = app.spin.bind(app);
    }
}