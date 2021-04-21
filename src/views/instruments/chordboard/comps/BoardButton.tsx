import { h } from 'preact'
import { KeyCode } from '../../../../models/input/KeyCode'

export interface BoardButtonProps {
    keyCode: KeyCode
    isPressed: boolean
    onPress: (keyCode: KeyCode) => void
    onRelease: (keyCode: KeyCode) => void

}

export function BoardButton(props: BoardButtonProps) {
    return <div
        className={`BoardButton row-${props.keyCode.row + 1} col-${props.keyCode.col + 5} ${props.isPressed ? 'pressed' : ''}`}
        onTouchStart={() => { props.onPress(props.keyCode) }}
        onMouseDown={() => { props.onPress(props.keyCode) }}
        onTouchEnd={() => { props.onRelease(props.keyCode) }}
        onMouseUp={() => { props.onRelease(props.keyCode) }}
    >

    </div>
}