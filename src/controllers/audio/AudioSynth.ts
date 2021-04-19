import * as Tone from 'tone'
import { Note } from '../../models/music/Note'

/**
 * AudioSynth
 * 
 * Combination of several synths (with their respective oscillators) to be able
 * to mess with the sound.
 * 
 * Sine -----\
 *            |---\
 * Triangle -/     \ ____
 *                 /
 *         Pulse -/
 * 
 */
export class AudioSynth {

    private _triangleSynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'triangle', partialCount: 0, phase: 0 },
            envelope: {
                attack: 0.01, attackCurve: 'linear',
                decay: 0.1, decayCurve: 'exponential',
                sustain: 0.3,
                release: 1, releaseCurve: 'exponential'
            }
        })

    private _sineSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "sine", partialCount: 0, phase: 0 },
        envelope: {
            attack: 0.0, attackCurve: 'linear',
            decay: 0.1, decayCurve: 'exponential',
            sustain: 0.5,
            release: 1, releaseCurve: 'exponential'
        }
    }).toDestination()

    private _triangleSineCrossfade = new Tone.CrossFade()

    private _squareSynth = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "pulse" } })

    private _squareCrossfade = new Tone.CrossFade()

    constructor() {
        this._triangleSynth.connect(this._triangleSineCrossfade.a)
        this._sineSynth.connect(this._triangleSineCrossfade.b)
        this._triangleSineCrossfade.connect(this._squareCrossfade.a)
        this._squareSynth.connect(this._squareCrossfade.b)


        this.triangleSineFade = 0
        this.squareFade = 0
    }

    get triangleSineFade(): number {
        return this._triangleSineCrossfade.fade.value
    }

    set triangleSineFade(val: number) {
        this._triangleSineCrossfade.fade.value = val
    }

    get squareFade(): number {
        return this._squareCrossfade.fade.value
    }

    set squareFade(val: number) {
        this._squareCrossfade.fade.value = val
    }

    playNotes(notes: Note[]) {
        this._triangleSynth.triggerAttack(notes, 0.1)
        this._sineSynth.triggerAttack(notes)
        this._squareSynth.triggerAttack(notes)
    }

    releaseNotes(notes: Note[]) {
        this._triangleSynth.triggerRelease(notes)
        this._sineSynth.triggerRelease(notes)
        this._squareSynth.triggerRelease(notes)
    }

}