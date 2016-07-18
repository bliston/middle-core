import teoria from 'teoria';
import _ from 'lodash';

let CHROMATIC = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
let WHITE_INDICES = [0, 2, 4, 5, 7, 9, 11];
let BLACK_INDICES = [1, 3, 6, 8, 10];


export function pianoKeyType(noteVal){
	let isBlack = !_.includes(WHITE_INDICES, noteVal % 12);
	let array = isBlack ? BLACK_INDICES : WHITE_INDICES;
	let index = indexOfReplicatedArray(array, noteVal);
	let result = {isBlack: isBlack, indexOfKeyType: index};
	console.log(result);
	return result;
}
export function indexOfReplicatedArray(array, val){ // say val = 14 white
	let modIndex = _.indexOf(array, val % 12); // modIndex = 1
	let numLoops = Math.floor(val / 12); // numLoops = 1
	return numLoops * array.length + modIndex; // return 8
}

export function valueOfReplicatedArray(array, index){
    let n = array.length;
    let i = index;
    let posResult = 12 * Math.floor(i / n) + array[i % n];
    let negResult = 12 * Math.ceil((i + 1) / n - 1) + array[((i % n) + n) % n];
    let result = i >= 0 ? posResult : negResult;
    return result;
}

export function isNoteOff(status, vel){
  let result = false;
  if(status === 128 || (status === 144 && vel === 0)){
    result = true;
  }
  return result;
}

export function teoriaArrayCycle(array, index, isNoteOff){
  let result = {};
  let nextElem;
  let currentIndex;
  currentIndex = !(index < array.length) ? 0 : index;
  if(!isNoteOff){
    nextElem = array[currentIndex];
    result.on = nextElem;
    result.nextIndex = ++currentIndex;
  }else{//noteOff
    let offIndex;
    offIndex = index > 0 ? index - 1 : 0;
    result.off = array[offIndex];
    result.nextIndex = index;
  }
  return result;
}

export function teoriaResultToMIDIOnOff(result, isChord){
    let midi = {};
    console.log(result);
    if(result.off){
        midi.off = teoriaMIDIFromString(result.off, isChord);
    }
    if(result.on){
        midi.on = teoriaMIDIFromString(result.on, isChord);
    }
    console.log(midi);
    return midi;
}

export function teoriaMIDIFromString(elem, isChord){
    let result = isChord ? teoriaChordMIDI(teoriaChordFromString(elem)) : teoriaNoteMIDI(teoriaNoteFromString(elem));
    return result;
}

export function teoriaChordFromString(chordName){
    return teoria.chord(chordName);
}

export function teoriaChordMIDI(chord){
    var midi = _.map(chord.notes(), function(note){
        return note.midi();
    });
    return midi;
}

export function teoriaNoteFromString(noteName){
    return teoria.note(noteName);
}

export function teoriaNoteMIDI(note){
    return [note.midi()];
}

export function teoriaScaleMIDI(tonic, scaleName){
    let scale = teoriaScale(tonic, scaleName);
    console.log(scale);
    let midi = teoriaChordMIDI(scale);
    console.log(midi);
    return midi;
}

export function teoriaScale(tonic, scaleName){
    let tonicNote = teoria.note(tonic + '-1');
    let scale = tonicNote.scale(scaleName);
    return scale;
}