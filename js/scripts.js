////////////////////////////////////////////
// 		VARIABLES
////////////////////////////////////////////

	var phG1 = {};

	// then below there you can add things
	
	// setup game parameters
	/* 
	* creating an instance of a Phaser.Game object and assigning it to a local variable called 'game'. 
	* Calling it 'game' is a common practice, but not a requirement, and this is what you will find in the Phaser examples.
	* The first two parameters are the width and the height of the canvas element that Phaser will create. In this case 800 x 600 pixels. Your game world can be any size you like, but this is the resolution the game will display in. 
	* The third parameter can be either Phaser.CANVAS, Phaser.WEBGL, or Phaser.AUTO. 
		* This is the rendering context that you want to use. The recommended parameter is Phaser.AUTO which automatically tries to use WebGL, but if the browser or device doesn't support it it'll fall back to Canvas.
	* The fourth parameter is an empty string, this is the id of the DOM element in which you would like to insert the canvas element that Phaser creates. 
		* As we've left it blank it will simply be appended to the body. 
	* The final parameter is an object containing four references to Phasers essential functions. 
		* Their use is thoroughly explained here. 
		* Note that this object isn't required - Phaser supports a full State system allowing you to break your code into much cleaner single objects. 
		* But for a simple Getting Started guide such as this we'll use this approach as it allows for faster prototyping.
		* WARNING:  you cannot use phG1.preload, phG1.create or phG1.update... only regular functions work!
	*/

	// setup a new game
	phG1.game = new Phaser.Game(800,600, Phaser.AUTO, 'phaser-game-one', {preload: preload, create: create, update: update});

////////////////////////////////////////////
// 		END VARIABLES
////////////////////////////////////////////


////////////////////////////////////////////
// 		FUNCTIONS
////////////////////////////////////////////
	// don't forget to call the function in EXECUTION CODE area before running

	/* 
	* load the assets we need for our game. You do this by putting calls to game.load inside of a function called preload. Phaser will automatically look for this function when it starts and load anything defined within it.
	* 
	*/


	function preload () {
		this.game.load.image('sky','../assets/sky.png');
		this.game.load.image('ground','../assets/platform.png');
		this.game.load.image('star','../assets/star.png');
		this.game.load.spritesheet('dude','../assets/dude.png');
	}

	/* 
	* this is where you actually create things you can see on the canvas
	* 
	*/


	function create () {
		this.game.add.sprite(0,0,'star');
	}


	function update () {
		// body...
	}

////////////////////////////////////////////
// 		END FUNCTIONS
////////////////////////////////////////////


////////////////////////////////////////////
// 		EVENTS
////////////////////////////////////////////
	// for storing various event listeners
	// this method will be used to listen for the open and close events and trigger those methods
	// Ryan C often uses this though Drew doesn't always
	phG1.events = function () {
		//
	}
////////////////////////////////////////////
// 		END EVENTS
////////////////////////////////////////////



////////////////////////////////////////////
// 		INIT
////////////////////////////////////////////
	// method to initialize our application
	// all our code will be put inside here
	// you should not be defining things in here
	phG1.init = function () {
		this.events();
	}
////////////////////////////////////////////
// 		END INIT
////////////////////////////////////////////

////////////////////////////////////////////
// 		EXECUTION CODE
////////////////////////////////////////////
	jQuery(document).ready(function($) {
		phG1.init();
	});  //end doc.onready function
////////////////////////////////////////////
// 		END EXECUTION CODE
////////////////////////////////////////////