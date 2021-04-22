import { ContainerControlWidget } from "./widgets/container/ContainerControlWidget";

export class ControlBoard {

    readonly title: string
    readonly container: ContainerControlWidget

    constructor(title: string, container: ContainerControlWidget) {
        this.title = title
        this.container = container
    }

}