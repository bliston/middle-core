import $ from 'jquery';
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
import songs from '../assets/json/songs.json';
export class PremadeSongMap{
	constructor(){
		this.chordsIndex = 0;
		this.melodyIndex = 0;
  	}

    get(t, status, note, vel) {
    	let chords = ['F#m', 'DM7', 'Bm', 'E7', 'AM7', 'DM7', 'AM7', 'DM7', 'G#m7b5', 'C#7b9']; //F#m My Favorite Things
    	let melody = ['f#5', 'c#6', 'c#6', 'g#5', 'f#5', 'f#5', 'c#5', 'f#5', 'f#5', 'g#5', 'f#5',
   					'f#5', 'c#6', 'c#6', 'g#5', 'f#5', 'f#5', 'c#5', 'f#5', 'f#5', 'g#5', 'f#5',
   					'f#5', 'c#6', 'b5', 'f#5', 'g#5', 'e5', 'e5', 'b5', 'a5', 'd5',
   					'c#5', 'd5', 'e5', 'f#5', 'g#5', 'a5', 'b5', 'c#6', 'b5', 'e#5']; // //F#m My Favorite Things
    	
        vel/=128;
    	let noteOff = isNoteOff(status, vel);
    	let keyType = pianoKeyType(note);
    	let isChord;
        console.log(chords);
        this.scaleMIDI = teoriaScaleMIDI('f#', 'minor');
    	if(!keyType.isBlack){ // TREATED AS MELODY
    		let midi = {};
    		if(!noteOff){
    			midi.on = [valueOfReplicatedArray(this.scaleMIDI, keyType.indexOfKeyType)];
    		}else{
    			midi.off = [valueOfReplicatedArray(this.scaleMIDI, keyType.indexOfKeyType)];
    		}
    		return midi;
    	}
    	else{// TREATED AS A CHORD
    		isChord = true;
    		let result = teoriaArrayCycle(chords, this.chordsIndex, noteOff);
    		this.chordsIndex = result.nextIndex;
	    	let midi = teoriaResultToMIDIOnOff(result, isChord);
			return midi;
    	}
    }
}