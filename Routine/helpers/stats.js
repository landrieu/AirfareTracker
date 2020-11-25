import _ from './number';


export class BasicStats{
    constructor(numbers){
        this.numbers = numbers;
    }

    compute(){
        return {
            maxPrice:        this.max(),
            minPrice:        this.min(),
            averagePrice:    this.average(),
            medianPrice:     this.median(),
            range:      this.range(),
            nbResults:  this.nbResults()
        }
    }

    average(){
        return (this.numbers.reduce((acc, number) => (acc + (number / this.numbers.length)), 0)).rounding(2);
    }

    median(){
        return this.numbers.sort()[Math.floor(this.numbers.length / 2)];
    }

    nbResults(){
        return this.numbers.length;
    }
    min(){
        return Math.min(...this.numbers);
    }
    max(){
        return Math.max(...this.numbers);
    }
    range(){
        return (Math.max(...this.numbers) - Math.min(...this.numbers)).rounding(2);
        //return Math.round(Math.max(...this.numbers) - Math.min(...this.numbers));
    }
}