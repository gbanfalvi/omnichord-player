import { h } from 'preact'
import { ChordNoteController } from '../../controllers/notes/ChordNoteContoller'
import { StrumNoteController } from '../../controllers/notes/StrumNoteController'
import { Chordboard } from './chordboard/Chordboard'
import { Strumboard } from './strumboard/Strumboard'

interface InstrumentsProps {
    chordNoteController: ChordNoteController,
    strumNoteController: StrumNoteController
}

export function Instruments(props: InstrumentsProps) {

return <div className='Instruments'>
        <Chordboard chordNoteController={props.chordNoteController} />
        <Strumboard />
    </div>
}