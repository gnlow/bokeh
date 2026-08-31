import { Game, int, IOPlayer, z } from "../mod.ts"

class RSP extends Game {
    async *play() {
        const sels = int().map(() =>
            this.players.map(player =>
                player.query(
                    "Choose(r/s/p)",
                    z.enum(["r", "s", "p"]),
                )
            )
        ).find(sels => new Set(sels).size == 2)
        
        /*
        {
            "pr": 
        }[[...new Set(sels)].toSorted().join("")]
        */
        
        console.log(sels)
    }
}

const g = new RSP([
    new IOPlayer,
    new IOPlayer,
])

await Array.fromAsync(g.play())
