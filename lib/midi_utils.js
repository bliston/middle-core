import teoria from 'teoria';
import _ from 'lodash';
import {CustomTeoriaChord} from './custom_teoria_chord';

let CHROMATIC_FLAT = ['c', 'db', 'd', 'eb', 'e', 'f', 'gb', 'g', 'ab', 'a', 'bb', 'b'];
let CHROMATIC_SHARP = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
let WHITE_INDICES = [0, 2, 4, 5, 7, 9, 11];
let BLACK_INDICES = [1, 3, 6, 8, 10];

export function notesFromNameArray(names){
  let octave = 3;
  let last;
  let notes = _.map(names, (name, i)=>{
    name = name.toLowerCase();
    if(i === 0){
      last = name;
      return new teoria.note(name + octave);

    }
    else{
      let indexOfCurrent = indexOfNoteName(name);
      let indexOfLast = indexOfNoteName(last);
      if (indexOfCurrent < indexOfLast){
        octave++;
      }
      last = name;
      return new teoria.note(name + octave);
    }
  });
  return notes;
}

export function indexOfNoteName(name){
  let result = -1;
  name = name.toLowerCase();
  if(_.includes(CHROMATIC_FLAT, name)){
    result = _.indexOf(CHROMATIC_FLAT, name);
  }
  if(_.includes(CHROMATIC_SHARP, name)){
    result = _.indexOf(CHROMATIC_SHARP, name);
  }
  return result;
}

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

export function teoriaArrayCycle(array, index, isNoteOff, noteOffPrevious){
  let result = {};
  let nextElem;
  let currentIndex = index % array.length;
  let nextIndex = (currentIndex + 1) % array.length;
  let offIndex = (((index - 1) % array.length) + array.length) % array.length;

  if(!isNoteOff){
    result.off = array[offIndex];
    nextElem = array[currentIndex];
    result.on = nextElem;
    result.nextIndex = nextIndex;
  }else{//noteOff
    if(noteOffPrevious){//case where note off occurs and it is the current sounding teoria elem.
      result.off = array[offIndex];
      result.nextIndex = currentIndex;
    }
    else{//case where note off occurs and it is not the current sounding teoria elem.
      result.off = undefined;
      result.on = undefined;
      result.nextIndex = currentIndex;
    }
  }
  return result;
}

export function teoriaResultToMIDIOnOff(result, isChord){
    let midi = {};
    console.log(result);
    if(result.off){
        midi.off = teoriaMIDI(result.off, isChord);
    }
    if(result.on){
        midi.on = teoriaMIDI(result.on, isChord);
    }
    console.log(midi);
    return midi;
}

export function teoriaMIDI(elem, isChord){
    let result = isChord ? teoriaChordMIDI(teoriaChord(elem)) : teoriaNoteMIDI(teoriaNote(elem));
    return result;
}

export function teoriaChord(elem){
    return new CustomTeoriaChord(elem);
}

export function teoriaChordMIDI(chord){
    var midi = _.map(chord.notes(), function(note){
        return note.midi();
    });
    return midi;
}

export function teoriaNote(noteName){
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