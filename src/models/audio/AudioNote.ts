import { Note } from "../music/Note";
import { Instrument } from "./Instrument";

/** Note being played on a synth. */
export interface AudioNote {

    /** Actual note. */
    note: Note

    /** Instrument to play note on. */
    instrument: Instrument
}