class Voicing {
    constructor(degree, pattern) {
        this._degree = degree;
        this._pattern = pattern;
    }
    get degree(){
        return this._degree;
    }
    set degree(degree){
        this._degree = degree;
    }
    get pattern(){
        return this._pattern;
    }
    set pattern(pattern){
        this._pattern = pattern;
    }
}
export {Voicing};