import * as Tone from 'tone'
import { PulseOscillatorOptions } from 'tone'
import { Note } from '../../models/music/Note'

/**
 * AudioSynth
 * 
 * Actual instrument playing sounds. It's a combination of several synths (with 
 * their respective oscillators) mixed together with crossfaders.
 * 
 * Sine -----\
 *            |---\
 * Triangle -/     \ ____
 *                 /
 *         Pulse -/
 * 
 */
export class AudioSynth {

    private _sineSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sine' },
        envelope: {
            attack: 0.01, attackCurve: 'linear',
            decay: 0.1, decayCurve: 'exponential',
            sustain: 0.5,
            release: 2, releaseCurve: 'exponential'
        },
        volume: -8
    })

    private _triangleSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: {
            attack: 0.01, attackCurve: 'linear',
            decay: 0.1, decayCurve: 'exponential',
            sustain: 0.2,
            release: 1, releaseCurve: 'exponential'
        },
    })

    private _triangleSineCrossfade = new Tone.CrossFade()

    private _squareSynth = new Tone.PolySynth(Tone.Synth,
        {
            oscillator: { type: "pulse", width: 0 },
            envelope: {
                attack: 0.05, attackCurve: 'linear',
                decay: 0.1, decayCurve: 'exponential',
                sustain: 0.2,
                release: 1, releaseCurve: 'exponential'
            },
            volume: -4

        })

    private _squareCrossfade = new Tone.CrossFade().toDestination()

    constructor() {
        this._triangleSynth.connect(this._triangleSineCrossfade.a)
        this._sineSynth.connect(this._triangleSineCrossfade.b)

        this._triangleSineCrossfade.connect(this._squareCrossfade.a)
        this._squareSynth.connect(this._squareCrossfade.b)
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

    get squareWidth(): number {
        return (this._squareSynth.get().oscillator as PulseOscillatorOptions).width
    }

    set squareWidth(newValue: number) {
        this._squareSynth.set({ oscillator: { width: newValue } })
    }

    playNotes(notes: Note[]) {
        this._triangleSynth.triggerAttack(notes)
        this._sineSynth.triggerAttack(notes)
        this._squareSynth.triggerAttack(notes)
    }

    releaseNotes(notes: Note[]) {
        this._triangleSynth.triggerRelease(notes)
        this._sineSynth.triggerRelease(notes)
        this._squareSynth.triggerRelease(notes)
    }

}