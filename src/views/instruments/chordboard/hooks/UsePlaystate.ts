import { useState } from "preact/hooks";
import { ChordNoteController } from "../../../../controllers/notes/ChordNoteContoller";
import { KeyCode } from "../../../../models/input/KeyCode";
import { Chord } from "../../../../models/music/Chord";
import { Key } from "../../../../models/music/Key";
import { Octave } from "../../../../models/music/Octave";
import { ChordRowsAndCols, KeyAndCol } from "../Chordboard";


export type KeyCallback = (keyCode: KeyCode) => void


export type PlayState = {
    chord: Chord
    chordRows: number[]
    key: Key,
    keyCol: number,
    octave: Octave
} | null


function chordAndRowsForRows(rows: number[], chordsAndRows: ChordRowsAndCols[]): ChordRowsAndCols | null {
    return chordsAndRows.find(cr => { return JSON.stringify(cr.rows.sort()) === JSON.stringify(rows.sort()) }) ?? null
}

function keyAndColForCol(col: number, keysAndCols: KeyAndCol[]): KeyAndCol | null {
    return keysAndCols.find(kc => { return kc.col === col }) ?? null
}

export function usePlayState(chordNoteController: ChordNoteController, chordsAndRows: ChordRowsAndCols[], keysAndCols: KeyAndCol[]): [PlayState, KeyCallback, KeyCallback] {

    const [playState, setPlayState] = useState<PlayState>(null)

    function onKeyPress(keyCode: KeyCode) {
        if (playState === null) {
            // Initial key down
            const chord = chordAndRowsForRows([keyCode.row], chordsAndRows)
            const key = keyAndColForCol(keyCode.col, keysAndCols)

            if (chord === null || key === null) {
                throw `Chord or key are missing on initial key down.`
            }

            updatePlayState({
                chord: chord.chord,
                chordRows: chord.rows,
                key: key.key,
                keyCol: key.col,
                octave: chordNoteController.octave
            })

        } else {
            if (playState.keyCol === keyCode.col) {
                // Another key down on the same col
                const chord = chordAndRowsForRows([...playState.chordRows, keyCode.row], chordsAndRows)
                if (chord === null) {
                    throw `Chord is missing on additional key row.`
                }

                updatePlayState({
                    ...playState,
                    chord: chord.chord,
                    chordRows: chord.rows
                })

            } else {
                // Key down in a new col
                const chord = chordAndRowsForRows([keyCode.row], chordsAndRows)
                const key = keyAndColForCol(keyCode.col, keysAndCols)

                if (chord === null || key === null) {
                    throw `Chord or key are missing on new key col.`
                }

                updatePlayState({
                    chord: chord.chord,
                    chordRows: chord.rows,
                    key: key.key,
                    keyCol: key.col,
                    octave: chordNoteController.octave
                })
            }
        }
    }

    function onKeyRelease(keyCode: KeyCode) {
        if (playState !== null) {
            if (playState.chordRows.length === 1) {
                if (playState.keyCol === keyCode.col) {
                    // Last key up
                    updatePlayState(null)
                }
            } else {
                // Key up on col with more than one row
                const rows = playState.chordRows.filter(r => { return r !== keyCode.row })
                const chord = chordAndRowsForRows(rows, chordsAndRows)

                if (chord === null) {
                    throw `Chord is missing on removing key row.`
                }

                updatePlayState({
                    ...playState,
                    chord: chord.chord,
                    chordRows: chord.rows
                })
            }
        }
    }

    function updatePlayState(newPlayState: PlayState | null) {
    
        if (playState === null && newPlayState !== null) {
            chordNoteController.pressChordNotes(newPlayState.chord, newPlayState.key)
            setPlayState(newPlayState)

        } else if (playState !== null && newPlayState === null) {
            chordNoteController.releaseChordNotes(playState.chord, playState.key)
            setPlayState(newPlayState)

        } else if (playState !== null && newPlayState !== null) {
            chordNoteController.releaseChordNotes(playState.chord, playState.key)
            chordNoteController.pressChordNotes(newPlayState.chord, newPlayState.key)
            setPlayState(newPlayState)
        }
    }

    return [playState, onKeyPress, onKeyRelease]
}
