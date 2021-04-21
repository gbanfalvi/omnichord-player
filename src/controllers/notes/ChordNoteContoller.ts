import { Instrument } from "../../models/audio/Instrument"
import { Chord } from "../../models/music/Chord"
import { Key } from "../../models/music/Key"
import { Octave } from "../../models/music/Octave"
import { AudioController } from '../audio/AudioController'

type ChordKeyAndOctave = { chord: Chord, key: Key, octave: Octave }

/**
 * ChordNoteController
 * 
 * Supports overlapping chords, but the actual omnichord doesn't, so eh. Maybe
 * in a future release?
 */
export class ChordNoteController {

    octave: Octave = 3

    private audioController: AudioController

    private playedChords: ChordKeyAndOctave[] = []
    
    constructor(audioController: AudioController) {
        this.audioController = audioController
    }

    pressChordNotes(chord: Chord, key: Key) {
        const playedChord: ChordKeyAndOctave = { chord: chord, key: key, octave: this.octave }
        this.playedChords.push(playedChord)

        const notes = playedChord.chord.notes(playedChord.key, playedChord.octave)
        this.audioController.press(notes.map(n => { return { note: n, instrument: Instrument.chord } }))
    }

    releaseChordNotes(chord: Chord, key: Key) {
        const releasedChord = this.playedChords.find(pc => {
            return pc.chord === chord && pc.key === key
        })

        if (releasedChord != null) {
            this.playedChords = this.playedChords.filter(pc => { return pc !== releasedChord })
            const notes = releasedChord.chord.notes(releasedChord.key, releasedChord.octave)

            this.audioController.release(notes.map(n => { return { note: n, instrument: Instrument.chord } }))
        } else {
            throw `Couldn't release chord ${chord} ${key}`
        }
    }
}