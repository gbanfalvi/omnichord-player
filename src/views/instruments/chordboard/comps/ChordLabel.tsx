import { h } from 'preact'
import { ChordRowsAndCols } from '../Chordboard'

interface ChordLabelProps {
    chordsRowsAndCol: ChordRowsAndCols
}

export function ChordLabel(props: ChordLabelProps) {
    return <div className={`ChordLabel col-${props.chordsRowsAndCol.col} row-${props.chordsRowsAndCol.rows.length == 1 ? props.chordsRowsAndCol.rows[0] + 1 : `${props.chordsRowsAndCol.rows[0] + 1}-${props.chordsRowsAndCol.rows[props.chordsRowsAndCol.rows.length - 1] + 1}`}`}>
        <div className='ChordLabelTextContainer'>
            <div className='ChordLabelText'>
                {props.chordsRowsAndCol.chord.name}
            </div>
        </div>
        <div className='ChordLabelMarkerContainer'>
            {props.chordsRowsAndCol.rows.map((_, idx) => {
                return <div className='ChordLabelMarker' key={idx}></div>
            })}
        </div>
    </div>
}