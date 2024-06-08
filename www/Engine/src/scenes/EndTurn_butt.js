
// You can write more code here

/* START OF COMPILED CODE */

class EndTurn_butt extends Phaser.GameObjects.Container {

	constructor(scene, x, y) {
		super(scene, x ?? 93, y ?? 37);

		// button
		const button = scene.add.image(0, 0, "Button");
		button.scaleX = 3;
		button.scaleY = 3;
		button.tintTopLeft = 15027455;
		button.tintTopRight = 6553804;
		button.tintBottomLeft = 16753314;
		button.tintBottomRight = 5046257;
		this.add(button);

		// text_1
		const text_1 = scene.add.text(-57, -17, "", {});
		text_1.text = "EndTurn";
		text_1.setStyle({ "color": "#000000ff", "fontSize": "25px", "fontStyle": "bold" });
		this.add(text_1);

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
