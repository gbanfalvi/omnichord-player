import { h } from 'preact'
import { useReducer } from 'preact/hooks'
import { ToggleControlWidget } from '../../../view-models/controls/widgets/control/ToggleControlWidget'

interface ToggleWidgetProps {
    toggleWidget: ToggleControlWidget<any, any>
}

export function ToggleWidget(props: ToggleWidgetProps) {

    const [, forceUpdate] = useReducer(x => x + 1, 0)

    function onPress() {
        props.toggleWidget.value = !props.toggleWidget.value
        forceUpdate(0)
    }

    return <div className='ToggleWidget'>
        <button className={`StateChange ${props.toggleWidget.value === true ? 'enabled' : ''}`} onClick={onPress}>{props.toggleWidget.value === true ? 'I' : 'O'}</button>
    </div>
}