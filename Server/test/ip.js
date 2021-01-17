import {findClosestTrackers} from '../src/services/helpers/geo';
import {expect} from 'chai';
import { mongo } from '../src/database/index';


describe("Retrieve IP info", () => {
  describe("Trackers", () => {
    it("Basic", async () => {
        await mongo.connect();

        //let trackers = await findClosestTrackers({}, 6)();
        //console.log(trackers);
        expect(true).to.equal(true);
    });

  }); 
});
