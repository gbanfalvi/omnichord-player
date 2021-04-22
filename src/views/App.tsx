import { h } from 'preact'
import { AudioController } from '../controllers/audio/AudioController'
import { ChordNoteController } from '../controllers/notes/ChordNoteContoller'
import { StrumNoteController } from '../controllers/notes/StrumNoteController'
import { Controls } from './controls/Controls'
import { Instruments } from './instruments/Instruments'

import './App.scss'

export function App() {

    const audioController = new AudioController()
    const chordNoteController = new ChordNoteController(audioController)
    const strumNoteController = new StrumNoteController(audioController)

    return <div className='App'>
        <Controls chordNoteController={chordNoteController} strumNoteController={strumNoteController}/>
        <Instruments chordNoteController={chordNoteController} strumNoteController={strumNoteController} />
    </div>
}