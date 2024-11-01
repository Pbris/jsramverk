import { expect } from 'chai';
import { io as Client } from 'socket.io-client';
import jwt from 'jsonwebtoken';
import { httpServer } from '../src/server.mjs';
import documents from '../docs.mjs';

describe('Document Editor Socket Tests', () => {
    let clientSocket;
    const secret = process.env.TOKEN_SECRET || "NOT YET A SECRET";
    let testDocId;
    const PORT = 3030;

    before(async () => {
        // Start the server
        await new Promise(resolve => {
            httpServer.listen(PORT, () => {
                console.log(`Test server running on port ${PORT}`);
                resolve();
            });
        });

        // Create a test document in the database
        const result = await documents.addOne({
            title: 'Test Doc',
            content: 'Initial content',
            owner: 'kajsaAnka'
        }, 'kajsaAnka');
        testDocId = result.insertedId;

        // Create test user token
        const token = jwt.sign({ 
            _id: 'kajsaAnka', 
            email: 'ankan@test.com' 
        }, secret);

        // Connect to our test server
        clientSocket = Client(`http://localhost:${PORT}`, {
            auth: { token }
        });

        // Wait for connection
        await new Promise(resolve => clientSocket.on('connect', resolve));
    });

    after(async () => {
        clientSocket.close();
        // Clean up test document
        await documents.deleteOne(testDocId);
        // Close the server
        await new Promise(resolve => httpServer.close(resolve));
    });

    it('should join a document room and receive updates', (done) => {
        // Join document room
        clientSocket.emit('create', testDocId);

        // Send document update
        const updatedDoc = {
            _id: testDocId,
            title: 'Updated Title',
            content: 'Updated content'
        };

        // Listen for document updates
        clientSocket.on('doc', (data) => {
            expect(data.title).to.equal('Updated Title');
            expect(data.content).to.equal('Updated content');
            done();
        });

        // Emit document update
        clientSocket.emit('doc', updatedDoc);
    });
});