export default {
	spin() {
		console.log("Spinning...");
		setTimeout(function() {
			console.log("Done!");
		}, 2000);
	},

	start(button: any) {
        console.log("Hello World!");
        button.onclick(function() {
        	console.log("Spinning...");
        })
    }
}