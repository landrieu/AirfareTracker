import { listFrequentTrackersAirports, randomTrackersIDs, formatNormalTracker } from '../../src/services/data/tracker';
import { expect } from 'chai';
import moment from 'moment';
import { DEFAULT_TRACKER_SOURCES, TRACKER_TYPES } from '../../src/services/constants/index';

import '../../src/services/helpers/prototypes';

describe("Find trackers", () => {
    it("Retrieve frequent trackers iata codes", async () => {
        let iatasF = await listFrequentTrackersAirports();
        expect(iatasF.length).to.gt(0);
        expect(iatasF).to.be.an('array');
    });

    it("Get random tracker IDs", async () => {
        let ids = await randomTrackersIDs();
        expect(ids.length).to.gt(0);
        expect(ids).to.be.an('array');
    });

    it("Format N tracker", () => {
        let userId = "0000000000";
        let userEmail = "test@test.com";
        let tracker = {
            from: 'PAR', 
            to: 'SYD', 
            triggerPrice: 150, 
            startDates: [new Date(moment().add(1, 'd')), new Date(moment().add(3, 'd'))], 
            endDates: [new Date(moment().add(10, 'd')), new Date(moment().add(11, 'd'))]
        };
        let fTracker = formatNormalTracker(tracker,userId, userEmail);

        expect(fTracker.userId).to.equal(userId);
        expect(fTracker.userEmail).to.equal(userEmail);
        expect(fTracker.type).to.equal(TRACKER_TYPES.NORMAL);
        expect(fTracker.sources).to.equal(DEFAULT_TRACKER_SOURCES);
        expect(fTracker.isAlertActive).to.equal(true);
        expect(fTracker.isActive).to.equal(true);
    });

    it("Format N tracker without trigger price", () => {
        let userId = "0000000000";
        let userEmail = "test@test.com";
        let tracker = {
            from: 'PAR', 
            to: 'SYD', 
            startDates: [new Date(moment().add(1, 'd')), new Date(moment().add(3, 'd'))], 
            endDates: [new Date(moment().add(10, 'd')), new Date(moment().add(11, 'd'))]
        };
        let fTracker = formatNormalTracker(tracker,userId, userEmail);

        expect(fTracker.type).to.equal(TRACKER_TYPES.NORMAL);
        expect(fTracker.sources).to.equal(DEFAULT_TRACKER_SOURCES);
        expect(fTracker.isAlertActive).to.equal(false);
        expect(fTracker.triggerPrice).to.equal(undefined);
        expect(fTracker.isActive).to.equal(true);
    });
});