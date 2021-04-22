import * as Tone from 'tone'
import { PulseOscillatorOptions } from 'tone'
import { Arp } from '../../models/music/Arp'
import { Note } from '../../models/music/Note'

export type ArpConfiguration = {
    mode: Arp.Mode,
    speed: Arp.Speed,
    loop: boolean
}

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
            attack: 0.02, attackCurve: 'linear',
            decay: 0.1, decayCurve: 'exponential',
            sustain: 0.5,
            release: 0.5, releaseCurve: 'exponential'
        },
        volume: -8
    })

    private _triangleSynth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: {
            attack: 0.01, attackCurve: 'linear',
            decay: 0.1, decayCurve: 'exponential',
            sustain: 0.2,
            release: 0.5, releaseCurve: 'exponential'
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
                release: 0.5, releaseCurve: 'exponential'
            },
            volume: -16

        })

    private _squareCrossfade = new Tone.CrossFade()

    private _vibrato = new Tone.Vibrato().toDestination()

    private _pattern: Tone.Pattern<string> | null = null

    constructor() {
        this._triangleSynth.connect(this._triangleSineCrossfade.a)
        this._sineSynth.connect(this._triangleSineCrossfade.b)

        this._triangleSineCrossfade.connect(this._squareCrossfade.a)
        this._squareSynth.connect(this._squareCrossfade.b)

        this._squareCrossfade.connect(this._vibrato)
    }

    // -------------------------------------------------------------------------

    get triangleSineFade(): number {
        return this._triangleSineCrossfade.fade.value
    }

    set triangleSineFade(val: number) {
        this._triangleSineCrossfade.fade.value = val
    }

    // -------------------------------------------------------------------------

    get squareFade(): number {
        return this._squareCrossfade.fade.value
    }

    set squareFade(val: number) {
        this._squareCrossfade.fade.value = val
    }

    // -------------------------------------------------------------------------

    get squareWidth(): number {
        return (this._squareSynth.get().oscillator as PulseOscillatorOptions).width
    }

    set squareWidth(newValue: number) {
        this._squareSynth.set({ oscillator: { width: newValue } })
    }

    // -------------------------------------------------------------------------

    get vibratoFreq(): number {
        return this._vibrato.frequency.value as number
    }

    set vibratoFreq(newValue: number) {
        this._vibrato.frequency.value = newValue
    }

    // -------------------------------------------------------------------------

    get vibratoDepth(): number {
        return this._vibrato.depth.value
    }

    set vibratoDepth(newValue: number) {
        this._vibrato.depth.value = newValue
    }

    // -------------------------------------------------------------------------

    playNotes(notes: Note[], arp: ArpConfiguration) {
        if (arp.mode === Arp.Mode.none) {
            this._triangleSynth.triggerAttack(notes)
            this._sineSynth.triggerAttack(notes)
            this._squareSynth.triggerAttack(notes)

        } else {
            Tone.start()
            Tone.Transport.start()

            const duration = Arp.noteLength(arp.speed)

            if (arp.loop) {
                this._pattern = new Tone.Pattern((time, note) => {
                    this._triangleSynth.triggerAttackRelease(note, duration)
                    this._sineSynth.triggerAttackRelease(note, duration)
                    this._squareSynth.triggerAttackRelease(note, duration)
                }, notes, arp.mode)

            } else {
                this._pattern = new Tone.Pattern((time, note) => {
                    this._triangleSynth.triggerAttack(note)
                    this._sineSynth.triggerAttack(note)
                    this._squareSynth.triggerAttack(note)
                }, notes, arp.mode)

                this._pattern.iterations = notes.length
            }

            this._pattern.interval = duration
            this._pattern.start()
        }
    }

    releaseNotes(notes: Note[]) {

        if (this._pattern !== null) {
            this._pattern.stop()
            this._pattern = null
        }

        this._triangleSynth.triggerRelease(notes)
        this._sineSynth.triggerRelease(notes)
        this._squareSynth.triggerRelease(notes)

    }


}