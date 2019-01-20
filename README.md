A library to test web things by rendering Pong in WebGL

# [Example](https://dakom.github.io/pong-renderer/)

This snippet shows how to get up and running. 
There is no movement of any kind because that's the idea - drive this with your game logic written elsewhere :)

After `npm install --save pong-renderer`

```
import {setup, CollisionName} from "pong-renderer";


setup().then(({constants, render: _render, addPoint, playCollisionAudio}) => {
    const {canvasWidth, canvasHeight, paddleWidth} = constants;

    //Render the items in their default positions
    //Real-world would have this in a requestAnimationFrame cycle
    //With the dynamic object positions
    const render = () => _render({
        ball: {x: canvasWidth/2, y: canvasHeight/2},
        paddle1: {x: paddleWidth/2, y: canvasHeight/2},
        paddle2: {x: canvasWidth - (paddleWidth/2), y: canvasHeight/2},
    });

    //This would be called based on physics
    //We could decide to have a different audio player or use the default 
    const handleCollision = (collisionName:CollisionName) => {
        //Adding a point will re-create the score texture
        //This is a fairly heavy operation and distinct from rendering
        if(collisionName === CollisionName.LEFT_WALL) {
            addPoint(2);
        } else if(collisionName === CollisionName.RIGHT_WALL) {
            addPoint(1);
        } 

        //This is provided just to make some easy sounds 
        //Feel free to roll your own
        playCollisionAudio(collisionName);

        //re-render to show updated score
        render();
    }

    //Some browsers requires a user gesture before playing audio
    //This will add a point to player 2 when the window is clicked 
    window.onclick = () => handleCollision(CollisionName.LEFT_WALL);

    //Render the first screen
    render();
});

```

# API

There are only two exported functions, `setup()` and a little `getCenterPositions()` helper.

It's probably easiest to see how to use them from these Typescript definitions:

```

const setup = (constants?:Constants) => Promise<SetupResult>;
const getCenterPositions = (constants: Constants) => GameObjectPositions;

export interface SetupResult {
    constants:Readonly<Constants>;
    render:(gameObjects:GameObjectPositions) => void;
    playCollisionAudio: (collisionName: CollisionName) => void;
    addPoint: (player:1 | 2) => void;
}

interface GameObjectPositions {
    ball: Position;
    paddle1: Position;
    paddle2: Position;
}

export interface Position {
    x: number;
    y: number;
}

export interface Constants {
    ballRadius: number; 
    ballSpeed: number; 
    paddleWidth: number; 
    paddleHeight: number; 
    paddleMargin: number; 
    canvasWidth: number; 
    canvasHeight: number;
}
```

In plain English, it's pretty much: 

1. call `setup()` with (optional) constants for game object position, canvas size, etc.

2. get back functions that you call to render, play collision audio, and update the score

# Coordinates 

Positions are the center of the object. For example, setting the ball position to `canvasHeight/2` and the paddle position to `canvasHeight/2` will place it vertically center, regardless of the different heights of those objects

Similarly, to place the paddles flush against the side of the screen, it's `paddleWidth/2` on the left and `canvasWidth - (paddleWidth/2)` on the right

# History

Originally written as part of [FRPong](https://github.com/dakom/frpong)
