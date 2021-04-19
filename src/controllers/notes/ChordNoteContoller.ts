import { Instrument } from "../../models/audio/Instrument"
import { Chord } from "../../models/music/Chord"
import { Key } from "../../models/music/Key"
import { Octave, OctaveLevel } from "../../models/music/Octave"
import { AudioController } from '../audio/AudioController'
import { ConfigurableInstrument } from "../input/ConfigurableInstrument"

type ChordKeyAndOctave = { chord: Chord, key: Key, octave: Octave }


/**
 * ChordNoteController
 * 
 * Supports overlapping chords, but the actual omnichord doesn't, so eh. Maybe
 * in a future release?
 */
export class ChordNoteController implements ConfigurableInstrument {

    private audioController: AudioController

    private _octaveLevel: OctaveLevel = 3
    private _octaveNotes = Octave.fromRoot(this._octaveLevel)
    
    private playedChords: ChordKeyAndOctave[] = []

    constructor(audioController: AudioController) {
        this.audioController = audioController
    }

    pressChordNotes(chord: Chord, key: Key) {
        const playedChord: ChordKeyAndOctave = { chord: chord, key: key, octave: this.octaveNotes}
        this.playedChords.push(playedChord)

        const notes = playedChord.chord.notes(playedChord.key, playedChord.octave)
        this.audioController.press(notes.map(n => {return {note: n, instrument: Instrument.chord}}))
    }

    releaseChordNotes(chord: Chord, key: Key) {
        const releasedChord = this.playedChords.find(pc => {
            return pc.chord === chord && pc.key === key
        })
        
        if (releasedChord != null) {
            const notes = releasedChord.chord.notes(releasedChord.key, releasedChord.octave)
            this.audioController.release(notes.map(n => {return {note: n, instrument: Instrument.chord}}))
        }
    }

    get octave(): OctaveLevel {
        return this._octaveLevel
    }

    set octave(newValue: OctaveLevel) {
        this._octaveLevel = newValue
        this._octaveNotes = Octave.fromRoot(this._octaveLevel)
    }

    get octaveNotes(): Octave {
        return this._octaveNotes
    }

}