A library to test web frameworks by rendering pong

# EXAMPLE

```
import {setup, CollisionName} from "pong-renderer";

const handleController = evt => {
    console.log(evt);

    //Give Player 2 a point and play the audio
    //Just to demo since some browsers require a gesture first
    //In order to play audio
    onCollision(CollisionName.LEFT_WALL);
}
setup({ handleController}).then(({constants, onRender, onCollision}) => {
    const {canvasWidth, canvasHeight, ballRadius, paddleWidth, paddleHeight} = constants;

    //Render the items in the middle of the screen (without helper)
    onRender({
        ball: {x: canvasWidth/2, y: canvasHeight/2},
        paddle1: {x: paddleWidth/2, y: canvasHeight/2},
        paddle2: {x: canvasWidth - (paddleWidth/2), y: canvasHeight/2},
    });

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
