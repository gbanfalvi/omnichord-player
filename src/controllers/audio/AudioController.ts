import { AudioNote } from "../../models/audio/AudioNote";
import { Instrument } from "../../models/audio/Instrument";
import { AudioSynth } from "./AudioSynth";

/**
 * AudioController
 * 
 * Holds on to the synths that actually play sounds and tracks the state of the
 * notes being played app-wide. The synth doesn't know.
 */
export class AudioController {

    readonly chordSynth = new AudioSynth()
    readonly strumSynth = new AudioSynth()

    private _chordNotes: AudioNote[] = []
    private _strumNotes: AudioNote[] = []

    press(notes: AudioNote[]) {
        const newChordNotes = notes
            .filter(an => { return an.instrument === Instrument.chord })
            .filter(an => { return !this._chordNotes.map(cn => { return cn.note }).includes(an.note) })

        const newStrumNotes = notes
            .filter(an => { return an.instrument === Instrument.strum })
            .filter(an => { return !this._strumNotes.map(cn => { return cn.note }).includes(an.note) })

        this._chordNotes = this._chordNotes.concat(newChordNotes)
        this._strumNotes = this._strumNotes.concat(newStrumNotes)

        this.chordSynth.playNotes(newChordNotes.map(cn => { return cn.note }))
        this.strumSynth.playNotes(newStrumNotes.map(sn => { return sn.note }))
    }

    release(notes: AudioNote[]) {
        const removedChordNotes = notes
            .filter(an => { return an.instrument === Instrument.chord })
            .filter(an => { return this._chordNotes.map(cn => { return cn.note }).includes(an.note) })

        const removedStrumNotes = notes
            .filter(an => { return an.instrument === Instrument.strum })
            .filter(an => { return this._strumNotes.map(cn => { return cn.note }).includes(an.note) })

        this._chordNotes = this._chordNotes.filter(en => { return !removedChordNotes.map(cn => { return cn.note }).includes(en.note) })
        this._strumNotes = this._strumNotes.filter(en => { return !removedStrumNotes.map(cn => { return cn.note }).includes(en.note) })

        this.chordSynth.releaseNotes(removedChordNotes.map(cn => { return cn.note }))
        this.strumSynth.releaseNotes(removedStrumNotes.map(sn => { return sn.note }))
    }
}