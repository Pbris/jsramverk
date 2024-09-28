import { expect } from 'chai';
import { database } from '../db/database.mjs';

describe('Database Tests', function() {
    describe('getDb()', function() {
        it('should return a database object', async function() {
            const result = await database.getDb();
            expect(result).to.be.an('object');
        });
    });
});