import { findClosestTrackers, findClosestAirport, computeGeoDistance } from '../src/services/helpers/geo';
import { expect } from 'chai';
import { mongo } from '../src/database/index';


describe("Geo", () => {
    describe("Basic", () => {
        it("Distance Paris - Madrid", async () => {
            let paris = {
                lat: 48.864716,
                lon: 2.349014
            }

            let madrid = {
                lat: 40.416775,
                lon: -3.703790
            };

            let distance = computeGeoDistance(paris.lat, paris.lon, madrid.lat, madrid.lon);
            expect(distance).to.be.within(1050, 1060);
        });

        it("Distance Paris - Sydney", async () => {
            let paris = {
                lat: 48.864716,
                lon: 2.349014
            }

            let sydney = {
                lat: -33.865143,
                lon: 151.209900
            };

            let distance = computeGeoDistance(paris.lat, paris.lon, sydney.lat, sydney.lon);
            expect(distance).to.be.within(16950, 16970);
        });

        it("Missing coordinate", () => {

            let distance = computeGeoDistance(1, 0, null, 10);
            expect(distance).to.equal(null);
        });

    });
});
