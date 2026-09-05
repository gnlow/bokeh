import { Game, int, z } from "../mod.ts"

export class RSP extends Game {
    async *play() {
        const sels = (await int().amap(() =>
            Promise.all(this.players.map(async (player) => ({
                player,
                choice: await player.query(
                    "Choose(r/s/p)",
                    z.enum(["r", "s", "p"]),
                ),
            })))
        ).find(sels => new Set(sels.map(x => x.choice)).size == 2))!
        
        const winChoice = [...new Set(sels.map(x => x.choice))].toSorted()[0]
        
        sels.forEach(({ player, choice }) => {
            choice == winChoice
                ? player.post("you win")
                : player.post("you lose")
            player.post(
                `Other Players:\n`+
                sels.map(o => `  [${o.player.name}] ${o.choice}`)
                    .join("\n")
            )
        })
    }
}
