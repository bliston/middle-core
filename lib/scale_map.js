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
import {MIDIMap} from './midi_map'; 
import songs from '../assets/json/songs.json';
export class ScaleMap {
	constructor(songName){
        this.song = songName;
		this.chordsIndex = 0;
		this.melodyIndex = 0;
        this.scaleMIDI;
  	}

    get(t, status, note, vel) {
    	let chords = this._song.chords;
        vel/=128;
    	let noteOff = isNoteOff(status, vel);
    	let keyType = pianoKeyType(note);
    	let isChord;
        console.log(chords);
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

    get song() {
        return this._song;
    }

    set song(songTitle){
        this._song = songs[songTitle];
        this.scaleMIDI = teoriaScaleMIDI(this._song.tonic, this.song.scale);
    }

    songTitles(){
        return Object.keys(songs);
    }
}