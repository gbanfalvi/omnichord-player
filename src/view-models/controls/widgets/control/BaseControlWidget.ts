import { Widget, WidgetType } from "../Widget"

export abstract class BaseControlWidget<I, K extends keyof I> implements Widget {

    abstract type: WidgetType

    private _instrument: I
    private _key: K
    
    readonly title: string | null
    
    constructor(instrument: I, key: K, title: string | null) {
        this._instrument = instrument
        this._key = key
        this.title = title
    }

    get value(): I[K] {
        return this._instrument[this._key]
    }

    set value(newValue: I[K]) {
        this._instrument[this._key] = newValue
    }
}