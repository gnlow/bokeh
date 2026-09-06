export * from "./src/Asy.ts"
export * from "./src/deps.ts"
export * from "./src/Player.ts"

import { Player } from "./src/Player.ts"

export abstract class Game {
    constructor(
        readonly players: Player[],
    ) {}
    abstract play(): AsyncGenerator
    async post(s: string) {
        await Promise.all(this.players.map(player =>
            player.post(s)
        ))
    }
}
