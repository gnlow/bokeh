import * as z from "https://esm.sh/zod@4.5.4"
export * as z from "https://esm.sh/zod@4.5.4"

export const int = function *(n = Infinity) {
    for (let i=0; i<n; yield i++);
}

export abstract class Player {
    constructor(
        //public name: string,
    ) {}
    abstract post(s: string): void
    abstract query<T>(
        desc: string,
        scheme: z.ZodType<T>,
    ): T
}

export class IOPlayer extends Player {
    post(s: string) {
        console.log(s)
    }
    query<T>(desc: string, scheme: z.ZodType<T>) {
        return int()
            .map(() => scheme.safeParse(prompt(desc)))
            .find(x => x.success)!
            .data
    }
}

export abstract class Game {
    constructor(
        readonly players: Player[],
    ) {}
    abstract play(): AsyncGenerator
}
