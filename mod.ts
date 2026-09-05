import * as z from "https://esm.sh/zod@4.5.4"
export * as z from "https://esm.sh/zod@4.5.4"
import { Asy } from "./src/Asy.ts"

export const int =
Asy.f(async function* (n = Infinity) {
    for (let i=0; i<n; yield i++);
})

export abstract class Player {
    constructor(
        public name: string,
    ) {}
    abstract post(s: string): Promise<void>
    abstract query<T>(
        desc: string,
        scheme: z.ZodType<T>,
    ): Promise<T>
}

export class IOPlayer extends Player {
    async post(s: string) {
        console.log(`[${this.name}]`, s)
    }
    async query<T>(desc: string, scheme: z.ZodType<T>) {
        return (await int()
            .map(() => scheme.safeParse(prompt(`[${this.name}] ${desc}`)))
            .find(x => x.success))!
            .data! satisfies T
    }
}

export abstract class Game {
    constructor(
        readonly players: Player[],
    ) {}
    abstract play(): AsyncGenerator
}
