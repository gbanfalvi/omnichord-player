import { h } from 'preact'
import { ContainerControlWidget } from '../../../view-models/controls/widgets/container/ContainerControlWidget'
import { AbstractWidget } from './AbstractWidget'

interface ContainerWidgetProps {
    containerWidget: ContainerControlWidget
}

export function ContainerWidget(props: ContainerWidgetProps) {
    return <div className={`ContainerWidget ${props.containerWidget.arrangement}`}>
        {props.containerWidget.children.map( (childWidget, idx) => {
            return <AbstractWidget widget={childWidget} key={idx} />
        })}
    </div>
}