
import { KeyCode } from '../../models/input/KeyCode'
import { Chord } from '../../models/music/Chord'
import { Key } from '../../models/music/Key'
import { ChordNoteController } from '../notes/ChordNoteContoller'
import { StrumNoteController } from '../notes/StrumNoteController'
import { ConfigurableInstrument } from './ConfigurableInstrument'

// UI types
type KeyCodeAndElem = { key: KeyCode, elem: Element, isChord: boolean }

// Business logic types
type ChordAndRows = { chord: Chord, rows: number[] }
type KeyAndCol = { key: Key, col: number }
type ChordAndKey = { chord: ChordAndRows, key: KeyAndCol }


const chordsAndRows: ChordAndRows[] = [
    { chord: Chord.Major, rows: [0] },
    { chord: Chord.Minor, rows: [1] },
    { chord: Chord.Seventh, rows: [2] },
    { chord: Chord.Diminished, rows: [0, 1] },
    { chord: Chord.Minor7th, rows: [1, 2] },
    { chord: Chord.Major7th, rows: [0, 2] },
    { chord: Chord.Augmented, rows: [0, 1, 2] },
]

const keysAndCols: KeyAndCol[] = [
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

export class InputController {

    private _chordNoteController: ChordNoteController
    private _strumNoteController: StrumNoteController

    private _keysAndElems: KeyCodeAndElem[] = []

    holdChords: boolean = false

    activeChordAndKey: ChordAndKey | null = null

    private _chordNameDiv: HTMLElement | null = null
    private _chordNoteDiv: HTMLElement | null = null

    constructor(chordNoteController: ChordNoteController, strumNoteController: StrumNoteController) {
        this._chordNoteController = chordNoteController
        this._strumNoteController = strumNoteController
    }

    setup() {

        // TODO: Keyboard has to be explicitly set up _after_ other stuff. This is
        // not good. 

        this.setupChordBoard()
        this.setupStrumBoard()
        this.setupKeyboard()
    }

    

    private setupChordBoard() {

        const chordKeyElems = [...document.getElementsByClassName('chord-key')] as unknown as HTMLElement[]
        const chordKeys = KeyCode.ChordKeys

        this._chordNameDiv = document.getElementById('chord-names')
        this._chordNoteDiv = document.getElementById('chord-notes')

        chordKeyElems.forEach((elem) => {

            // TODO: replace this WHOLE thing with a more resilient solution

            const classes = [...elem.classList]

            const chordRow = classes.find(c => { return c.startsWith('cr-') }) ?? null
            const chordCol = classes.find(c => { return c.startsWith('cc-') }) ?? null

            if (chordRow === null || chordCol === null) {
                throw `${elem} should be marked with a chord row ${chordRow} and column ${chordCol}!`
            }

            const rowNo = parseInt(chordRow.substring(3))
            const colNo = parseInt(chordCol.substring(3))

            const key = chordKeys.find(ck => {
                return ck.col === colNo && ck.row === rowNo
            }) ?? null

            if (key === null) {
                throw `Couldn't find a matching key for row ${rowNo}, col ${colNo}!`
            }

            const keyAndElem = { key: key, elem: elem, isChord: true }
            this._keysAndElems.push(keyAndElem)

            elem.addEventListener('mousedown', () => {
                this.keyOn(keyAndElem)
            })

            elem.addEventListener('mouseup', () => {
                this.keyOff(keyAndElem)
            })
        })
    }

    private setupStrumBoard() {

    }

    private setupKeyboard() {

        document.addEventListener('keydown', e => {

            if (e.repeat) {
                return
            }

            let keyAndElem = this._keysAndElems.find(ke => {
                return ke.key.code === e.code
            }) ?? null

            if (keyAndElem === null) {
                return
            }

            this.keyOn(keyAndElem)
        })


        document.addEventListener('keyup', e => {
            let keyAndElem = this._keysAndElems.find(ke => {
                return ke.key.code === e.code
            }) ?? null

            if (keyAndElem === null) {
                return
            }

            this.keyOff(keyAndElem)
        })

    }


    keyOn(keyAndElem: KeyCodeAndElem) {
        keyAndElem.elem.classList.add('key-on')

        if (keyAndElem.isChord) {

            if (this.activeChordAndKey === null) {
                const chord = this.chordForRows([keyAndElem.key.row])
                const key = this.keyForCol(keyAndElem.key.col)

                if (chord === null) {
                    throw `Chord is null ${keyAndElem}`
                }

                if (key === null) {
                    throw `Key is null ${keyAndElem}`
                }

                this.chordOn({ chord: chord, key: key })


            } else {
                if (this.activeChordAndKey.key.col === keyAndElem.key.col) {
                    const chord = this.chordForRows([keyAndElem.key.row, ...this.activeChordAndKey.chord.rows])

                    if (chord === null) {
                        throw `Chord is null ${keyAndElem}`
                    }

                    const chordAndKey = { chord: chord, key: this.activeChordAndKey.key }
                    this.chordOff()
                    this.chordOn(chordAndKey)

                } else {
                    const chord = this.chordForRows([keyAndElem.key.row])
                    const key = this.keyForCol(keyAndElem.key.col)


                    if (chord === null) {
                        throw `Chord is null ${keyAndElem}`
                    }

                    if (key === null) {
                        throw `Key is null ${keyAndElem}`
                    }

                    this.chordOff()
                    this.chordOn({ chord: chord, key: key })

                }

            }
        }

    }

    keyOff(keyAndElem: KeyCodeAndElem) {

        keyAndElem.elem.classList.remove('key-on')

        if (keyAndElem.isChord) {
            if (this.activeChordAndKey !== null) {
                if (this.activeChordAndKey.chord.rows.length === 1){
                    if (this.activeChordAndKey.key.col === keyAndElem.key.col) {
                        this.chordOff()
                    }
                } else {
                    const rows = this.activeChordAndKey.chord.rows.filter(r => { return r !== keyAndElem.key.row })

                    const chord = this.chordForRows(rows)

                    if (chord === null) {
                        throw `Chord not found: ${keyAndElem}`
                    }

                    const chordAndKey: ChordAndKey = { chord: chord, key: this.activeChordAndKey.key }

                    this.chordOff()
                    this.chordOn(chordAndKey)
                }
            }
        }
    }

    private chordForRows(rows: number[]): ChordAndRows | null {
        return chordsAndRows.find(cr => { return JSON.stringify(cr.rows.sort()) === JSON.stringify(rows.sort()) }) ?? null
    }

    private keyForCol(col: number): KeyAndCol | null {
        return keysAndCols.find(kc => { return kc.col === col }) ?? null
    }

    private chordOn(newChordAndKey: ChordAndKey) {
        const rows = newChordAndKey.chord.rows
        const col = newChordAndKey.key.col

        for (let row of rows) {
            const buttonElem = document.getElementsByClassName(`cr-${row} cc-${col}`)[0]
            buttonElem.classList.add('active')
        }

        if (this._chordNameDiv != null) {
            const names = newChordAndKey.chord.chord.chordNames(newChordAndKey.key.key)
            this._chordNameDiv.innerText = names.join(' / ')
        }

        if (this._chordNoteDiv != null) {
            this._chordNoteDiv.innerText = newChordAndKey.chord.chord.notes(newChordAndKey.key.key, this._chordNoteController.octaveNotes).join(', ')
        }

        this.activeChordAndKey = newChordAndKey
        this._chordNoteController.pressChordNotes(this.activeChordAndKey.chord.chord, this.activeChordAndKey.key.key)
    }

    private chordOff() {
        if (this.activeChordAndKey === null) {
            return
        }

        const rows = this.activeChordAndKey.chord.rows
        const col = this.activeChordAndKey.key.col

        for (let row of rows) {
            const buttonElem = document.getElementsByClassName(`cr-${row} cc-${col}`)[0]
            buttonElem.classList.remove('active')
        }

        if (this._chordNameDiv != null) {
            this._chordNameDiv.innerText = ''
        }

        if (this._chordNoteDiv != null) {
            this._chordNoteDiv.innerText = ''
        }


        this._chordNoteController.releaseChordNotes(this.activeChordAndKey.chord.chord, this.activeChordAndKey.key.key)
        this.activeChordAndKey = null
        // TODO: Silence chord
    }

    private strumOn(idx: number) {

    }

    private strumOff(idx: number) {

    }

    private setupInstrument(instrument: ConfigurableInstrument, octaveId?: string, mixerId?: string) {
        if (octaveId != null && instrument.octave != null) {
            const octaveElem = document.getElementById(octaveId)!
            const octaveIncr = octaveElem.getElementsByClassName('octave-incr')[0]
            const octaveDecr = octaveElem.getElementsByClassName('octave-decr')[0]

        }
    }
}