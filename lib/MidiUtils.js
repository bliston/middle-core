import _ from 'lodash';

var CHROMATIC = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
var WHITE_INDICES = [0, 2, 4, 5, 7, 9, 11];
var BLACK_INDICES = [1, 3, 6, 8, 10];

class MidiUtils {

    static pianoKeyType(noteVal){
    	let isBlack = !_.includes(WHITE_INDICES, noteVal % 12);
    	let array = isBlack ? BLACK_INDICES : WHITE_INDICES;
    	let index = this.indexOfReplicatedArray(array, noteVal);
    	let result = {isBlack: isBlack, indexOfKeyType: index};
    	console.log(result);
    	return result;
    }
    static indexOfReplicatedArray(array, val){ // say val = 14 white
    	let modIndex = _.indexOf(array, val % 12); // modIndex = 1
    	let numLoops = Math.floor(val / 12); // numLoops = 1
    	return numLoops * array.length + modIndex; // return 8
    }

    static valueOfReplicatedArray(array, index){
        let n = array.length;
        let i = index;
        let posResult = 12 * Math.floor(i / n) + array[i % n];
        let negResult = 12 * Math.ceil((i + 1) / n - 1) + array[((i % n) + n) % n];
        let result = i >= 0 ? posResult : negResult;
        return result;
    }

    static processEvent(event){
        let data1 = event.data1;
        if(event.data3 == 0){
            data1 = 128;
        }
        let newEvent = new Event(event.timing, data1, event.data2, event.data3);
        return newEvent;
    }

    static isNoteOff(event){
        let data1 = event.data1;
        if(event.data3 === 0){
            data1 = 128;
        }
        return data1 === 128;
    }

    
}
export {MidiUtils};