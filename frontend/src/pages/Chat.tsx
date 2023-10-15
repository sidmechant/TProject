import { AiOutlineMenu, AiOutlineMessage, AiOutlineSend, AiOutlinePlusCircle } from 'react-icons/ai';
import { BsFillPersonFill } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import * as oldAPI from '../components/Profil/FetchApi';
import * as API from '../components/modalChat/FetchAPiChat';
 
interface MessageProps { //model message temporaire
  photo: string; //photo du user qui envoi le msg
  pseudo: string; //pseudo user qui envoi le msg
  content: string; //contenu du msg
  id: string;
}
 
interface DiscussionProps { //model discussion temporaire
  name: string; //nom de la discussion
  type: string; //type de discussion (Private ou Discussion)
  //messages: MessageProps[];
  id: number; //id discussion
}
 
async function SendMessage(message: string) {
 
  //sendMessage to database
  console.log(`message sent: ${message}`);
}
 
/*
  message =  {

    user,
    contenu,
  }

*/
function ListMessage({id}: {id: string}) {
  
  console.log(id);
  /*
    il faut query les messages de la conversation selectionne dont on a l'id et mettre les messages avec setMessages
    */
  const [messages, setMessages] = useState<MessageProps[] | null>([
    {
      photo: 'https://i.imgur.com/G6zfcso.gif',
      pseudo: 'Ricko',
      content: 'Ah les humains',
      id: '1',
    },
    {
      photo: 'https://i.imgur.com/eQJ86KI.jpeg',
      pseudo: 'La sidance',
      content: 'Grand texte teh les plus grands auteurs reconnus de porte de clichy, force au double diplome et aux baveux de toute lile de france c utile pour se defendre en cas de litige et surtout pour verifier si la div peut setendre correctement carrement je dois rajouter encore bcp de texte c fatiguant sah de devoir faire ca juste pour voir si ca passe ou pas',
      id: '91763',
    },
    {
      photo: 'https://i.imgur.com/G6zfcso.gif',
      pseudo: 'Ricko',
      content: 'Super beau message de fin',
      id: '1',
    },
  ]);
 
  const self = 'my-5 px-5 bg-white flex min-h-24 w-64 mx-3 border border-1 border-black rounded-xl';
 
  const other = 'my-5 px-5 bg-indigo-400 justify-self-end flex min-h-24 w-4/6 max-w-sm mx-3 border border-1 border-black rounded-xl';
 
  return (
    <div className='grid overflow-auto h-[100%]'>
      {messages &&
        messages.map((message, index) => (
          <div className={message.id == id ? self : other} key={index}>
            <div className='my-5'>
              <div className='h-12 w-12 min-h-12 min-w-12 rounded-full'>
                <img className='object-fill rounded-full' src={message.photo} alt="Profile" />
              </div>
            </div>
            <div className='max-w-sm my-5 mx-5'>
              <strong className='flex text-start'>{message.pseudo}</strong>
              <div className='break-all'>{message.content}</div>
            </div>
          </div>
        ))}
    </div>
  );
}
 
