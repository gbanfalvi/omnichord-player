import { h } from 'preact'
import { ChordNoteController } from '../../controllers/notes/ChordNoteContoller'
import { StrumNoteController } from '../../controllers/notes/StrumNoteController'
import { ControlSet } from './ControlSet'

import './Controls.scss'

interface ControlsProps {
    chordNoteController: ChordNoteController,
    strumNoteController: StrumNoteController
}


export function Controls(props: ControlsProps) {
    return <div className='Controls'>
        <ControlSet controlBoard={props.chordNoteController.controls} />
    </div>
}