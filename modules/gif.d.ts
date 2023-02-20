interface addGifOptions {
    type: keyof GifTypes
    gifURL: URL
}


interface GifTypes {
    blush: string
    punch: string
}


interface createGifCategoryOptions {
    name: string
    channel?: object
    gifURL: URL[]
}

declare class Gif {
    constructor(opts: object)
    public gifs: URL[]

    public addGif(opts: addGifOptions): this
    public createGifCategory(opts: createGifCategoryOptions): this
}

export {Gif, GifTypes}