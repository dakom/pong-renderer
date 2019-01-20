import {Position, Renderer, RenderableId, Constants, CollisionName} from "./types/Types";
import {playCollisionAudio} from "./audio/Audio";
import {setupBackground} from "./background/Background";
import {createScoreboard} from "./scoreboard/Scoreboard";
import {setupRenderer} from "./renderer/Renderer-Setup";
import * as WebFont from "webfontloader";


export interface SetupResult {
    constants:Readonly<Constants>;
    render:(gameObjects:GameObjectPositions) => void;
    playCollisionAudio: (collisionName: CollisionName) => void;
    addPoint: (player:1 | 2) => void;
}

export interface GameObjectPositions {
    ball: Position, 
    paddle1: Position, 
    paddle2: Position
}

export {CollisionName};

export const setup = async (constants?:Constants):Promise<SetupResult> =>{
    setupBackground();
    constants = _normalizeConstants(constants);

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

        const render = ({ball, paddle1, paddle2}:{ball: Position, paddle1: Position, paddle2: Position}) => {
            renderer.render([
                {id: RenderableId.BALL, ...ball},
                {id: RenderableId.PADDLE1, ...paddle1},
                {id: RenderableId.PADDLE2, ...paddle2},
                {id: RenderableId.SCOREBOARD}
            ])
        }

        resolve({
            constants,
            addPoint: scoreboard.addPoint,
            render,
            playCollisionAudio 
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

const _normalizeConstants = (_constants?:Constants):Constants => 
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
