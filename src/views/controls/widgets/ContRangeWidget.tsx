import { h } from 'preact'
import { useReducer } from 'preact/hooks'
import { ContRangeControlWidget } from '../../../view-models/controls/widgets/control/ContRangeControlWidget'

interface ContRangeWidgetProps {
    contRangeWidget: ContRangeControlWidget<any, any>
}

export function ContRangeWidget(props: ContRangeWidgetProps) {

    const [,forceUpdate] = useReducer(x => x+1, 0)

    function onValueChange(value: number) {
        props.contRangeWidget.value = value
        forceUpdate(0)
    }

    return <div className='ContRangeWidget'>
        <div className='RangeLabel'>{props.contRangeWidget.minValue}</div>
        <input className='RangeInput' type='range' value={props.contRangeWidget.value} min={props.contRangeWidget.minValue} max={props.contRangeWidget.maxValue} onInput={e=>{onValueChange(parseFloat(e.currentTarget.value))}}/>
        <div className='ValueLabel'>{props.contRangeWidget.value}</div>
        <div className='RangeLabel'>{props.contRangeWidget.maxValue}</div>
    </div>
}