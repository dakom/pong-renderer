export interface Renderable extends Partial<Position> {
    id: RenderableId;
}

export interface Position {
    x: number;
    y: number;
}
export enum RenderableId {
    BALL = 0, 
    PADDLE1 = 1,
    PADDLE2 = 2,
    SCOREBOARD = 3,
    BG = 4
}
