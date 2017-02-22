type SpinnerElement = CanvasRenderingContext2D;

class Vec2D {
	constructor(public x, public y) {
	}
}

class Wedge {
	private rad : number;
	private text : string;
	private color : string;
	private start : number;
	private stop : number;


	constructor(radius: number, txt: string, color: string, startAngle: number, stopAngle: number) {
		this.rad = radius;
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
		ctx.font="30px Arial";
		ctx.fillText(this.text, this.rad*0.75, 0)
		ctx.restore();
	}

	public inRange(rotation : number) : boolean {

		return (Math.sin(this.start+rotation) <= 0 && Math.sin(this.stop+rotation) > 0);
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

	constructor(pos: Vec2D, radius: number) {
		this.pos = pos;
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

	public getSpeed() : number {
		return this.speed;
	}

	public startSpin = () => {
		this.speed = 20;
	}

	public currentValue() : string {
		let checkrot = this.rot
		while (checkrot > 2*Math.PI) checkrot -= 2*Math.PI;
		return ((this.wedges.filter((val) => val.inRange(checkrot))[0] || 
			new Wedge(0, "none", "white", 0, 0))).value();
	}

	public stop = (callback : Function) => {
		const id = setInterval( () => {
			this.speed -= 0.1;
			if (this.speed <= 0) {
				this.speed = 0;
				clearInterval(id);
				callback();
			}
		}, 10)
		
	}

	public draw = (ctx: CanvasRenderingContext2D) => {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		for (var i =  0; i < this.wedges.length; i++) {
			this.wedges[i].draw(ctx, this.rot);
		}

		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.ellipse(0, 0, this.radius*0.1, this.radius*0.1, 0, 0, 2*Math.PI);
		ctx.fillStyle = "#FFFF00";
		ctx.fill();
		ctx.restore();
	}

	public addChoice(text: string, colour: string, start: number, stop: number) {
		this.wedges.push(new Wedge(this.radius, text, colour, start, stop))
	}
}

class App {
	public canvas : HTMLCanvasElement;
	public controller : HTMLButtonElement;

	public ctx : CanvasRenderingContext2D;
	public spinner : Spinner;

	public height: number;
	public width: number;

	constructor(canvas : HTMLCanvasElement, controller : HTMLButtonElement) {
		this.canvas = canvas;
		this.controller = controller;
		this.ctx = canvas.getContext("2d");
		this.height = canvas.height;
		this.width = canvas.width;

		const radius = Math.min(this.width, this.height)/2;

		this.spinner = new Spinner(new Vec2D(radius, radius), radius);

		const choices = this.getChoices();
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

	private getChoices() : string[] {
		return Array(20)
			.fill()
			.map( (_, i) => ("" + (i+1) ));
	}

	public spin() {
		if (this.spinner.isStopped()) {
			this.controller.className = "stop";
			this.controller.innerText = "Stop";
			this.spinner.startSpin();
		} else {
			this.controller.disabled = true;
			this.controller.className = "waiting";
			this.controller.innerText = "Ohh.. this is exciting...";
			this.spinner.stop(() => {
				this.controller.disabled = false;
				this.controller.className = "start";
				this.controller.innerText = "Spin";
				console.log(this.spinner.currentValue());
				alert(this.spinner.currentValue());
			});
		}
	}

	tick() {
		const f = () => {
			spinner.update();
			this.draw(this.ctx);
		}
		const spinner = this.spinner;
		//requestAnimationFrame(f);
		setInterval(function(){ f()}, 100);
	}

	public draw(ctx: CanvasRenderingContext2D) {
		ctx.clearRect(0, 0, this.width, this.height);
		this.spinner.draw(this.ctx);
		if (this.spinner.getSpeed() > 2) {
			const blur = Math.min(this.spinner.getSpeed(), 5
				);
			this.canvas.style.filter = `blur(${blur}px);`;
		} else {
			this.canvas.style.filter = "";
		}
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
        const app = new App(spinnerElem, button);
    	button.onclick = app.spin.bind(app);
    }
}
