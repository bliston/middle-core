import {MidiUtils} from './MidiUtils';
import _ from 'lodash';

class Chord {
	constructor(voicing) {
		this._voicing = voicing;
	}

	get name(){
        return this._name;
    }

    set name(n){
        this._name = n;
    }

    get voicing(){
        return this._voicing;
    }

    set voicing(v){
        this._voicing = v;
    }

	midi(scale, chordSize){// scale is something like [60, 62, 64, 66, 69, 70]
		let midi = _.map(this._voicing.pattern, (pVal, i) => { // pVal is something in [1,2,4,6] (degrees)
			return MidiUtils.valueOfReplicatedArray(scale, this._voicing.degree + pVal - 2); // voicing degree is something like 2, -3...
		});
		return midi.slice(0, chordSize);
	}
}

export {Chord};