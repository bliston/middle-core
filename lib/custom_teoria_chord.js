import teoria from 'teoria';
import _ from 'lodash';
import {
    notesFromNameArray
} from './midi_utils';

export class CustomTeoriaChord {
	constructor(chord) {
		this._chord = this.isString(chord) ? new teoria.chord(chord) : this.notesFromNameArray(chord);
	}

    notes(){
        return this.isTeoria() ? this._chord.notes() : this._chord;
    }

    midi(){
        return _.map(this.notes, (note) =>{
            return note.midi();
        });
    }

    isString(chord){
        return (typeof chord === 'string');
    }

    isTeoria(){
        return !this._chord[0];
    }

    notesFromNameArray(chord){
        return notesFromNameArray(chord);
    }

	get name(){
        return this._name;
    }

    set name(n){
        this._name = n;
    }
}