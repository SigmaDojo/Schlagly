type SpinnerElement = CanvasRenderingContext2D;

class Vec2D {
	constructor(public x, public y) {
	}
}

class Wedge {
	private rad : number;
	private position: Vec2D;
	private text : string;
	private color : string;
	private start : number;
	private stop : number;


	constructor(radius: number, txt: string, color: string, startAngle: number, stopAngle: number) {
		this.rad = radius;
		this.position = new Vec2D(radius, radius)
		this.text = txt;
		this.color = color;
		this.start = startAngle;
		this.stop = stopAngle;

	}

	public value() :string {
		return this.text;
	}

	public width() : number { return this.stop-this.start }

	public draw(ctx : SpinnerElement, global_rot: number) {
		ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.arc(0, 0, this.rad, global_rot+this.start, global_rot+this.stop);
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "black";
		ctx.fill();
		ctx.stroke();

		/* Drawing the text */
		ctx.rotate(global_rot + this.textAngle());
		ctx.fillStyle = "white";
		ctx.textAlign = "center";
		ctx.fillText(this.text, this.rad*0.75, 0)
		ctx.restore();
	}

	public inRange(rotation : number) : boolean {
		return rotation >= this.start && rotation < this.stop;
	}

	private textAngle() : number {
		return this.start + (this.width()/2)
	}
}

class Spinner {
	private pos : Vec2D;
	private speed : number;
	private radius : number;
	private rot: number;

	public wedges : Array<Wedge>;

	constructor(radius: number) {
		this.rot = 0;
		this.speed = 0;
		this.wedges = [];
		this.radius = radius;
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

	public currentValue() : string {
		const checkrot = this.rot;
		return ((this.wedges.filter((val) => val.inRange(checkrot))[0] || 
			new Wedge(0, "none", "white", 0, 0))).value();
	}

	public stop = () => {
		const id = setInterval( () => {
			this.speed -= 0.1;
			if (this.speed <= 0) {
				this.speed = 0;
				clearInterval(id);
				console.log(this.currentValue());
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
		for (var i =  0; i < this.wedges.length; i++) {
			this.wedges[i].draw(ctx, this.rot);
		}
	}

	public addChoice(text: string, colour: string, start: number, stop: number) {
		this.wedges.push(new Wedge(this.radius, text, colour, start, stop))
	}
}

class App {
	public canvas : HTMLCanvasElement;
	public ctx : CanvasRenderingContext2D;
	public spinner : Spinner;

	public height: number;
	public width: number;

	constructor(canvas : HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
		this.height = canvas.height;
		this.width = canvas.width;

		const radius = Math.min(this.width, this.height)/2;

		this.spinner = new Spinner(radius);

		const choices = ["Spinner", "Pizza", "Code", "Beer", "Cola", "Fanta", "Burger", "Candy", "Chocklad", "Telefon"];
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

        	this.spinner.addChoice(choices[ch], colour, i*wedgeWidth, (i+1)*wedgeWidth)

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
        const app = new App(spinnerElem)
        button.onclick = app.spin.bind(app);
    }
}