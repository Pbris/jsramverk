import { expect } from 'chai';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { io as Client } from 'socket.io-client';
import jwt from 'jsonwebtoken';

const secret = process.env.TOKEN_SECRET || "NOT YET A SECRET";

describe('Socket.io Tests', () => {
    let io, serverSocket, clientSocket;

    before((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        
        // Copy server authentication middleware
        io.use((socket, next) => {
            const token = socket.handshake.auth.token;
            jwt.verify(token, secret, (err, decoded) => {
                if (err) return next(new Error("Unauthorized"));
                socket.user = decoded;
                return next();
            });
        });

        httpServer.listen(() => {
            const port = httpServer.address().port;
            // Create test token
            const token = jwt.sign({ _id: "testUser", email: "test@test.com" }, secret);
            
            clientSocket = Client(`http://localhost:${port}`, {
                auth: { token }
            });

            io.on("connection", (socket) => {
                serverSocket = socket;
            });

            clientSocket.on("connect", done);
        });
    });

    after(() => {
        io.close();
        clientSocket.close();
    });

    it('should establish authenticated connection', (done) => {
        expect(clientSocket.connected).to.be.true;
        done();
    });
});