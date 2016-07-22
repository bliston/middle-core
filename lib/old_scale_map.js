import {MidiUtils} from './MidiUtils';
import {Chord} from './Chord';
import {VoiceLeader} from './VoiceLeader';
import {Voicing} from './Voicing';
import scalePairs from '../assets/json/black-white-scale-pairs.json';
import _ from 'lodash';

import {
    isNoteOff,
    pianoKeyType,
    valueOfReplicatedArray,
    teoriaArrayCycle,
    teoriaResultToMIDIOnOff,
    teoriaMIDIFromString,
    teoriaChordFromString,
    teoriaChordMIDI,
    teoriaNoteFromString,
    teoriaNoteMIDI,
    teoriaScaleMIDI,
    teoriaScale
} from './midi_utils';
import {MIDIMap} from './midi_map'; 

class OldScaleMap {
    constructor(scales) {
            this.scales = scales;
            this.key = 'C';
            this.chordOctave = 3;
            this.scaleOctave = -1;
            this.blackScaleId = 1361;
            this.whiteScaleId = 393;
            this.blackSet = [];
            this.whiteSet = [];
            this.patternSize = 3;
            this._bypass = false;
            this.lastBlack = {notesOn: [], notesOnIndex: undefined};
            this.build();
            
    }

    getScales(){
        return this.scales;
    }

    titles(){
        return Object.keys(scalePairs);
    }

    select(title){
        this.setBlackScaleId(scalePairs[title].blackScaleId);
        this.setWhiteScaleId(scalePairs[title].whiteScaleId);
    }

    build(){
        this.update();
    }

    update(){
        this.updateBlackSet();
        this.updateWhiteSet();
        VoiceLeader.setLastResultVoicing(undefined);
    }

    updateBlackSet(){ // this builds set of chords that will be replicated over black keys
        this.blackSet = [];
        this.blackSet = this.scales.midi(this.blackScaleId, this.key, this.chordOctave);
    }

    updateWhiteSet(){ // this builds set of scale notes that will be replicated over white keys
        this.whiteSet = [];
        this.whiteSet = this.scales.midi(this.whiteScaleId, this.key, this.scaleOctave);
    }

    get(t, status, note, vel) {
        // let chords = ['F#m', 'DM7', 'Bm', 'E7', 'AM7', 'DM7', 'AM7', 'DM7', 'G#m7b5', 'C#7b9']; //F#m My Favorite Things
        // let melody = ['f#5', 'c#6', 'c#6', 'g#5', 'f#5', 'f#5', 'c#5', 'f#5', 'f#5', 'g#5', 'f#5',
        //          'f#5', 'c#6', 'c#6', 'g#5', 'f#5', 'f#5', 'c#5', 'f#5', 'f#5', 'g#5', 'f#5',
        //          'f#5', 'c#6', 'b5', 'f#5', 'g#5', 'e5', 'e5', 'b5', 'a5', 'd5',
        //          'c#5', 'd5', 'e5', 'f#5', 'g#5', 'a5', 'b5', 'c#6', 'b5', 'e#5']; // //F#m My Favorite Things
        vel/=128;
        let noteOff = isNoteOff(status, vel);
        let keyType = pianoKeyType(note);
        let result = {};
        let pianoKey = MidiUtils.pianoKeyType(note);
        if(!this._bypass){
            if(pianoKey.isBlack){
                let blackIndex = pianoKey.indexOfKeyType;
                if(!noteOff){
                    console.log("blackKeyIndex ON: ", blackIndex);
                    result.on = this.blackSpaceValue(blackIndex);
                    result.off = _.clone(this.lastBlack.notesOn); // override notes of previous black key
                    this.lastBlack.notesOn = []; // clear previous black notes
                    result.on.forEach((n)=>{this.lastBlack.notesOn.push(n)}); // update black notes on
                    this.lastBlack.notesOnIndex = blackIndex;
                }
                else{
                    console.log("blackKeyIndex OFF: ", blackIndex);
                    result.on = [];
                    result.off = []; // doesn't noteOff previous unless blackIndex matches lastBlack.notesOnIndex
                    if(blackIndex === this.lastBlack.notesOnIndex){
                        result.off = this.blackSpaceValue(blackIndex);
                        this.lastBlack.notesOn.forEach((n)=>{result.off.push(n)}); // to be safe, note off all previous black notes as well
                        this.lastBlack.notesOn = [];
                    }      
                }
                console.log("lastBlackIndex: ", this.lastBlack.notesOnIndex);
            }
            else{
                if(!noteOff){
                    result.on = [this.whiteSpaceValue(pianoKey.indexOfKeyType)];
                    result.off = [];
                }
                else{
                    result.on = [];
                    result.off = [this.whiteSpaceValue(pianoKey.indexOfKeyType)];
                }
            }
        }
        else{
            if(!noteOff){
                result.on = [note];
                result.off = [];
            }
            else{
                result.on = [];
                result.off = [note];
            }
        }
        console.log("blackNotesOn: ", this.lastBlack.notesOn);
        return result;
    }

    blackSpaceValue(blackKeyIndex){
        let result;
        let scaleSize = this.blackSet.length;
        let degree = (blackKeyIndex + 1) % scaleSize;

        let targetVoicing = new Voicing(degree, VoiceLeader.pattern(scaleSize, this.patternSize));

        //let targetVoicing = ChordScouter.findBestChord(degree, this.patternSize, this.blackSet).voicing;

        result = new Chord(VoiceLeader.leadNext(targetVoicing, scaleSize));
        //result = new Chord(targetVoicing);
        
        console.log(degree);
        let midi = result.midi(this.blackSet);
        console.log(midi);
        return midi;
    }

    whiteSpaceValue(whiteKeyIndex){
        let note = MidiUtils.valueOfReplicatedArray(this.whiteSet, whiteKeyIndex);
        return note;
    }

    setBlackScaleId(id){
        this.blackScaleId = id;
        this.update();
    }

    setWhiteScaleId(id){
        this.whiteScaleId = id;
        this.update();
    }

    setKey(key){
        this.key = key;
        this.update();
    }

    setPatternSize(size){
        this.patternSize = size;
        this.update();
    }

    bypass(bool){
        this._bypass = bool;
    }

    reset(){
        
    }
}
export {OldScaleMap};