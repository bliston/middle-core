import $ from 'jquery';
import _ from 'lodash';
import {
	isNoteOff,
	pianoKeyType,
	valueOfReplicatedArray,
	teoriaArrayCycle,
	teoriaResultToMIDIOnOff,
	teoriaScaleMIDI
} from './midi_utils';
import {Scales} from './scales';
import {SmartScale} from './smart_scale';

export class SongMap {
	constructor(songs){
        this.scales = new Scales();
        console.log(SmartScale.get('B', 'major', ['D', 'F', 'G#'], 5));
        this.songs = songs;
		this.chordsIndex = 0;
		this.melodyIndex = 0;
        this.scaleMIDI;
        this.melodyScaleSize = 5;
        this.lastBlack = {notesOnIndex: undefined};
  	}

    get(t, status, note, vel) {
    	// let chords = ['F#m', 'DM7', 'Bm', 'E7', 'AM7', 'DM7', 'AM7', 'DM7', 'G#m7b5', 'C#7b9']; //F#m My Favorite Things
    	// let melody = ['f#5', 'c#6', 'c#6', 'g#5', 'f#5', 'f#5', 'c#5', 'f#5', 'f#5', 'g#5', 'f#5',
   		// 			'f#5', 'c#6', 'c#6', 'g#5', 'f#5', 'f#5', 'c#5', 'f#5', 'f#5', 'g#5', 'f#5',
   		// 			'f#5', 'c#6', 'b5', 'f#5', 'g#5', 'e5', 'e5', 'b5', 'a5', 'd5',
   		// 			'c#5', 'd5', 'e5', 'f#5', 'g#5', 'a5', 'b5', 'c#6', 'b5', 'e#5']; // //F#m My Favorite Things
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
    			//midi.off = [valueOfReplicatedArray(this.scaleMIDIPrev, keyType.indexOfKeyType)];
                midi.off = [valueOfReplicatedArray(this.scaleMIDI, keyType.indexOfKeyType)];
    		}
    		return midi;
    	}
    	else{// TREATED AS A CHORD
            this.updateScaleMIDI();
    		isChord = true;
            let noteOffPrevious = keyType.indexOfKeyType === this.lastBlack.notesOnIndex;
    		let result = teoriaArrayCycle(chords, this.chordsIndex, noteOff, noteOffPrevious);
            console.log(this.chordsIndex);
    		this.chordsIndex = result.nextIndex; // shift to next chord for next time
	    	let midi = teoriaResultToMIDIOnOff(result, isChord);
            console.log(this.chordsIndex);
            this.lastBlack.notesOnIndex = !noteOff ? keyType.indexOfKeyType : this.lastBlack.notesOnIndex;
			return midi;
    	}
    }

    updateScaleMIDI(){
        //this.scaleMIDIPrev = this.scaleMIDI ? _.cloneDeep(this.scaleMIDI) : teoriaScaleMIDI(this._song.tonic, this._song.scale);
        //this.scaleMIDI = SmartScale.get(this._song.tonic, this._song.scale, this._song.chords[this.chordsIndex], this.melodyScaleSize);
        
        //this.scaleMIDI = teoriaScaleMIDI(this._song.tonic, this._song.scale);

        //this.scaleMIDI = this.scales.midi(this._song.scale.toLowerCase == 'major' ? 393 : 465, this._song.tonic, -1);
        this.scaleMIDI = this.scales.midi(this._song.scale, this._song.tonic, -1);
        let scaleEntry //= this._song.scales[this.chordsIndex];
        if(scaleEntry){
           this.scaleMIDI = this.scales.midi(scaleEntry.scale, scaleEntry.tonic, -1); 
        }
        
        //console.log(this.scaleMIDIPrev, this.scaleMIDI);
    }

    select(songTitle){
        this._song = this.songs[songTitle];
        this.updateScaleMIDI();
    }

    titles(){
        return Object.keys(this.songs);
    }

    reset(){
        this.chordsIndex = 0;
        this.melodyIndex = 0;
    }
}