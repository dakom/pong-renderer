import {CollisionName} from "../types/Types";

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


const playWave = (hz:number) => (time:number) => {
    const oscillator = getContext().createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(hz, getContext().currentTime);
    oscillator.connect(getContext().destination);
    oscillator.start();

    setTimeout(() => oscillator.stop(), time);
}

export const playCollision = (collisionName: CollisionName | string) => {
    switch(collisionName) {
        case "paddle1": 
        case "paddle2": playWave(440) (100); break;
        case "leftWall": playWave(110) (200); break;
        case "rightWall": playWave(880) (200); break;
        default: playWave(320) (100); break;
    }
}
