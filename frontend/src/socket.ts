import { Socket, io } from 'socket.io-client';

const URL : string = 'http://localhost:3000';

const getCookie = (name: string) => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split('=');
      if (cookieName === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    return null;
  };

const jwt_token = getCookie('jwt_token');

let socket: Socket;

if (jwt_token) {
  localStorage.setItem('jwt_token', jwt_token as string);
  socket = io(URL, {
    query: {jwt_token: jwt_token},
    autoConnect: true,
});
} else {
  socket = io(URL);
}

socket.connect();

export function setJwtToken(jwtToken: string) {
  socket.disconnect();

  socket.io.opts.query = {
    jwt_token: jwtToken
  };

  socket.connect();

  console.log("QUERY SOCK: ", socket.io.opts.query);
}

export default socket;