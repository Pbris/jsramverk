import { expect } from 'chai';
import docs from '../docs.mjs';

describe('Docs Tests', function() {
    describe('getAll()', function() {
        it('should return an array of documents', async function() {  
            const result = await docs.getAll();
            expect(result).to.be.an('array');
        });
    });
    describe('addOne()', function() {
        it('should add a document', async function() {
            const result = await docs.addOne({ title: 'Test', content: 'Test' }, 'test');
            expect(result).to.be.an('object');
        });
    });
});