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

	// this variable helps with creating ledges
	phG1.platforms;
	phG1.player;
	phG1.cursors;

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
		this.game.load.spritesheet('dude','../assets/dude.png',32,48);
	}

	/* 
	* this is where you actually create things you can see on the canvas
	* The order in which items are rendered in the display matches the order in which you create them. 
		* this.game.add.sprite(0,0,'star');
	* So if you wish to place a background behind the star sprite you would need to ensure that it was added as a sprite first, before the star.
	* Under the hood game.add.sprite is creating a new Phaser.Sprite object and adding the sprite to the “game world”. 
		* This world is where all your objects live, it can be compared to the Stage in Actionscript3.
		* Note: The game world has no fixed size and extends infinitely in all directions, with 0, 0 being the center of it. For convenience Phaser places 0, 0 at the top left of your game for you, but by using the built-in Camera you can move around as needed.
		* The world class can be accessed via game.world and comes with a lot of handy methods and properties to help you distribute your objects inside the world. It includes some simple properties like game.world.height, but also some more advanced ones that we will use in another tutorial.
	* This is where we start to create the game world...
	*/


	function create () {
		// this.game.add.sprite(0,0,'star');
		
		// we're going to use physics, so enable Arcade Physics system
		phG1.game.physics.startSystem(Phaser.Physics.ARCADE);

		// a simple background for the game
		// The first part is the same as the star sprite we had before, only instead we changed the key to 'sky' and it has displayed our sky background instead. This is an 800x600 PNG that fills the game screen.
		phG1.game.add.sprite(0,0,'sky');

		// the platforms group contains the ground and the 2 ledges we can jump on
		phG1.platforms = phG1.game.add.group();

		// we will enable physics for any object that is created in this group
		phG1.platforms.enableBody = true;

		// now we create the ground
		phG1.ground = phG1.platforms.create(0,phG1.game.world.height - 64, 'ground');

		// scale it to fit the width of the game (the original sprite is 400 x 32 in size)
		phG1.ground.scale.setTo(2,2);

		// this stops it from falling away when you jump on it
		phG1.ground.body.immovable = true;

		// ----------------------------------------
		// LEDGES  ------------------
		// ----------------------------------------
			// now create 2 ledges
			
			// ................... LEDGE #1...................
				// create ledge #1
				phG1.ledge = phG1.platforms.create(400,400,'ground');

				// make the ledge immovable
				phG1.ledge.body.immovable = true;
			// ...................END LEDGE #1 ...................
			
			// ................... LEDGE #2...................
				// create ledge #2 and position
				phG1.ledge = phG1.platforms.create(-150,250,'ground');

				// make the ledge immovable
				phG1.ledge.body.immovable = true;
			// ...................END LEDGE #2 ...................
			
		// ----------------------------------------
		// END LEDGES  ------------------
		// ----------------------------------------

		// ----------------------------------------
		// PLAYER ONE  ------------------
		// ----------------------------------------
			
			/* 
			* This creates a new sprite called 'player', positioned at 32 pixels by 150 pixels from the bottom of the game. 
			* We're telling it to use the 'dude' asset previously loaded. 
				* If you glance back to the preload function you'll see that 'dude' was loaded as a sprite sheet, not an image. 
				* That is because it contains animation frames. 
				* You can see 9 frames in total, 4 for running left, 1 for facing the camera and 4 for running right. 
				* Note: Phaser supports flipping sprites to save on animation frames, but for the sake of this tutorial we'll keep it old school.
			* 
			*/

			phG1.player = phG1.game.add.sprite(32,phG1.game.world.height - 150,'dude');

			// enable physics on the player
			phG1.game.physics.arcade.enable(phG1.player);

			// player physics properties...  give the little guy a slight bounce...
			/* 
			* phG1.player.body.gravity.y = 300;
				* This is an arbitrary value, but logically, the higher the value, the heavier your object feels and the quicker it falls. If you add this to your code or run part5.html you will see that the player falls down without stopping, completely ignoring the ground we created earlier...
				* The reason for this is that we're not yet testing for collision between the ground and the player. We already told Phaser that our ground and ledges would be immovable. 
				* Had we not done that when the player collided with them it would stop for a moment and then everything would have collapsed. This is because unless told otherwise, the ground sprite is a moving physical object (also known as a dynamic body) and when the player hits it, the resulting force of the collision is applied to the ground, therefore, the two bodies exchange their velocities and ground starts falling as well.
			* 
			*/
			phG1.player.body.bounce.y = 0.2;
			phG1.player.body.gravity.y = 300;
			phG1.player.body.collideWorldBounds = true;

			// player animations...  walking left and right
			/* 
			* We define two animations called 'left' and 'right'. 
			* The 'left' animation uses frames 0, 1, 2 and 3 and runs at 10 frames per second. 
			* The 'true' parameter tells the animation to loop. 
			* This is our standard run-cycle and we repeat it for running in the opposite direction. 
			* With the animations set we create a few physics properties.
			* 
			*/

			phG1.player.animations.add('left',[0,1,2,3],10,true);
			phG1.player.animations.add('right',[5,6,7,8],10,true);

		// ----------------------------------------
		// END PLAYER ONE  ------------------
		// ----------------------------------------

		// ----------------------------------------
		// CONTROLS  ------------------
		// ----------------------------------------
			/* 
			* Colliding is all good and well, but we really need the player to move. You would probably think of heading to the documentation and searching about how to add an event listener, but that is not necessary here. 
			* Phaser has a built-in Keyboard manager and one of the benefits of using that is this handy little function
			* This populates the cursors object with four properties: up, down, left, right, that are all instances of Phaser.Key objects.
			* then add some more polling functions in update()
			* 
			*/


			phG1.cursors = phG1.game.input.keyboard.createCursorKeys();
		// ----------------------------------------
		// END CONTROLS  ------------------
		// ----------------------------------------

	}


	function update () {

		// ----------------------------------------
		// PHYSICS  ------------------
		// ----------------------------------------
			/* 
			* So to allow the player to collide and take advantage of the physics properties we need to introduce a collision check in the update function
			* 
			*/

			// collide the player and the stars with the platforms
			// you include the variables of the objects that are subject to this new physics law of your game world
			phG1.game.physics.arcade.collide(phG1.player,phG1.platforms);

			// reset the player's velocity (movement)
			phG1.player.body.velocity.x = 0;
		// ----------------------------------------
		// END PHYSICS  ------------------
		// ----------------------------------------
		
		// ----------------------------------------
		// CONTROLS  ------------------
		// ----------------------------------------
		
			/* 
			* The first thing we do is reset the horizontal velocity on the sprite. 
			* Then we check to see if the left cursor key is held down. 
				* If it is we apply a negative horizontal velocity and start the 'left' running animation. 
			* If they are holding down 'right' instead we literally do the opposite. 
			* By clearing the velocity and setting it in this manner, every frame, it creates a 'stop-start' style of movement.
			* The player sprite will move only when a key is held down and stop immediately they are not. 
			* Phaser also allows you to create more complex motions, with momentum and acceleration, but this gives us the effect we need for this game. 
			* The final part of the key check sets the frame to 4 if no key is held down. 
				* Frame 4 in the sprite sheet is the one of the player looking at you, idle.
			* 
			*/



			if (phG1.cursors.left.isDown) {
				// move to the left by x pixels
				phG1.player.body.velocity.x = -150;
				// run the animation named...
				phG1.player.animations.play('left');
			}
			else if (phG1.cursors.right.isDown) {
				// move to the right by x pixels
				phG1.player.body.velocity.x = 150;
				// run the animation named...
				phG1.player.animations.play('right');
			}
			else {
				// stand still...
				// stop all animations
				phG1.player.animations.stop();

				phG1.player.frame = 4;
			}

			// allow the player to jump if they are touching the ground...
			/* 
			* The final part of the code adds the ability to jump. 
			* The up cursor is our jump key and we test if that is down. 
			* However we also test if the player is touching the floor, otherwise they could jump while in mid-air. 
			* If both of these conditions are met we apply a vertical velocity of 350 px/sec sq. 
			* The player will fall to the ground automatically because of the gravity value we applied to it. 
			* 
			*/

			if (phG1.cursors.up.isDown && phG1.player.body.touching.down) {
				phG1.player.body.velocity.y = -350;
			}
		// ----------------------------------------
		// END CONTROLS  ------------------
		// ----------------------------------------

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