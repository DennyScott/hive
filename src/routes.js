import { Router } from 'express';
import { getRoomById, createRoom, joinRoom, leaveRoom, getAllRooms } from './domain/rooms';
import { createConversation, getConversationsByUserId } from './domain/conversations';
import { getUserFromAuthToken, getUsersById } from './domain/users';

const routes = Router();

routes.get('/rooms', (req, res) => {
  getAllRooms().then(rooms => res.json(rooms));
});

routes.post('/rooms', (req, res) => {
  getUserFromAuthToken(req.token).then(user => {
    createRoom(req.body.name, req.body.totalSize, user)
      .then(room => res.json(room))
  });
});

routes.put('/rooms/:id', (req, res) => {
  getUserFromAuthToken(req.token).then(user => {
    joinRoom(req.params.id, user)
      .then(room => res.json(room));
  });
});

routes.post('/rooms/:id/leave', (req, res) => {
  getUserFromAuthToken(req.token).then(user => {
    leaveRoom(req.params.id, user)
      .then(leftRoom => res.json(leftRoom));
  });
});

routes.get('/rooms/:id', (req,res) => {
  getRoomById(req.params.id).then(room => res.json(room));
});

routes.post('/rooms/:id/conversations', (req, res) => {
  getUserFromAuthToken(req.token).then(user => {
    const userIds = ['59d17803c30f608e10c993dd', '59d84fafb372c1097b3ba4a1'];
    getUsersById(userIds).then(users => {
      createConversation(users, req.params.id)
        .then(con => res.json(con));
    });
  });
});

routes.get('/rooms/:id/conversations', (req, res) => {
  getUserFromAuthToken(req.token).then(user => {
    getConversationsByUserId(user, req.params.id)
      .then(conversations => res.json(conversations));
  })
})



export default routes;
