import { h } from 'preact'
import { ControlBoard } from '../../view-models/controls/ControlBoard'
import { AbstractWidget } from './widgets/AbstractWidget'

interface ControlSetProps {
    controlBoard: ControlBoard
}

export function ControlSet(props: ControlSetProps) {
    return <div className='ControlSet'>
        <div className='TitleLabel'>{props.controlBoard.title}</div>
        <AbstractWidget widget={props.controlBoard.container} />
    </div>
}