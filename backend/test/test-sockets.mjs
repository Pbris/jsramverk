import { use, expect } from 'chai';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as Client } from 'socket.io-client';
import jwt from 'jsonwebtoken';

describe('Socket Tests', () => {
    let io, clientSocket;
    const secret = "test-secret";

    before((done) => {
        // Create mini-server
        const httpServer = createServer();
        io = new Server(httpServer);
        
        // Setup authentication
        io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            jwt.verify(token, secret, (err, decoded) => {
                if (err) return next(new Error("Unauthorized"));
                socket.user = decoded;
                next();
            });
        });

        // Handle messages
        io.on("connection", (socket) => {
            socket.on("hello", (msg) => {
                socket.emit("reply", "got your message: " + msg);
            });
        });

        // Start server and connect client
        httpServer.listen(() => {
            const token = jwt.sign({ _id: "test" }, secret);
            clientSocket = Client(`http://localhost:${httpServer.address().port}`, {
                auth: { token }
            });
            clientSocket.on("connect", done);
        });
    });

    // Clean up after tests
    after(() => {
        io.close();
        clientSocket.close();
    });

    it('should connect successfully', (done) => {
        expect(clientSocket.connected).to.be.true;
        done();
    });

    it('should send and receive messages', (done) => {
        clientSocket.emit("hello", "test message");
        
        clientSocket.on("reply", (msg) => {
            expect(msg).to.equal("got your message: test message");
            done();
        });
    });
});