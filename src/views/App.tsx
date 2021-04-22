import { h } from 'preact'
import { ChordNoteController } from '../controllers/notes/ChordNoteContoller'
import { StrumNoteController } from '../controllers/notes/StrumNoteController'
import { Controls } from './controls/Controls'
import { Instruments } from './instruments/Instruments'

import './App.scss'
import { AudioSynth } from '../controllers/audio/AudioSynth'

export function App() {

    const chordNoteController = new ChordNoteController(new AudioSynth())
    const strumNoteController = new StrumNoteController()

    return <div className='App'>
        <Controls chordNoteController={chordNoteController} strumNoteController={strumNoteController}/>
        <Instruments chordNoteController={chordNoteController} strumNoteController={strumNoteController} />
    </div>
}