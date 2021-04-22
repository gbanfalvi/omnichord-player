import * as Tone from 'tone'


export namespace Arp {

    export enum Mode {
        none = 'Off',
        arpUp = "up",
        arpDown = 'down',
        arpUpDown = 'upDown',
        arpDownUp = 'downUp',
        // random,

    }

    export enum Speed {
        wholeNote = '1/1',
        halfNote = '1/2',
        quarterNote = '1/4',
        eighthNote = '1/8',
        sixteenthNote = '1/16',
    }

    export function noteLength(speed: Speed, notes?: number): Tone.Unit.TimeObject {
        switch (speed) {
            case Speed.wholeNote: return { '4n': 1 * (notes ?? 1) };
            case Speed.halfNote: return { '8n': 1 * (notes ?? 1) };
            case Speed.quarterNote: return { '16n': 1 * (notes ?? 1) };
            case Speed.eighthNote: return { '32n': 1 * (notes ?? 1) };
            case Speed.sixteenthNote: return { '64n': 1 * (notes ?? 1) };
        }
    }

}