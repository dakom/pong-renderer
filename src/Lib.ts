import {Position, Renderer, RenderableId, Constants, ControllerHandler, CollisionName} from "./types/Types";
import {setupAudio, playCollision} from "./audio/Audio";
import {setupBackground} from "./background/Background";
import {startController} from "./controller/Controller";
import {createScoreboard} from "./scoreboard/Scoreboard";
import {setupRenderer} from "./renderer/Renderer-Setup";
import * as WebFont from "webfontloader";

interface SetupOptions {
    constants?:Constants,
    handleController: ControllerHandler;
}

interface SetupResult {
    constants:Readonly<Constants>;
    onRender:(gameObjects:GameObjectPositions) => void;
    onCollision: (collisionName: CollisionName | string) => void;
}

interface GameObjectPositions {
    ball: Position, 
    paddle1: Position, 
    paddle2: Position
}

export {CollisionName};

export const setup = async ({handleController, ...opts}:SetupOptions):Promise<SetupResult> =>{
    setupAudio();
    setupBackground();
    const constants = normalizeConstants(opts.constants);

    return new Promise(resolve => 
        //https://github.com/typekit/webfontloader/issues/393
        ((window as any).WebFont || WebFont).load({
            google: {
              families: ['Press Start 2P']
            },
            active: () => resolve(null)
        })
    )
    .then(() => setupRenderer(constants))
    .then((renderer:Renderer) => new Promise<SetupResult>(resolve => {
        const scoreboard = createScoreboard (constants) (renderer); 
        startController(handleController); //not passing a pause/stopper

        const onRender = ({ball, paddle1, paddle2}:{ball: Position, paddle1: Position, paddle2: Position}) => {
            renderer.render([
                {id: RenderableId.BALL, ...ball},
                {id: RenderableId.PADDLE1, ...paddle1},
                {id: RenderableId.PADDLE2, ...paddle2},
                {id: RenderableId.SCOREBOARD}
            ])
        }

        const onCollision = (collisionName:CollisionName | string) => {
            if(collisionName === CollisionName.LEFT_WALL) {
                scoreboard.addPoint(2);
            } else if(collisionName === CollisionName.RIGHT_WALL) {
                scoreboard.addPoint(1);
            } 

            playCollision(collisionName);
        }
        
        resolve({
            constants,
            onRender,
            onCollision
        });
    }));
}

export const getCenterPositions = (constants:Constants):GameObjectPositions => {
    const {canvasWidth, canvasHeight, paddleWidth} = constants;

    return {
        ball: {x: canvasWidth/2, y: canvasHeight/2},
        paddle1: {x: paddleWidth/2, y: canvasHeight/2},
        paddle2: {x: canvasWidth - (paddleWidth/2), y: canvasHeight/2},
    }
}

const normalizeConstants = (_constants:Constants):Constants => 
    Object.assign({
        ballRadius: 7.0,
        ballSpeed: 1.0,

        paddleWidth: 20.0,
        paddleHeight: 130.0,
        paddleMargin: 30.0,

        canvasWidth: 1024,
        canvasHeight: 768
    }
    , _constants);
