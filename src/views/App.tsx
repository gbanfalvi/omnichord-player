import { h } from 'preact'
import { AudioController } from '../controllers/audio/AudioController'
import { ChordNoteController } from '../controllers/notes/ChordNoteContoller'
import { StrumNoteController } from '../controllers/notes/StrumNoteController'
import { Controls } from './controls/Controls'
import { Instruments } from './instruments/Instruments'


export function App() {

    const audioController = new AudioController()
    const chordNoteController = new ChordNoteController(audioController)
    const strumNoteController = new StrumNoteController(audioController)

    return <div className='App'>
        <Instruments chordNoteController={chordNoteController} strumNoteController={strumNoteController} />
        <Controls />
    </div>
}