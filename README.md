# Online Omnichord Instrument

An online Omnichord-like instrument built for the browser. Written in Typescript.

## Usage

Use the number and top two letter rows of your keyboard (or tap the chord buttons) to 
play a chord.

### Buttons

- *Octave:* Play higher/lower octaves.
- *Hold:* Hold the chord until the next one is pressed.
- *BPM:* Beats per minute if a rhythm is being played or a chord is being played as an ARP.

- *ARP:* Instead of playing the entire chord at once, arpegiate it.
    - *Pattern:* Play notes upwards, downwards, up-then-down, etc...
    - *Speed*: Play as half-notes, quater-notes, etc...
    - *Loop:* Loop the ARP pattern. Combine it with the hold button to get a musical pattern.
- *Oscillators:* There's three oscillators.
    - *Oscillator 1:* Combination of two oscillators (triangle and sine) you can mix between.
    - *Oscillator 2:* Square oscillator you can change the pulse-width-modulation on.
    - *Mixer:* Mixes between oscillators 1 and 2.

## Libraries

- [Preact](https://preactjs.com)
- [Parcel](https://parceljs.org)
- [Tone.js](https://tonejs.github.io)
- [Sass](https://sass-lang.com)

## Setup

You need Node and Yarn on your system.

### Install
```sh=
yarn install
```

Installs all the dependencies.

### Development
```sh=
yarn dev
```

Runs it on `localhost:1234`.

### Build
```sh=
yarn build
```

Builds the whole thing into `./dev`.

## Codebase Structure
Nothing very good lol I'm not a web developer.
 
- `/index.html` - Main app entrypoint.
- `/src` - Contains the actual app code.
    - `/index.tsx` - Renders the app component.
    - `/controllers` - Has key classes that do some form of computation away from the UI layer.
    - `/models` - Key app data structures. 
    - `/view-models` - Contain business logic and/or state that's between the views and controllers.
    - `/views` - The (p)react app itself. 
        - `/App.tsx` - Root component for the application.

## Project Checklist

- [ ] Force user input in beginning to enable web audio to make it less glitchy in the beginning.

- [x] Chordboard.
    - [x] Key labels.
    - [x] Chord labels.
    - [x] Keyboard input.
        - [ ] It's a bit hacky, make it smoother (e.g. move note calculation out of the render cycle).
    - [x] Mouse input.
    - [x] Combine chord buttons from different rows.
        - [ ] Make it smoother (one chord stops ebefore playing the next one).
    - [ ] Silence shortcut. 
    - [ ] Play chord inversions?

- [ ] Strumboard.
    - [ ] Figure out notes in key.

- [ ] Rhythmboard (? terrible name)

- [x] Chordboard controls.
    - [x] Octave switch.
        - [ ] Get it to change live.
    - [x] Hold chord.
    - [ ] Silence button.
    - [x] BPM
        - [ ] Investigate max. and min. ranges.
    - [x] ARP
        - [x] Different patterns.
            - [ ] Get it to change live. 
        - [x] Different speeds.
            - [ ] Get it to change live.
        - [x] Loop
    - [x] Mixed synthesizer. 
        - [x] Sine-Triangle Mix
        - [x] Square w/ PWM
        - [x] Vibrato
        - [ ] Reverb
        - [ ] Master volume
    - [ ] Persist settings in local storage.

### Other TODOs

- Clean us SCSS (e.g. reuse button stylings between chordboard and controls).
- Move chord selection logic and playback to view model.
