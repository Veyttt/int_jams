
// You can write more code here

/* START OF COMPILED CODE */

class Leave_match extends Phaser.GameObjects.Container {

	constructor(scene, x, y) {
		super(scene, x ?? 63, y ?? 32);

		// button
		const button = scene.add.image(30, 5, "Button");
		button.scaleX = 3;
		button.scaleY = 3;
		button.tintTopLeft = 14548992;
		button.tintTopRight = 14680064;
		button.tintBottomLeft = 13369344;
		button.tintBottomRight = 16056320;
		this.add(button);

		// text_1
		const text_1 = scene.add.text(-50, -12, "", {});
		text_1.text = "LeaveMatch";
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
