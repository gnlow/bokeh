export class Asy<T> {
    constructor(readonly raw: AsyncIterable<T>) {}
    
    map<O>(f: (t: T) => O) {
        const raw = this.raw
        return new Asy((async function* () {
            for await (const x of raw) {
                yield f(await x)
            }
        })())
    }
    amap<O>(f: (t: T) => Promise<O>) {
        const raw = this.raw
        return new Asy((async function* () {
            for await (const x of raw) {
                yield await f(await x)
            }
        })())
    }
    async find(f: (t: T) => boolean) {
        for await (const x of this.raw) {
            if (f(x)) return x
        }
    }
    async toArray() {
        const res: T[] = []
        for await (const x of this.raw) {
            res.push(x)
        }
        return res
    }
    static f<Args extends any[], T>(f: (...args: Args) => AsyncIterable<T>) {
        return (...args: Args) => new Asy(f(...args))
    }
}

export const int =
Asy.f(async function* (n = Infinity) {
    for (let i=0; i<n; yield i++);
})
