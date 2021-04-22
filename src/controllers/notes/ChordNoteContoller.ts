import * as Tone from 'tone'
import { Instrument } from "../../models/audio/Instrument"
import { Arp } from "../../models/music/Arp"
import { Bpm } from "../../models/music/Bpm"
import { Chord } from "../../models/music/Chord"
import { Key } from "../../models/music/Key"
import { Octave } from "../../models/music/Octave"
import { ControlBoard } from "../../view-models/controls/ControlBoard"
import { ContainerArrangement, ContainerControlWidget } from "../../view-models/controls/widgets/container/ContainerControlWidget"
import { ContRangeControlWidget } from "../../view-models/controls/widgets/control/ContRangeControlWidget"
import { DiscRangeControlWidget } from "../../view-models/controls/widgets/control/DiscRangeControlWidget"
import { ToggleControlWidget } from "../../view-models/controls/widgets/control/ToggleControlWidget"
import { AudioSynth } from '../audio/AudioSynth'

type ChordKeyAndOctave = { chord: Chord, key: Key, octave: Octave }

/**
 * ChordNoteController
 * 
 * Supports overlapping chords, but the actual omnichord doesn't, so eh. Maybe
 * in a future release?
 */
export class ChordNoteController {

    octave: Octave = 3
    holdChord: boolean = false
    arpMode: Arp.Mode = Arp.Mode.none
    arpSpeed: Arp.Speed = Arp.Speed.halfNote
    arpLoop: boolean = false

    private audioSynth: AudioSynth
    private playedChords: ChordKeyAndOctave[] = []
    private heldChord: ChordKeyAndOctave | null = null

    constructor(audioSynth: AudioSynth) {
        this.audioSynth = audioSynth
    }

    pressChordNotes(chord: Chord, key: Key) {
        const chordToPlay: ChordKeyAndOctave = { chord: chord, key: key, octave: this.octave }

        if (this.heldChord != null) {
            this.stopPlaying(this.heldChord)
            this.heldChord = null
        }

        this.startPlaying(chordToPlay)
    }

    releaseChordNotes(chord: Chord, key: Key) {
        const chordToRelease = this.playedChords.find(pc => {
            return pc.chord === chord && pc.key === key
        })

        if (chordToRelease != null) {
            if (this.holdChord) {
                this.heldChord = chordToRelease
            } else {
                this.stopPlaying(chordToRelease)
            }
        } else {
            throw `Couldn't release chord ${chord} ${key}`
        }
    }

    private startPlaying(chordToPlay: ChordKeyAndOctave) {
        this.playedChords.push(chordToPlay)
        const notes = chordToPlay.chord.notes(chordToPlay.key, chordToPlay.octave)
        this.audioSynth.playNotes(notes, {mode: this.arpMode, speed: this.arpSpeed, loop: this.arpLoop})
    }

    private stopPlaying(chordToRelease: ChordKeyAndOctave) {
        this.playedChords = this.playedChords.filter(pc => { return pc !== chordToRelease })
        const notes = chordToRelease.chord.notes(chordToRelease.key, chordToRelease.octave)
        this.audioSynth.releaseNotes(notes)
    }

    get controls(): ControlBoard {

        return new ControlBoard('Chordboard', new ContainerControlWidget(null, ContainerArrangement.horizontal, [
            new ContainerControlWidget('Playback', ContainerArrangement.vertical, [

                new ContainerControlWidget(null, ContainerArrangement.horizontal, [
                    new DiscRangeControlWidget(this, 'octave', 'Octave', [1, 2, 3, 4, 5, 6]),
                    new ToggleControlWidget(this, 'holdChord', 'Hold'),
                ]),

                new ContRangeControlWidget(Tone.Transport.bpm, 'value', 'BPM', 60, 140, 1),
                new ContainerControlWidget('ARP', ContainerArrangement.horizontal, [
                    new DiscRangeControlWidget(this, 'arpMode', 'Pattern', [Arp.Mode.none, Arp.Mode.arpUp, Arp.Mode.arpDown, Arp.Mode.arpUpDown, Arp.Mode.arpDownUp]),
                    new DiscRangeControlWidget(this, 'arpSpeed', 'Speed', [Arp.Speed.wholeNote, Arp.Speed.halfNote, Arp.Speed.quarterNote, Arp.Speed.eighthNote, Arp.Speed.sixteenthNote]),
                    new ToggleControlWidget(this, 'arpLoop', 'Loop')
                ]),

            ]),
            new ContainerControlWidget('Oscillators', ContainerArrangement.vertical, [
                new ContRangeControlWidget(this.audioSynth, 'triangleSineFade', 'Osc. 1 - Tri <-> Sine', 0, 1, 0.05),
                new ContRangeControlWidget(this.audioSynth, 'squareWidth', 'Osc. 2 - Square Pulse Width', 0, 0.99, 0.05),
                new ContRangeControlWidget(this.audioSynth, 'squareFade', 'Osc. Mix', 0, 1, 0.05),
            ]),
            new ContainerControlWidget('Vibrato', ContainerArrangement.vertical, [
                new ContRangeControlWidget(this.audioSynth, 'vibratoDepth', 'Depth', 0, 1, 0.05),
                new ContRangeControlWidget(this.audioSynth, 'vibratoFreq', 'Frequency', 0, 20, 1),

            ])
        ]))
    }
}