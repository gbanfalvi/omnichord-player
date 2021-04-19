
const ValidChordKeyCodes = [
    // Row 1
    'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6',
    'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal',

    // Row 2
    'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY',
    'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight',

    // Row 3
    'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH',
    'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Backslash',
]

const ValidStrumKeyCodes = [
    'Numpad0', 'NumpadDecimal', 'NumpadEnter', 'Numpad1', 'Numpad2', 'Numpad3', 'Numpad4',
    'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9',
]

export class KeyCode {
    code: string
    row: number
    col: number

    constructor(code: string, row: number, col: number) {
        this.code = code
        this.row = row
        this.col = col
    }
    
    static ChordKeys = ValidChordKeyCodes.map((code, idx) => {
        return new KeyCode(code, Math.floor(idx / 12), idx % 12)
    })

    static StrumKeys = ValidStrumKeyCodes.map((code, idx) => {
        return new KeyCode(code, Math.floor(idx / 1), idx % 1)
    })
}