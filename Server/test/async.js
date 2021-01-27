'use strict';
import { mongo } from '../src/database/index';


describe('Test linked to the database', function () {

    it('should pass', function () {
        return mongo.connect()
            .then(function () {
                require('./async/tracker');
            });
    })

})