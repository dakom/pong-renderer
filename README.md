A library to test web frameworks by rendering pong

# EXAMPLE

```
import {setup, CollisionName, ControllerValue} from "pong-renderer";

//The only thing that really needs to be passed in
const handleController = (value:ControllerValue) => {
    if(value === ControllerValue.UP) {
        //Move paddle
    }
}

setup({ handleController}).then(({constants, onRender, onCollision}) => {
    const {canvasWidth, canvasHeight, ballRadius, paddleWidth, paddleHeight} = constants;

    //Render the items in the middle of the screen (without helper)
    //Real-world would have this in a requestAnimationFrame cycle
    //With the dynamic object positions
    onRender({
        ball: {x: canvasWidth/2, y: canvasHeight/2},
        paddle1: {x: paddleWidth/2, y: canvasHeight/2},
        paddle2: {x: canvasWidth - (paddleWidth/2), y: canvasHeight/2},
    });

    //Real-world would have this based on proper collision detection
    //This may not even execute as-is in some browsers due to
    //Requiring a user gesture before playing audio
    onCollision(CollisionName.LEFT_WALL);
});
```

# API

There are only two exported functions, `setup()` and a little `getCenterPositions()` helper.

It's probably easiest to see how to use them from these Typescript definitions:

```

const setup = (options: SetupOptions) => Promise<SetupResult>;
const getCenterPositions = (constants: Constants) => GameObjectPositions;

interface SetupOptions {
    constants?: Constants;
    handleController: ControllerHandler;
}
interface SetupResult {
    constants: Readonly<Constants>;
    onRender: (gameObjects: GameObjectPositions) => void;
    onCollision: (collisionName: CollisionName | string) => void;
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

export type ControllerHandler = (value:ControllerValue) => void;

export enum ControllerValue {
    UP = "up",
    DOWN = "down",
    NEUTRAL = "neutral",
    SERVE = "serve"
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

1. call `setup()` with (optional) configuration options and a (mandatory) ControllerHandler
2. get back an `onRender()` callback that you use to render (hint: call it in a rAF cycle) and `onCollision` that you use when the ball and paddle collide. You also get back the final constants (i.e. in the case where you didn't override them)

# Controls

The keyboard bindings are currently hardcoded in order to allow a simpler API. This may change in the future:

* Serve Ball: **Space**
* Move Paddle: **up/w** or **down/s**

# Sounds and graphics

Same idea - hard coded to make it simple. Could be swapable in the future, but whatever.

# Coordinates 

Positions are the center of the object. For example, setting the ball position to `canvasHeight/2` and the paddle position to `canvasHeight/2` will place it vertically center, regardless of the different heights of those objects

Similarly, to place the paddles flush against the side of the screen, it's `paddleWidth/2` on the left and `canvasWidth - (paddleWidth/2)` on the right

# History

Originally written as part of [FRPong](https://github.com/dakom/frpong)
