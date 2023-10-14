import './Chatbox.css';
import { motion } from "framer-motion"
import { useEffect, useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import {
	FormControl,
	FormLabel,
	Select,
	Input
  } from '@chakra-ui/react'
import * as API from './FetchAPiChat';

interface ChatProps {
	
	selectedChat: any;
	setSelectedChat: React.Dispatch<any>;
}

interface Channel {
    id: string;
    name: string;
    type: string;
    password: string;
    createdAt: Date;
    ownerId: number;
}

function getCookie(name: string) {
	const cookies = document.cookie.split(';');
	for (let i = 0; i < cookies.length; i++) {
	  const cookie = cookies[i].trim();
	  if (cookie.startsWith(name + '=')) {
		return cookie.substring(name.length + 1);
	  }
	}
	return null;
}

function FindConversation() {
	
	const [ allConv, setAllConv ] = useState<Channel[] | null>(null);

	useEffect(() => {

		const getConv = async () => {
			const fetchedConv = await API.getMissingChannels(1); //need to replace 1 with userId

			return fetchedConv;
		}

		getConv().then((result: Channel[]) => {
			setAllConv(result);
		});

	}, []);

	return (
		<div className="bg-slate-500/30 MainChat flex justify-center items-center text-black">
			{allConv && allConv.map((conv: Channel, index: number) => (
				<button 
				className='h-10 min-h-[4rem] w-[96%] mx-1 bg-white/20 
				border border-1 mt-4 flex items-center justify-center text-white'
				>
					{conv.name}
				</button>
			))}
		</div>
	)
}

function CreateConversation() {
	const [formData, setFormData] = useState({
	  type: 'Public',
	  name: '',
	  password: '',
	  invalid: false,
	});
  
	const handleSubmit = async (event: any) => {
	  event.preventDefault();
  
	  if (formData.name.length < 3) {
		setFormData({
			...formData,
			invalid: true,
		})
		return ;
	  }
	  console.log('Form data', formData);
	  const jwtToken = getCookie('jwt_token');
	  const sessionToken = getCookie('token');
	  const test = await API.createChannel(formData, jwtToken, sessionToken);
	  console.log("test API create channel: ", test);
	};
  
	const handleChange = (event: any) => {
		const { name, value } = event.target;
		
		if (name === 'name')
			setFormData({
				...formData,
				invalid: false,
		})
		if (name === 'type' && value !== 'Protected') {
		  setFormData({
			...formData,
			[name]: value,
			password: '',
		  });
		} else {
		  setFormData({
			...formData,
			[name]: value,
		  });
		}
	};
	
	const isPasswordInputDisabled = formData.type !== 'Protected';
  
	return (
	  <div className="bg-slate-500/30 MainChat flex justify-center items-center text-black">
		<div className="w-5/6 flex flex-col">
		  <form onSubmit={handleSubmit}>
			<FormControl>
			  <div className="mb-5">
				<FormLabel>Channel Type</FormLabel>
				<Select
				  bg={'white'}
				  name="type"
				  value={formData.type}
				  onChange={handleChange}
				>
				  <option value="Public">Public</option>
				  <option value="Protected">Protected</option>
				  <option value="Private">Private</option>
				</Select>
			  </div>
			  <div className="mb-5">
				<FormLabel>Channel name</FormLabel>
				<Input
				  bg={'white'}
				  placeholder={formData.invalid ? "Name min required size is 3" : "Name"}
				  name="name"
				  isInvalid={formData.invalid}
				  errorBorderColor={'red.300'}
				  value={formData.name}
				  onChange={handleChange}
				/>
			  </div>
			  <div>
				<FormLabel>Password</FormLabel>
				<Input
				  bg={'white'}
				  placeholder="********"
				  name="password"
				  type='password'
				  value={formData.password}
				  disabled={isPasswordInputDisabled}
				  onChange={handleChange}
				/>
			  </div>
			  <div className='flex justify-center'>
			  <Input
				type="submit"
				value="Submit"
				bg={'#c53066'}
				className="w-1/2 rounded-md text-white border border-1 my-5 mt-12"
			  />
			  </div>
			</FormControl>
		  </form>
		</div>
	  </div>
	);
  }


  interface MessageProps { //model message temporaire
	photo: string; //photo du user qui envoi le msg
	pseudo: string; //pseudo user qui envoi le msg
	content: string; //contenu du msg
	id: string;
  }

export default function MainChat({selectedChat, setSelectedChat}: ChatProps) {

    const [ value, setValue ] = useState<string>('');
    const [ inputFocus, setInputFocus ] = useState<boolean>(false);
	const id = '1';
	const [messages, setMessages] = useState<MessageProps[]>([
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

    const handleValue = (event: any) => setValue(event.target.value);

    const submitMessage = () => {

		const newMessage = value[0] === '.' ? {
			photo: 'https://i.imgur.com/G6zfcso.gif',
			pseudo: 'Ricko',
			content: value,
			id: '1',
		} : {
			photo: 'https://i.imgur.com/eQJ86KI.jpeg',
			pseudo: 'La sidance',
			content: value,
			id: '91763',
		};


		setMessages((prevMessages) => [...prevMessages, newMessage]);
		console.log(value);
		setValue('');
	};

	console.log(selectedChat);
    const handleEnterInput = (event: any) => {

		if (event.key === 'Enter' && inputFocus) {
			console.log("pressed ENTER");
			submitMessage();
		}
	};

	if (selectedChat === -1) {
		return <CreateConversation />;
	} else if (selectedChat === -2) {
		return <FindConversation />;
	}

    return (
        <>
        <div className="bg-slate-500/30 MainChat">
			<div className='grid overflow-auto h-5/6'>
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
		</div>
			<div className="bg-slate-500/70 newMessage flex justify-center items-center">
				<Input
				className='mx-5'
				value={value}
				onChange={handleValue}
				textColor='white'
				placeholder='Send a message...'
				focusBorderColor='pink.400'
				onFocus={() => setInputFocus(true)}
				onBlur={() => setInputFocus(false)}
				onKeyDown={(event) => handleEnterInput(event)}
				size='sm'
      			/>
				<motion.button 
				whileHover={{rotate: -90}}
				onClick={() => submitMessage()}
				className='mr-5 h-7 w-10 border border-1 border-white text-gray flex justify-center items-center
				  hover:text-white'>
					<AiOutlineSend />
				</motion.button>
			</div>
        </>
    );
}