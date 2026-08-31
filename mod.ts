import * as z from "https://esm.sh/zod@4.5.4"

const int = function *(n = Infinity) {
    for (let i=0; i<n; yield i++);
}

abstract class Player {
    constructor(
        //public name: string,
    ) {}
    abstract query<T>(
        desc: string,
        scheme: z.ZodType<T>,
    ): T
}

class IOPlayer extends Player {
    query<T>(desc: string, scheme: z.ZodType<T>) {
        return int()
            .map(() => scheme.safeParse(prompt(desc)))
            .find(x => x.success)!
            .data
    }
}

abstract class Game {
    constructor(
        readonly players: Player[],
    ) {}
    abstract play(): AsyncGenerator
}

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
