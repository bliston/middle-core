import {Voicing} from './Voicing';
import _ from 'lodash';

class VoiceLeader {

    static setLastResultVoicing(voicing){
        this.lastResultVoicing = voicing;
    }

	static leadNext(targetVoicing, scaleSize){
		if(this.lastResultVoicing === undefined){
            this.lastResultVoicing = targetVoicing;
			return this.lastResultVoicing;
		}
		return this.lead(this.lastResultVoicing, targetVoicing, scaleSize);
	}

	static lead(sourceVoicing, targetVoicing, scaleSize){
		let resultVoicing;
        let repeatedTarget = this.lastTargetDegree == undefined || targetVoicing.degree == this.lastTargetDegree;
		let winningVoicing = this.getWinningVoicing(sourceVoicing, targetVoicing, scaleSize, repeatedTarget);
        console.log(repeatedTarget);
		resultVoicing = repeatedTarget ? this.lastResultVoicing : winningVoicing;
        this.lastTargetDegree = targetVoicing.degree;
        this.lastResultVoicing = resultVoicing;
        console.log(resultVoicing.degree, resultVoicing.pattern);
		return resultVoicing;	
	}

    static getWinningVoicing(sourceVoicing, targetVoicing, scaleSize, repeatedTarget){
        console.log(sourceVoicing, targetVoicing);
        let scoredInversions = this.scoredNormalizedInversions(sourceVoicing, targetVoicing, scaleSize);
        scoredInversions.sort((i1, i2) => {
            return Math.abs(i1.score) - Math.abs(i2.score);
        });
        let winningInversion = scoredInversions[0];
        let winningVoicing = (!repeatedTarget && winningInversion.score == 0) ? scoredInversions[1].voicing : winningInversion.voicing; 
        return winningVoicing;
    }

	static scoredNormalizedInversions(sourceVoicing, targetVoicing, scaleSize){
		let normedInversionTarget = this.normalize(sourceVoicing, scaleSize);
		let normedInversions = this.normalizedInversions(targetVoicing, scaleSize);
		return _.map(normedInversions, (normedInversion) => {
			return {score : this.distance(normedInversion, normedInversionTarget), voicing : normedInversion};
		});
	}

	static normalizedInversions(sourceVoicing, scaleSize){
		return _.map(this.inversions(sourceVoicing, scaleSize), (inversion) => {
			return this.normalize(inversion, scaleSize);
		});
	}

    static inversions(sourceVoicing, scaleSize){
    	let inversions = [];
    	let inversion = sourceVoicing;
    	for(let i = 0; i < sourceVoicing.pattern.length; i++){
    		inversion = this.invert(inversion, scaleSize);
    		inversions.push(inversion);
    	}
    	return inversions;
    }

    static invert(sourceVoicing, scaleSize) {
    	let resultVoicing;
    	let sD = sourceVoicing.degree;
    	let sP = sourceVoicing.pattern;
    	let tD;
    	let tP = [];
    	let m = sP[1] - sP[0];
    	let n = sP.length;
    	tD = sD + m;
    	for(let i = 0; i < n-1; i++){
    		tP[i] = sP[i+1] - m; 
    	}
    	tP[n-1] = scaleSize - m + 1;
    	resultVoicing = new Voicing(tD, tP);
    	return resultVoicing;
    }

    static operate(sourceVoicing, targetVoicing, operation){
    	return operation(sourceVoicing, targetVoicing);
    }

    static normalize(sourceVoicing, scaleSize){
    	let n = scaleSize;
    	let m = sourceVoicing.degree
 		let resultVoicing = new Voicing(((m % n) + n) % n, sourceVoicing.pattern);
 		return resultVoicing;
    }

    static difference(sourceVoicing, targetVoicing){
    	return this.operate(sourceVoicing, targetVoicing, (s, t) => {
            let r;
            let sD = s.degree;
            let sP = s.pattern;
            let tD = t.degree;
            let tP = t.pattern;
            let rD = tD - sD;
            let rP = [];
            for (let i = 0; i < sP.length; i++) {
                rP[i] = tP[i] - sP[i];
            }
            r = new Voicing(rD, rP);
            return r;
		});
    }

    static distance(sourceVoicing, targetVoicing){
    	return this.operate(sourceVoicing, targetVoicing, (s, t) => {
            let diff = this.difference(s, t);
            let dist = _.reduce(diff.pattern, (total, pVal) => { 
            	return diff.degree + total + pVal;}, 0);
            let result = dist / diff.pattern.length;
            return result;
		});
    }
    // to be discontinued
    static pattern(scaleSize, patternSize){
        let result = [];
        let fullPattern = [1, 3, 5, 7, 9, 11];
        let maxIndex = Math.floor(scaleSize / 2);
        result = fullPattern.slice(0, maxIndex); 
        if (scaleSize % 2 == 0){
            result.push(scaleSize);
        }
        else{
            result.push(fullPattern[maxIndex]);
        }
        return patternSize === undefined ? result : result.slice(0, patternSize);
    }
}
export {VoiceLeader};