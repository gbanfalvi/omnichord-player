import { h } from 'preact'
import { useReducer } from 'preact/hooks'
import { DiscRangeControlWidget } from '../../../view-models/controls/widgets/control/DiscRangeControlWidget'

interface DiscRangeWidgetProps {
    discRangeWidget: DiscRangeControlWidget<any, any>
}

export function DiscRangeWidget(props: DiscRangeWidgetProps) {

    const [,forceUpdate] = useReducer(x => x+1, 0)
    const idx = props.discRangeWidget.values.findIndex((elem) => { return elem === props.discRangeWidget.value})

    function onDecrement() {
        if (idx > 0) {
            props.discRangeWidget.value = props.discRangeWidget.values[idx - 1]
        }
        forceUpdate(0)
    }

    function onIncrement() {
        if (idx < props.discRangeWidget.values.length - 1) {
            props.discRangeWidget.value = props.discRangeWidget.values[idx + 1]

        }
        forceUpdate(0)
    }

    return <div className='DiscRangeWidget'>
        <button className='RangeChange' onClick={onDecrement}>&lt;</button>
        <div className='RangeLabel'>{props.discRangeWidget.value}</div>
        <button className='RangeChange' onClick={onIncrement}>&gt;</button>
    </div>
}