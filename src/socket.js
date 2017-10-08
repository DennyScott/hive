import { getUserFromAuthToken } from './domain/users';
import * as authModel from './domain/auth';
import OAuth2Server from'oauth2-server';
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

const init = (io) => {
  io.use((socket, next) => {
    let token = socket.handshake.query.token;
    const oauth = new OAuth2Server({
      model: authModel,
      requireClientAuthentication: { password: false}
    });

    let request = new Request({
      method: 'GET',
      query: {},
      headers: {Authorization: `Bearer ${token}`}
    });

    let response = new Response({
      headers: {},
    });

    oauth.authenticate(request, response)
      .then(token => {
        const {firstname, lastname, email, username, _id} = token.user;
        socket.user = {
          firstname,
          lastname,
          email,
          username,
          _id
        };
        return next();
      })
      .catch(err => next(new Error("Socket was not authenticated")));
  });

  io.on('connection', socket => {
    socket.emit('test', 'other data');
  })
}

export {init};
