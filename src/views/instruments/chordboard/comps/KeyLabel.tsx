import { h } from 'preact'
import { KeyAndCol } from '../../../../view-models/instruments/chordboard/ChordBoardViewModel'


interface KeyLabelProps {
    keyAndCol: KeyAndCol
}

export function KeyLabel(props: KeyLabelProps) {
    return <div className={`KeyLabel row-0 col-${5+props.keyAndCol.col}`}>
        <div className='KeyLabelText'>{props.keyAndCol.key.label}</div>    
    </div>
}