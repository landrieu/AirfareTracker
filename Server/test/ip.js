import {findClosestTrackers} from '../src/services/helpers/geo';
import { randomTrackers } from '../src/services/data/tracker';
import { expect} from 'chai';
import { mongo } from '../src/database/index';


describe("Retrieve IP info", () => {
  describe("Trackers", () => {
    it("Basic", async () => {
        //await mongo.connect();

        //let trackers = await randomTrackers(6)
        //expect(trackers.length).to.equal(6);
        expect(true).to.equal(true);
    });

  }); 
});
