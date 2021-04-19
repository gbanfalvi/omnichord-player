import { OctaveLevel } from "../../models/music/Octave";
import { AudioSynth } from "../audio/AudioSynth";

export interface ConfigurableInstrument {

    octave?: OctaveLevel
    synthesizer?: AudioSynth
    
}