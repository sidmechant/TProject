import { io } from 'socket.io-client';

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
localStorage.setItem('jwt_token', jwt_token as string);

const socket = io(URL, {
    query: {jwt_token: jwt_token},
    autoConnect: true,
});

console.log("QUERY: ", socket.io.opts.query);
console.log('NEW CONNECTION SOCKET WITH ', jwt_token);

socket.connect();

export default socket;