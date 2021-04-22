import { WidgetType } from "../Widget";
import { BaseControlWidget } from "./BaseControlWidget";

export class DiscRangeControlWidget<I, K extends keyof I> extends BaseControlWidget<I, K> {

    readonly values: I[K][]
    type = WidgetType.discreteRange

    constructor(instrument: I, key: K, title: string | null, values: I[K][]) {
        super(instrument, key, title)
        this.values = values
    }

}