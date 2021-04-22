import { WidgetType } from "../Widget";
import { BaseControlWidget } from "./BaseControlWidget";

export class ContRangeControlWidget<I, K extends keyof I> extends BaseControlWidget<I, K> {

    readonly minValue: I[K]
    readonly maxValue: I[K]
    type = WidgetType.continuousRange

    constructor(instrument: I, key: K, title: string | null, minValue: I[K], maxValue: I[K]) {
        super(instrument, key, title)
        this.minValue = minValue
        this.maxValue = maxValue
    }

}