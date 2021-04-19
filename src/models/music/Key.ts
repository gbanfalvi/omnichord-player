
/** Root key for a given chord. */
export class Key {

    /** Names when constructing a chord name from this key. There can be more than one. */ 
    names: string[]

    /** Starting from C, offset in a given octave for a chord's root key. */
    octaveRootIdx: number

    constructor(names: string[], octaveRootIdx: number) {
        this.names = names
        this.octaveRootIdx = octaveRootIdx
    }

    /** Label on an omnichord. */
    get label(): string {
        return this.names[0]
    }

    // Keys as presented on the omnichord.

    static DFlat = new Key(['D♭', 'C♯'], 1)
    static AFlat = new Key(['A♭', 'G♯'], 8)
    static EFlat = new Key(['E♭', 'D♯'], 3)
    static BFlat = new Key(['B♭', 'A♯'], 10)
    static F = new Key(['F'], 5)
    static C = new Key(['C'], 0)
    static G = new Key(['G'], 7)
    static D = new Key(['D'], 2)
    static A = new Key(['A'], 9)
    static E = new Key(['E'], 4)
    static B = new Key(['B'], 11)
    static FSharp = new Key(['F♯', 'G♭'], 6)
}
