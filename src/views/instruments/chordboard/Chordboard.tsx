import { h } from 'preact'
import { useEffect, useReducer, useRef } from 'preact/hooks'
import { KeyCode } from '../../../models/input/KeyCode'
import { BoardButton } from './comps/BoardButton'
import { ChordLabel } from './comps/ChordLabel'
import { KeyLabel } from './comps/KeyLabel'
import './Chordboard.scss'
import { ChordNoteController } from '../../../controllers/notes/ChordNoteContoller'
import { ActiveLabel } from './comps/ActiveLabel'
import { ChordBoardViewModel, chordsAndRows, keysAndCols } from '../../../view-models/instruments/chordboard/ChordBoardViewModel'

interface ChordboardProps {
    chordNoteController: ChordNoteController
}

export function Chordboard(props: ChordboardProps) {

    const [, forceUpdate] = useReducer(x => x + 1, 0)

    const viewModelRef = useRef(new ChordBoardViewModel(props.chordNoteController))
    viewModelRef.current.updateCallback = forceUpdate

    useEffect(() => {
        viewModelRef.current.setup()
        return () => {
            viewModelRef.current.teardown()
        }
    }, [])

    return <div className='Chordboard grid'>
        <ActiveLabel
            chordNames={viewModelRef.current.playState != null ? viewModelRef.current.playState.chord.chordNames(viewModelRef.current.playState.key) : []}
            noteSet={viewModelRef.current.playState != null ? viewModelRef.current.playState.chord.notes(viewModelRef.current.playState.key, props.chordNoteController.octave) : []} />

        {chordsAndRows.map((cr, idx) => {
            return <ChordLabel
                chordsRowsAndCol={cr}
                key={idx} />
        })}

        {keysAndCols.map((kc, idx) => {
            return <KeyLabel
                keyAndCol={kc}
                key={idx} />
        })}

        {KeyCode.ChordKeys.map((ck, idx) => {
            return <BoardButton
                keyCode={ck} key={idx}
                isPressed={viewModelRef.current.playState != null ? (viewModelRef.current.playState.keyCol === ck.col && viewModelRef.current.playState.chordRows.includes(ck.row)) : false}
                onPress={(k: KeyCode)=>{viewModelRef.current.onKeyPress(k)}}
                onRelease={(k: KeyCode)=>{viewModelRef.current.onKeyRelease(k)}} />
        })}
    </div>
}