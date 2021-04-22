import { WidgetType } from "../Widget";
import { BaseControlWidget } from "./BaseControlWidget";

export class ToggleControlWidget<I, K extends keyof I> extends BaseControlWidget<I, K> {

    type = WidgetType.toggle

    constructor(instrument: I, key: K, title: string | null) {
        super(instrument, key, title)
    }

}