import { Note, Notes } from "./Note"

export type Octave = 1 | 2 | 3 | 4 | 5 | 6

export namespace Octave {

    export function notesFromOctave(root: Octave): Note[] {
        return Notes.slice((root - 1) * 12)
    }

}