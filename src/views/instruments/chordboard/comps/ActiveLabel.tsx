import { h } from 'preact'

interface ActiveLabelProps {
    chordNames: string[]
    noteSet: string[]
}

export function ActiveLabel(props: ActiveLabelProps) {
    return <div className={`ActiveLabel col-0-4 row-0`}>
        <div className='ActiveLabelChordNames'>{props.chordNames.join(' / ')}</div>
        <div className='ActiveLabelNoteSet'>{props.noteSet.join(', ')}</div>    
    </div>
}