import { h } from 'preact'
import { useEffect, useRef } from 'preact/hooks'
import { KeyCode } from '../../../models/input/KeyCode'
import { Chord } from '../../../models/music/Chord'
import { Key } from '../../../models/music/Key'
import { BoardButton } from './comps/BoardButton'
import { ChordLabel } from './comps/ChordLabel'
import { KeyLabel } from './comps/KeyLabel'
import './Chordboard.scss'
import { ChordNoteController } from '../../../controllers/notes/ChordNoteContoller'
import { usePlayState } from './hooks/UsePlaystate'
import { ActiveLabel } from './comps/ActiveLabel'

export type ChordRowsAndCols = { chord: Chord, rows: number[], col: number }
export type KeyAndCol = { key: Key, col: number }

const chordsAndRows: ChordRowsAndCols[] = [
    { chord: Chord.Major, rows: [0], col: 4 },
    { chord: Chord.Minor, rows: [1], col: 4 },
    { chord: Chord.Seventh, rows: [2], col: 4 },
    { chord: Chord.Diminished, rows: [0, 1], col: 3 },
    { chord: Chord.Minor7th, rows: [1, 2], col: 2 },
    { chord: Chord.Major7th, rows: [0, 2], col: 1 },
    { chord: Chord.Augmented, rows: [0, 1, 2], col: 0 },
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

interface ChordboardProps {
    chordNoteController: ChordNoteController
}


export function Chordboard(props: ChordboardProps) {

    const [playState, onKeyPress, onKeyRelease] = usePlayState(props.chordNoteController, chordsAndRows, keysAndCols)

    const callbackRefs = useRef({ onKeyPress: onKeyPress, onKeyRelease: onKeyRelease })

    useEffect(() => {
        callbackRefs.current = { onKeyPress: onKeyPress, onKeyRelease: onKeyRelease }
    }, [onKeyPress, onKeyRelease])

    useEffect(() => {
        const onKeyDown = (ke: KeyboardEvent) => {
            if (ke.repeat) {
                return
            }
            const keyCode = KeyCode.ChordKeys.find(kc => { return kc.code === ke.code })

            if (keyCode != null) {
                callbackRefs.current.onKeyPress(keyCode)
            }
        }

        const onKeyUp = (ke: KeyboardEvent) => {
            const keyCode = KeyCode.ChordKeys.find(kc => { return kc.code === ke.code })

            if (keyCode != null) {
                callbackRefs.current.onKeyRelease(keyCode)
            }
        }

        document.addEventListener('keydown', onKeyDown)
        document.addEventListener('keyup', onKeyUp)

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.removeEventListener('keyup', onKeyUp)
        }
    }, [])

    return <div className='Chordboard grid'>
        <ActiveLabel chordNames={playState != null ? playState.chord.chordNames(playState.key) : []} noteSet={playState != null ? playState.chord.notes(playState.key, props.chordNoteController.octave) : []} />

        {chordsAndRows.map((cr, idx) => {
            return <ChordLabel chordsRowsAndCol={cr} key={idx} />
        })}

        {keysAndCols.map((kc, idx) => {
            return <KeyLabel keyAndCol={kc} key={idx} />
        })}

        {KeyCode.ChordKeys.map((ck, idx) => {
            return <BoardButton keyCode={ck} key={idx} isPressed={playState != null ? (playState.keyCol === ck.col && playState.chordRows.includes(ck.row)) : false} onPress={onKeyPress} onRelease={onKeyRelease} />
        })}
    </div>
}