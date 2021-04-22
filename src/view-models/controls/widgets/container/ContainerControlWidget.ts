import { Widget, WidgetType } from "../Widget"

export enum ContainerArrangement {
    horizontal = 'horizontal',
    vertical = 'vertical'
}

export class ContainerControlWidget implements Widget {

    readonly type = WidgetType.container
    readonly title: string | null
    readonly arrangement: ContainerArrangement
    readonly children: Widget[]


    constructor(title: string | null, arrangement: ContainerArrangement, children: Widget[]) {
        this.title = title
        this.arrangement = arrangement
        this.children = children
    }

}