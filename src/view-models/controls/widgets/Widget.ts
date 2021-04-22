import { ContainerControlWidget } from "./container/ContainerControlWidget";
import { ContRangeControlWidget } from "./control/ContRangeControlWidget";
import { DiscRangeControlWidget } from "./control/DiscRangeControlWidget";
import { ToggleControlWidget } from "./control/ToggleControlWidget";

export enum WidgetType {
    container,
    continuousRange,
    discreteRange,
    toggle
}

export interface Widget {
    type: WidgetType
    title: string | null
}

export function isContainerWidget(widget: Widget): widget is ContainerControlWidget {
    return widget.type === WidgetType.container
}

export function isContRangeWidget(widget: Widget): widget is ContRangeControlWidget<any, any> {
    return widget.type === WidgetType.continuousRange
}

export function isDiscRangeWidget(widget: Widget): widget is DiscRangeControlWidget<any, any> {
    return widget.type === WidgetType.discreteRange
}

export function isToggleWidget(widget: Widget): widget is ToggleControlWidget<any, any> {
    return widget.type === WidgetType.toggle
}