import { Router } from 'express';
import { getRoomById, createRoom, joinRoom, leaveRoom, getAllRooms } from './domain/rooms';
import { getUserFromAuthToken } from './domain/users';

const routes = Router();

/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
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



export default routes;
