import {CollisionName} from "../types/Types";
import {unreachable} from "../utils/Utils";

let _ctx:AudioContext;

const getContext = () => {
    if(!_ctx) {
        
	const ctor = (window as any).AudioContext || (window as any).webkitAudioContext || undefined;
	if (!ctor) {
    alert("Sorry, but the Web Audio API is not supported by your browser.");
	}
  
        _ctx = new ctor();
    }

    return _ctx;
}


const _playWave = (hz:number) => (time:number) => {
    const oscillator = getContext().createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(hz, getContext().currentTime);
    oscillator.connect(getContext().destination);
    oscillator.start();

    setTimeout(() => oscillator.stop(), time);
}

const play440 = _playWave(440);
const play110 = _playWave(110);
const play880 = _playWave(880);
const play320 = _playWave(320);

export const playCollisionAudio = (collisionName: CollisionName) => {
    switch(collisionName) {
        case CollisionName.PADDLE1: 
        case CollisionName.PADDLE2: play440 (100); break;
        case CollisionName.LEFT_WALL: play110 (200); break;
        case CollisionName.RIGHT_WALL: play880 (200); break;
        case CollisionName.TOP_WALL:
        case CollisionName.BOTTOM_WALL: play320 (100); break;
        default: unreachable(collisionName); 

    }
}