function Discussion() {
 
  //display current discussion

  const [myUser, setMyUser] = useState<any>(null);
  const [message, setMessage] = useState<string>('');
  const [discussion, setDiscussion] = useState<DiscussionProps | null>( /* Query toutes les discussions de l'User connecte et les ajouter avec setDiscussion */
    {
      name: 'Conv',
      type: 'Conversation',
      id: 1,
    }
  );
  const [discussions, setDiscussions] = useState<DiscussionProps[]>(
    [
      {
        name: 'Conv',
        type: 'Conversation', 
        id: 1,
      },
      {
        name: 'Private',
        type: 'Private',
        id: 2,
      }
    ]
  );

  useEffect(() => {

    /*const fetchData = async () => {
      const user = await API.getPlayerDataApi();

      setMyUser(user.player);
    }*/

    const fetchData = () => {
      const user = API.getMyself();
      setMyUser(user);
    }

    fetchData();
  }, []);

  useEffect(() => {
    console.log(myUser);
  }, [myUser]);
 

  if (myUser === null)
    return <></>;

  const handleMessage = (event: any) => {
    const currMessage = event.target.value;
    setMessage(currMessage);
  };
 
 
  const DisplayChannels = () => {
 
    //query all channels and choose current
 
    const dis = 'hover:bg-gray-200 my-2 bg-white w-5/6 h-14 flex justify-center items-center shadow-md';
    const selected = 'hover:bg-gray-500 text-white my-2 bg-gray-700 w-5/6 h-14 flex justify-center items-center shadow-md';
    return (
      <>
        <div className='hidden overflow-auto h-[98%] lg:flex items-center flex-col m-2 bg-slate-300 w-2/6'>
        <button className='my-4 mb-7 bg-sky-800 w-5/6 h-16 
          relative flex justify-center shadow-xl text-white
          flex justify-evenly items-center hover:bg-sky-600
          '>
            <AiOutlinePlusCircle/> Create new discussion
          </button>
          {discussions &&
            discussions.map((curr, index) => (
            <button key={index} className={curr.id === discussion?.id ? selected : dis}
              onClick={() => setDiscussion(curr)}>
              {curr.name}
            </button>
          ))}
        </div>
      </>
    )
  };
 
  return (
    <>
      <div className='h-[93%] w-[100%] bg-slate-100 grid lg:flex lg:place-self-center xl:w-[70%] xl:ml-[15%]'>
        <div className='bg-slate-400 relative place-self-center h-[98%] w-[96%] shadow-xl
          flex flex-col lg:w-4/6 lg:place-self-start lg:mt-2 lg:ml-2'>
          <div className='bg-gray-700 h-5/6'>
            <ListMessage id={myUser.id} />
          </div>
          <div className='bg-sky-800 h-1/6 flex justify-evenly'>
            <input className='shadow-xl border border-1 border-slate-500
            bg-white self-center ml-5 w-4/6 h-4/6 text-center px-4' type="text"
              placeholder="Send a message..."
              value={message}
              onChange={handleMessage}
            />
            <button className='bg-white shadow-xl border border-1 border-slate-500 
            flex self-center h-10 w-10 items-center justify-center rounded-full
            hover:bg-sky-600 hover:text-white'
            onClick={() => {
              SendMessage(message);
              setMessage('');
            }}>
              <AiOutlineSend/>
            </button>
          </div>
        </div>
        <DisplayChannels />
      </div>
    </>
  );
}
 
function Navbar() {
  return (
    <div className='h-[7%] bg-slate-900 w-full flex justify-between items-center text-white'>
        <button className='ml-5'><AiOutlineMenu /></button>
        <h1>Transcendance</h1>
        <button className='mr-5 border border-2 rounded-full'><BsFillPersonFill/></button>
    </div>
  )
};
 
function Chat() {

  return (
    <div className='Chat bg-white'>
      <Navbar />
      <Discussion />
    </div>
  )
}
 
export default Chat;



/*import React, { useState, useEffect } from 'react';
import CreateChannel from '../components/Chat/CreateChannel';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

const Chat = () => {
    const [chatSocket, setChatSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            const chatSocket = io('http://localhost:3000/chat', {
                query: {
                    token: token,
                },
            });
            console.log("TOKEN FRONT ", token);
            console.log("HHEEEY FRONT");
            // Écoutez les nouveaux messages


            chatSocket.on('new-message', (message: string) => {
                setMessages(prev => [...prev, message]);
            });
            

            setChatSocket(chatSocket);

            return () => {
                chatSocket.disconnect();
                chatSocket.off('new-message');  // Supprimez l'écouteur d'événements lors du démontage
            }
        }
    }, []);

    const sendMessage = () => {
        if (chatSocket && message.trim() !== '') {
            chatSocket.emit('message', message);

            setMessage('');
        }
    };

    return (
        <>
            <div>Chat</div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg}</div>
                ))}
            </div>
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />

            <button onClick={sendMessage}>Send</button>
            <br />
            <CreateChannel />
        </>
    );
};

export default Chat;
*/