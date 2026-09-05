import { IOPlayer } from "../mod.ts"
import { RSP } from "./RSP.ts"

const g = new RSP([
    new IOPlayer("P1"),
    new IOPlayer("P2"),
    new IOPlayer("P3"),
])

await Array.fromAsync(g.play())
