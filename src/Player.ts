import { int } from "./Asy.ts"
import { z } from "./deps.ts"

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
