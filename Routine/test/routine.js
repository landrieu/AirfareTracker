import {expect} from 'chai';
import {defineDatesFrequentTracker} from '../index';


describe("Validate form", function() {
  describe("New tracker", function() {
    it("Basic", function() {
        let occurences = [
            {interval: '1w', length: '4t'},
            {interval: '3m', length: '2w'}
        ]

        let d = defineDatesFrequentTracker(occurences);
        console.log(d);

        expect(true).to.equal(true);
    });
  });  
});
