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
import { AudioController } from '../audio/AudioController'

type ChordKeyAndOctave = { chord: Chord, key: Key, octave: Octave }

/**
 * ChordNoteController
 * 
 * Supports overlapping chords, but the actual omnichord doesn't, so eh. Maybe
 * in a future release?
 */
export class ChordNoteController {

    bpm: Bpm = 80
    octave: Octave = 3
    holdChord: boolean = false
    arpMode: Arp.Mode = Arp.Mode.none
    arpSpeed: Arp.Speed = Arp.Speed.halfNote

    private audioController: AudioController
    private playedChords: ChordKeyAndOctave[] = []
    private heldChord: ChordKeyAndOctave | null = null

    constructor(audioController: AudioController) {
        this.audioController = audioController
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
        this.audioController.press(notes.map(n => { return { note: n, instrument: Instrument.chord } }))
    }

    private stopPlaying(chordToRelease: ChordKeyAndOctave) {
        this.playedChords = this.playedChords.filter(pc => { return pc !== chordToRelease })
        const notes = chordToRelease.chord.notes(chordToRelease.key, chordToRelease.octave)

        this.audioController.release(notes.map(n => { return { note: n, instrument: Instrument.chord } }))
    }

    controls = new ControlBoard('Chordboard', new ContainerControlWidget(null, ContainerArrangement.horizontal, [
        new ContainerControlWidget('Playback', ContainerArrangement.horizontal, [
            new DiscRangeControlWidget(this, 'octave', 'Octave', [1, 2, 3, 4, 5, 6]),
            new ToggleControlWidget(this, 'holdChord', 'Hold'),
            new ContRangeControlWidget(this, 'bpm', 'BPM', 40, 200),
            new DiscRangeControlWidget(this, 'arpMode', 'ARP', [Arp.Mode.none, Arp.Mode.arpUp, Arp.Mode.arpDown]),
            new DiscRangeControlWidget(this, 'arpSpeed', 'ARP Speed', [Arp.Speed.wholeNote, Arp.Speed.halfNote, Arp.Speed.quarterNote, Arp.Speed.eighthNote, Arp.Speed.sixteenNote])
        ])
    ]))
}