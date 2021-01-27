import { assert } from 'chai';
import { renameObjectKey } from '../src/services/helpers/object';
import { isNullOrUndefined } from '../src/services/helpers/misc';
import { expect } from 'chai';

describe("Misc", () => {
    describe("Object helper", () => {
        it("Rename object keys", async () => {
            let o = {
                a: 1,
                b: 2
            };

            //Delete key 'b', replaced by 'c'
            renameObjectKey(o, 'c', 'b');

            assert.hasAllKeys(o, ['a', 'c']);
        });
    });

    describe("Null or undefined", () => {
        it("Non null or undefined", () => {
            let v1 = 1;
            let v2 = 0;
            let v3 = false;

            let isNorU = isNullOrUndefined(v1, v2, v3);
            expect(isNorU).to.equal(false);
        });

        it("Is null or undefined", () => {
            let v1 = 1;
            let v2 = undefined;
            let v3 = false;

            let isNorU = isNullOrUndefined(v1, v2, v3);
            expect(isNorU).to.equal(true);
        });
    });
});

