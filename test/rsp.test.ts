import { Game, int, IOPlayer, z } from "../mod.ts"

class RSP extends Game {
    async *play() {
        const sels = int().map(() =>
            this.players.map(player => ({
                player,
                choice: player.query(
                    "Choose(r/s/p)",
                    z.enum(["r", "s", "p"]),
                ),
            }))
        ).find(sels => new Set(sels.map(x => x.choice)).size == 2)!
        
        const winChoice = [...new Set(sels.map(x => x.choice))].toSorted()[0]
        
        sels.forEach(({ player, choice }) =>
            choice == winChoice
                ? player.post("you win")
                : player.post("you lose")
        )
    }
}

const g = new RSP([
    new IOPlayer("P1"),
    new IOPlayer("P2"),
    new IOPlayer("P3"),
])

await Array.fromAsync(g.play())
