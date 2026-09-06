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
        console.log(`[-> ${this.name}]`, s)
    }
    async query<T>(desc: string, scheme: z.ZodType<T>) {
        return (await int()
            .map(() => scheme.safeParse(prompt(`[-> ${this.name}] ${desc}`)))
            .find(x => x.success))!
            .data! satisfies T
    }
}

import OpenAI from "https://esm.sh/openai@7.10.0"

export class LLMPlayer extends Player {
    openai
    model
    messages: OpenAI.ChatCompletionMessageParam[] = []
    temperature
    max_tokens
    constructor(name: string, o: {
        apiKey: string,
        baseURL: string,
        model: string,
        temperature?: number,
        max_tokens?: number,
    }) {
        super(name)
        this.openai = new OpenAI({
            apiKey: o.apiKey,
            baseURL: o.baseURL,
        })
        this.model = o.model
        this.temperature = o.temperature ?? 0.7
        this.max_tokens = o.max_tokens ?? 4096
    }
    async post(s: string) {
        this.messages.push({
            role: "user",
            content: s,
        })
    }
    async query<T>(desc: string, scheme: z.ZodType<T>) {
        await this.post(desc)
        const res = await this.openai.chat.completions.parse({
            model: this.model,
            messages: this.messages,
            temperature: this.temperature,
            max_tokens: this.max_tokens,
            response_format: {
                type: "json_schema",
                json_schema: {
                    name: "my_schema",
                    strict: true,
                    schema: z.toJSONSchema(scheme),
                }
            }
        })
        this.messages.push({
            role: "assistant",
            content: res.choices[0].message.content,
        })
        
        const parsed = scheme.parse(res.choices[0].message.parsed)
        console.log(`[<- ${this.name}] ${parsed}`)
        return parsed
    }
}
