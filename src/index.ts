import { AudioController } from './controllers/audio/AudioController'
import { InputController } from './controllers/input/InputController'
import { ChordNoteController } from './controllers/notes/ChordNoteContoller'
import { StrumNoteController } from './controllers/notes/StrumNoteController'

const audioController = new AudioController()

const chordNoteController = new ChordNoteController(audioController)
const strumNoteController = new StrumNoteController(audioController)

const inputController = new InputController(chordNoteController, strumNoteController)
inputController.setup()