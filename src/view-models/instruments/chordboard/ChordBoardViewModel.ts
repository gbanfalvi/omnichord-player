import { ChordNoteController } from "../../../controllers/notes/ChordNoteContoller"
import { KeyCode } from "../../../models/input/KeyCode"
import { Chord } from "../../../models/music/Chord"
import { Key } from "../../../models/music/Key"
import { Octave } from "../../../models/music/Octave"

export type KeyCallback = (keyCode: KeyCode) => void
export type UpdateCallback = ((t:number) => void)|null

export type ChordRowsAndCols = { chord: Chord, rows: number[], col: number }
export type KeyAndCol = { key: Key, col: number }

export const chordsAndRows: ChordRowsAndCols[] = [
    { chord: Chord.Major, rows: [0], col: 4 },
    { chord: Chord.Minor, rows: [1], col: 4 },
    { chord: Chord.Seventh, rows: [2], col: 4 },
    { chord: Chord.Diminished, rows: [0, 1], col: 3 },
    { chord: Chord.Minor7th, rows: [1, 2], col: 2 },
    { chord: Chord.Major7th, rows: [0, 2], col: 1 },
    { chord: Chord.Augmented, rows: [0, 1, 2], col: 0 },
]

export const keysAndCols: KeyAndCol[] = [
    { key: Key.DFlat, col: 0 },
    { key: Key.AFlat, col: 1 },
    { key: Key.EFlat, col: 2 },
    { key: Key.BFlat, col: 3 },
    { key: Key.F, col: 4 },
    { key: Key.C, col: 5 },
    { key: Key.G, col: 6 },
    { key: Key.D, col: 7 },
    { key: Key.A, col: 8 },
    { key: Key.E, col: 9 },
    { key: Key.B, col: 10 },
    { key: Key.FSharp, col: 11 },
]

function chordAndRowsForRows(rows: number[], chordsAndRows: ChordRowsAndCols[]): ChordRowsAndCols | null {
    return chordsAndRows.find(cr => { return JSON.stringify(cr.rows.sort()) === JSON.stringify(rows.sort()) }) ?? null
}

function keyAndColForCol(col: number, keysAndCols: KeyAndCol[]): KeyAndCol | null {
    return keysAndCols.find(kc => { return kc.col === col }) ?? null
}

type PlayState = {
    chord: Chord
    chordRows: number[]
    key: Key,
    keyCol: number,
    octave: Octave
} | null

export class ChordBoardViewModel {

    private _playState: PlayState = null
    readonly chordNoteController: ChordNoteController

    updateCallback: UpdateCallback = null

    get playState(): PlayState {
        return this._playState
    }

    constructor(chordNoteController: ChordNoteController) {
        this.chordNoteController = chordNoteController
    }

    setup() {
        this._setupKeyboard()
    }

    teardown() {
        this._teardownKeyboard()
        this.updateCallback = null
    }

    private _setupKeyboard() {
        document.addEventListener('keydown', (e) => { this._onKeyDown(e) })
        document.addEventListener('keyup', (e) => { this._onKeyUp(e) })
    }

    private _teardownKeyboard() {
        document.removeEventListener('keydown', (e) => { this._onKeyDown(e) })
        document.removeEventListener('keyup', (e) => { this._onKeyUp(e) })
    }

    private _onKeyDown(ke: KeyboardEvent) {
        if (ke.repeat) {
            return
        }
        const keyCode = KeyCode.ChordKeys.find(kc => { return kc.code === ke.code })

        if (keyCode != null) {
            this.onKeyPress(keyCode)
        }
    }

    private _onKeyUp(ke: KeyboardEvent) {
        const keyCode = KeyCode.ChordKeys.find(kc => { return kc.code === ke.code })

        if (keyCode != null) {
            this.onKeyRelease(keyCode)
        }
    }

    onKeyPress(keyCode: KeyCode) {
        if (this._playState === null) {
            // Initial key down
            const chord = chordAndRowsForRows([keyCode.row], chordsAndRows)
            const key = keyAndColForCol(keyCode.col, keysAndCols)

            if (chord === null || key === null) {
                throw `Chord or key are missing on initial key down.`
            }

            this._updatePlayState({
                chord: chord.chord,
                chordRows: chord.rows,
                key: key.key,
                keyCol: key.col,
                octave: this.chordNoteController.octave
            })

        } else {
            if (this._playState.keyCol === keyCode.col) {
                // Another key down on the same col
                const chord = chordAndRowsForRows([...this._playState.chordRows, keyCode.row], chordsAndRows)
                if (chord === null) {
                    throw `Chord is missing on additional key row.`
                }

                this._updatePlayState({
                    ...this._playState,
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

                this._updatePlayState({
                    chord: chord.chord,
                    chordRows: chord.rows,
                    key: key.key,
                    keyCol: key.col,
                    octave: this.chordNoteController.octave
                })
            }
        }
    }

    onKeyRelease(keyCode: KeyCode) {
        if (this._playState !== null) {
            if (this._playState.chordRows.length === 1) {
                if (this._playState.keyCol === keyCode.col) {
                    // Last key up
                    this._updatePlayState(null)
                }
            } else {
                // Key up on col with more than one row
                const rows = this._playState.chordRows.filter(r => { return r !== keyCode.row })
                const chord = chordAndRowsForRows(rows, chordsAndRows)

                if (chord === null) {
                    throw `Chord is missing on removing key row.`
                }

                this._updatePlayState({
                    ...this._playState,
                    chord: chord.chord,
                    chordRows: chord.rows
                })
            }
        }
    }

    private _updatePlayState(newPlayState: PlayState | null) {
        if (this._playState === null && newPlayState !== null) {
            this.chordNoteController.pressChordNotes(newPlayState.chord, newPlayState.key)
            this._playState = newPlayState

        } else if (this._playState !== null && newPlayState === null) {
            this.chordNoteController.releaseChordNotes(this._playState.chord, this._playState.key)
            this._playState = newPlayState

        } else if (this._playState !== null && newPlayState !== null) {
            this.chordNoteController.releaseChordNotes(this._playState.chord, this._playState.key)
            this.chordNoteController.pressChordNotes(newPlayState.chord, newPlayState.key)
            this._playState = newPlayState
        }

        if (this.updateCallback !== null) {
            this.updateCallback(0)
        }
    }
}