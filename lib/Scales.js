import json from '../assets/json/scales.json';
import scale from 'music-scale';
import note_midi from 'note-midi';
import {MidiUtils} from './MidiUtils';
import {Voicing} from './Voicing';
import _ from 'lodash';
class Scales {
    constructor() {
    	//this.scalesJSON = [];
    	this.chrom = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    }

    getScale(i, key){
    		let chromScaleArray = this.pitchsetArray(i);
    		let letterScaleArray;
    		// letterScaleString ex: C C# D E
    		let letterScaleString;
    		//console.log(chromScaleArray);
    		letterScaleArray = $.map(chromScaleArray, (d) => {
  				return this.chrom[d];
			});
			//console.log(letterScaleArray);
			letterScaleString = letterScaleArray.join(' ');
			//console.log(letterScaleString);
			return scale(letterScaleString, key);
    }

    pitchsetArray(i){
    	//return this.json().responseJSON[i].pitchset;
    	return this.json()[i].pitchset;
    }

    json(){
		return json;
	}

    filterSubKeys(i){
		return this.filterKeys(i, (s1, s2) => {
			return this.isSub(s1, s2);
		});
	}

	filterSupKeys(i){
		return this.filterKeys(i, (s1, s2) => {
			return this.isSup(s1, s2);
		});
	}

	filterKeys(i, filter){
		let result = [];
		//Object.keys(this.json().responseJSON).forEach((j) => {
			Object.keys(this.json()).forEach((j) => {
  			if(filter(j, i)){
  				result.push(parseInt(j));
  			}
		});
		return result;
	}

	// is i a sub-scale of j
    isSub(i, j) {
    	return this.filter(i, j, (scaleArray1, scaleArray2) => {
    		return _.isEmpty(_.difference(scaleArray1, scaleArray2));
    	});
	}

	// is i a super-scale of j
	isSup(i, j) {
		return this.filter(i, j, (scaleArray1, scaleArray2) => {
    		return _.isEmpty(_.difference(scaleArray2, scaleArray1));
    	});
	}

	filter(i,j, match){
		return match(this.pitchsetArray(i), this.pitchsetArray(j));
    }

	subRegExp(i){
		return this.keysToRegExp(this.filterSubKeys(i));
	}

	supRegExp(i){
		return this.keysToRegExp(this.filterSupKeys(i));
	}
	//^456$|^400$
	keysToRegExp(keys){
		let result;
		result = keys.join('$|^');
		result = '^' + result;
		result += '$';
		return result;
	}

	midi(scaleId, key, octave){
		let noteNames = this.getScale(scaleId, key + octave);
		console.log(noteNames);
		let noteVals = this.namesToVals(noteNames);
		console.log(noteVals);
		return noteVals;
	}

    namesToVals(noteNames){
        let noteVals = [];

        noteNames.forEach((noteName) => {
            noteVals.push(note_midi(noteName));
        });
        return noteVals;
    }

}
export {Scales};