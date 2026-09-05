import { IOPlayer, LLMPlayer } from "../mod.ts"
import { RSP } from "./RSP.ts"

const apiKey = await Deno.env.get("OPENAI_API_KEY")!
const baseURL = await Deno.env.get("OPENAI_BASE_URL")!

const g = new RSP([
    new IOPlayer("P1"),
    new LLMPlayer("P2", {
        apiKey,
        baseURL,
        model: "mistral/leanstral-1-5",
    }),
    new LLMPlayer("P3", {
        apiKey,
        baseURL,
        model: "mistral/leanstral-1-5",
    }),
])

await Array.fromAsync(g.play())
