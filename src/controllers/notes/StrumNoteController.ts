import { Chord } from "../../models/music/Chord";
import { AudioController } from '../audio/AudioController'

export class StrumNoteController {

    audioController: AudioController

    constructor(audioController: AudioController) {
        this.audioController = audioController
    }

    pressStrumNote(noteIdx: number) {

    }

    releaseStrumNote(noteIdx: number) {

    }

    setChord(chord: Chord) {

    }
}