import _ from 'lodash';
import {
    teoriaScaleMIDI,
    teoriaChordMIDI,
    teoriaChord
    
} from './midi_utils';
import {Scales} from './scales';

export class SmartScale {
	constructor() {

	}

    static get(tonic, scaleName, chord, desiredScaleSize){
        console.log(chord);
        let result;
        let scaleNotes = teoriaScaleMIDI(tonic, scaleName);

        // let scales = new Scales();
        // let fallBackScaleId;
        // //let scaleNotes = scales.midi(1324, 'C', -1); //for preacher chords
        // switch(desiredScaleSize){
        //     case 5:{
        //         fallBackScaleId = scaleName.toLowerCase == 'major' ? 393 : 465;
        //     }
        //     break;
        //     case 6:{
        //         fallBackScaleId = scaleName.toLowerCase == 'major' ? 835 : 801;
        //     }
        //     break;
        //     default:{
        //         fallBackScaleId = scaleName.toLowerCase == 'major' ? 1361 : 1323;
        //     }
        // }
        // let fallBackResult = scales.midi(fallBackScaleId, tonic, -1);

        console.log(scaleNotes);
        let chordNotes = teoriaChordMIDI(teoriaChord(chord));
        
        scaleNotes = _.map(scaleNotes, (c) =>{
            return c % 12;
        });

        chordNotes = _.map(chordNotes, (c) =>{
            return c % 12;
        });
        
        let combined = SmartScale.combineAndSort(scaleNotes, chordNotes);
        console.log(scaleNotes);
        console.log(chordNotes);
        console.log(combined);
        result = combined;

        let outOfScaleNotes = _.filter(chordNotes, (e) =>{ 
                return !_.includes(scaleNotes, e); 
            });
        console.log(outOfScaleNotes);
        outOfScaleNotes.forEach((n) =>{
            let neighbs = SmartScale.neighbs(combined, n);
            console.log(neighbs);
            neighbs.forEach((neighb) =>{
                if (!_.includes(chordNotes, neighb)){
                    let index = _.indexOf(result, neighb);
                    result.splice(index, 1);
                }
            });
        });
        console.log('before trim: ', result);
        //result = outOfScaleNotes.length !== 0 ? SmartScale.trimToSize(result, desiredScaleSize) : fallBackResult;
        result = SmartScale.trimToSize(result, desiredScaleSize);
        console.log('after trim: ', result);
        return result;
    }

    static neighbs(arr, e){
        let result = [];
        let center = _.indexOf(arr, e);
        let left = arr[center - 1];
        let right = arr[center + 1];
        if(left){
            result.push(left);
        }
        if(right){
            result.push(right);
        }
        return result;

    }

    static combineAndSort(scaleNotes, chordNotes){
        let result = _.union(scaleNotes, chordNotes);
        result.sort((a, b)=>{
            return a - b;
        });
        return result;
    }

    static trimToSize(scale, size){
        if(scale.length <= size){
            return scale;
        }
        while(scale.length > size){
            scale = SmartScale.trim(scale);
        }
        return scale;
    }

    static trim(scale){
        let diffMap = SmartScale.diffMap(scale);

        let minDiff = _.reduce(diffMap, (min, diffElem) =>{
            let candidateMin = Math.min(diffElem.left, diffElem.right);
            return candidateMin < min ? candidateMin : min;
        }, Number.MAX_SAFE_INTEGER);
        let firstRoundTrimCandidates = _.filter(diffMap, (diffElem) =>{
            return diffElem.left === minDiff || diffElem.right === minDiff;
        });

        let sumMinDiff = _.reduce(firstRoundTrimCandidates, (min, diffElem) =>{
            let candidateMin = diffElem.left + diffElem.right;
            return candidateMin < min ? candidateMin : min;
        }, Number.MAX_SAFE_INTEGER);
        let secondRoundTrimCandidates = _.filter(firstRoundTrimCandidates, (diffElem) =>{
            return (diffElem.left + diffElem.right === sumMinDiff);
        });
        let primeCandidate = secondRoundTrimCandidates[secondRoundTrimCandidates.length - 1];
        scale.splice(primeCandidate.index, 1);
        return scale;
    }

    static diffMap(scale){
        let map = _.map(scale, (d, i) =>{
            let leftDiff = SmartScale.diff(-1, i, scale);
            let rightDiff = SmartScale.diff(1, i, scale);
            return {index: i, left: leftDiff, right: rightDiff};
        });
        return map;
    }

    static diff(offset, index, scale){
        let result;
        let elem = scale[index];
        let diffElem = scale[((index + offset) % scale.length + scale.length) % scale.length];
        if(index === 0 && offset === -1){
            elem += 12;
        }
        else if(index === scale.length - 1 && offset === 1){
            diffElem = 12 + scale[0];
        }
        result = Math.abs(elem - diffElem);
        return result;
    }
}