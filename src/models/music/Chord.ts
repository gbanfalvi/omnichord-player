import { Key } from "./Key"
import { Note } from "./Note"
import { Octave } from "./Octave"

/** Name of a chord. */
export interface ChordName {

    /** Name on labels. */
    name: string,

    /** Suffix when getting the chord name. */
    suffix: string
}

/** A chord is essentially a root key and some offsets. */
export class Chord {

    /** Name of a chord. */
    chordName: ChordName

    /** Offsets for this chord. */
    idxOffsets: number[]

    constructor(chordName: ChordName, idxOffsets: number[]) {
        this.chordName = chordName
        this.idxOffsets = idxOffsets
    }

    /** Given a root key and an octave, notes to press on a chord (will be root key & offsets). */
    notes(key: Key, octave: Octave): Note[] {
        return Octave.notesFromOctave(octave).filter((_val, idx) => {
            return idx == key.octaveRootIdx || 
                this.idxOffsets.map(ofs => {return key.octaveRootIdx + ofs}).includes(idx)
        })
    }

    /** Name(s) of this chord at a given key. */
    chordNames(key: Key): string[] {
        return key.names.map(n => n + this.chordName.suffix)
    }

    /** General name */
    get name(): string {
        return this.chordName.name
    }

    /** Suffix */
    get suffix(): string {
        return this.chordName.suffix
    }

    static Major = new Chord({name: 'Maj', suffix: ''}, [4, 7])                // Major 3rd, perfect 5th
    static Minor = new Chord({name: 'Min', suffix: 'm'}, [3, 7])               // Minor 3rd, perfect 5th
    static Seventh = new Chord({name: '7th', suffix: '⁷'}, [4, 7, 10])         // Major 3rd, pefect 5th, minor 7th
    static Diminished = new Chord({name: 'Dim', suffix: 'dim'}, [3, 6])        // Minor 3rd, diminished 5th
    static Major7th = new Chord({name: 'Maj 7th', suffix: 'maj⁷'}, [4, 7, 11]) // Major 3rd, perfect 5th, major 7th
    static Minor7th = new Chord({name: 'Min 7th', suffix: 'm⁷'}, [3, 7, 10])   // Minor 3rd, perfect 5th, minor 7th
    static Augmented = new Chord({name: 'Aug', suffix: 'aug'}, [4, 8])         // Major 3rd, augmented 5th
}
