import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import User from '../models/UserModel.js';


const app = express();
const server = http.createServer(app);

export const TaskAssigned = (assignees) => {
    // Ensure assignees is an array
    const assigneeIds = Array.isArray(assignees) ? assignees : [assignees];

    return assigneeIds.map((assigneeId) => users[assigneeId]);
};


 
  
// Map to store the user ID and their socket ID
const users = {};

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});


io.on('connection', (socket) => {
    //console.log('A user connected:', socket.id);
    const UserId = socket.handshake.query.UserId;
   // console.log("user Received:", UserId);
    if (UserId !== undefined) {
        users[UserId] = socket.id;
        User.findById(UserId)
        .then(user => {
          if (user) {
            console.log(`User ${user.name} connected with Socket ID ${socket.id}`);
          } else {
            console.log(`User with ID ${UserId} not found`);
          }
        })
        .catch(err => {
          console.error(`Error fetching user: ${err.message}`);
        });
        

    }


    // Handle disconnection
    socket.on('disconnect', () => {
        // Find and remove the userId from the users object when the user disconnects
        for (const userId in users) {
            if (users[userId] === socket.id) {
                console.log(`User ${userId} disconnected and removed from active users.`);
                delete users[userId];
                break;
            }
        }
        console.log('A user disconnected:', socket.id);
    });
});

export { io, server, app };
