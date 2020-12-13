import {validateNewTracker} from '../src/services/form-validation/tracker';
import {expect} from 'chai';

describe("Validate form", function() {
  describe("New tracker", function() {
    it("Basic", async () => {
      let newTracker = {
        from: 'PAR',
        to: 'TLS',
        type: 'N',
        startDates: [new Date('2021', '06', '26')],
        endDates: [new Date('2021', '06', '28')],
      };
    
      let { valid, errors } = await validateNewTracker(newTracker);
      expect(valid).to.equal(true);
      expect(errors.length).to.equal(0);
    });

    it("End dates before start dates", async () => {
      let newTracker = {
        from: 'PAR',
        to: 'TLS',
        type: 'N',
        startDates: [new Date('2021', '06', '26')],
        endDates: [new Date('2021', '06', '28'), new Date('2021', '06', '20')],
      };
    
      let { valid, errors } = await validateNewTracker(newTracker);
      expect(valid).to.equal(false);
      expect(errors.length).to.equal(1);
    });
  });  
});
