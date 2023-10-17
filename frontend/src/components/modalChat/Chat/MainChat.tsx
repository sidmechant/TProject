import '../Chatbox.scss';
/*import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@components/ui/hover-card"*/
  
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';
import { BsShieldLock } from 'react-icons/bs';
import {
	FormControl,
	FormLabel,
	Select,
	Input,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Box,
	Button
  } from '@chakra-ui/react'
  import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
  } from '@chakra-ui/react'
import * as API from '../FetchAPiChat';
import socket from '../../../socket';

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

interface userProps {
	user: any
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

function FindConversation({user}: userProps) {
	
	const [ allConv, setAllConv ] = useState<Channel[] | null>(null);
	const [ modal, setModal ] = useState<any>(null);
	const [ password, setPassword ] = useState<string>('');
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [ error , setError ] = useState<boolean>(false);
	const [ reload, setReload ] = useState<boolean>(false);

	useEffect(() => {

		const handleNewChannel = (channel: Channel) => {

			console.log("handleNewChannel: ", channel);
			if (channel.type === 'Private') {
				if (channel.ownerId === user.userId) {
					//setMyChannels((prevChannels) => [...(prevChannels || []), channel]);
					setReload(!reload);
				}
			} else {
				//setMyChannels((prevChannels) => [...(prevChannels || []), channel]);
				setReload(!reload);
			}
		};

		socket.on('newChannel', handleNewChannel);

		return () => {
			socket.off('newChannel', handleNewChannel);
		}
	}, []);

	useEffect(() => {

		const getConv = async () => {
			const fetchedConv = await API.getMissingChannels(); //need to replace 1 with userId

			return fetchedConv;
		}

		getConv().then((result: Channel[]) => {
			setAllConv(result);
		});

	}, [reload]);

	const submitPublic = async () => {

		const response = await API.joinPublic(modal.id);
		console.log("Submit public: ", response);
	};

	const submitProtected = async () => {

		const response = await API.joinProtected(modal.id, password);
		if (!response || response.data === false) {
			setError(true);
			setPassword('');
		} else {
			setError(false);
			onClose();
		}
		console.log("Submit protected: ", response);
	};

	const handleChange = (event: any) => {

		setPassword(event.target.value);
	};

	return (
		<>
			<div className="bg-slate-500/30 newMain flex justify-center items-start text-black">
				<Accordion allowToggle className='w-full h-full flex flex-col overflow-auto'>
					<AccordionItem key='public' className='bg-white/70'>
						<h2>
							<AccordionButton>
								<Box as='span' flex='1' textAlign='left'>
									Public channels
								</Box>
								<AccordionIcon />
							</AccordionButton>
						</h2>
						{allConv && allConv.filter((conv: Channel) => conv.type === 'public').map((conv: Channel, index: number) => (
							<AccordionPanel className='bg-indigo-700/20 hover:bg-indigo-700/30' id={`${conv.id}`} key={conv.id} pb={4} onClick={() => {setModal(conv);onOpen()}}>
							{conv.name}
							</AccordionPanel>

						))}
					</AccordionItem>

					<AccordionItem key='protected' className='bg-white/70'>
						<h2>
							<AccordionButton>
								<Box as='span' flex='1' textAlign='left'>
									<div className='flex justify-start items-center'>
										<div className='mr-5'>Protected channels</div>
										<BsShieldLock />
									</div>
								</Box>
								<AccordionIcon />
							</AccordionButton>
						</h2>
						{allConv && allConv.filter((conv: Channel) => conv.type === 'protected').map((conv: Channel, index: number) => (
						<AccordionPanel className='bg-indigo-700/20 hover:bg-indigo-700/30' id={`${conv.id}`} key={conv.id} pb={4} onClick={() => {setModal(conv);onOpen()}}>
								{conv.name}
						</AccordionPanel>

						))}
					</AccordionItem>
				</Accordion>
			</div>
			{ modal && (
				<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
				<ModalHeader>{modal.name}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{modal.type === 'protected'
					? (<Input
						id='password'
						bg={'white'}
						placeholder="********"
						name="password"
						type='password'
						value={password}
						errorBorderColor='pink.300'
						isInvalid={error}
						onChange={handleChange}
					  />)
					: ''
					}
				</ModalBody>

				<ModalFooter>
					<Button colorScheme='pink' mr={3} onClick={onClose}>
					Close
					</Button>
					<Button colorScheme='gray' onClick={() => {
						if (modal.type === 'protected')
							submitProtected();
						else
							submitPublic();
						onClose
					}}>Join Channel</Button>
				</ModalFooter>
				</ModalContent>
				</Modal>
			)}
		</>
	)
}

function CreateConversation({user}: userProps) {
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
	  <div className="bg-slate-500/30 newMain flex justify-center items-center text-black">
		<div className="w-5/6 flex flex-col">
		  <form onSubmit={handleSubmit}>
			<FormControl>
			  <div className="mb-5">
				<FormLabel>Channel Type</FormLabel>
				<Select
				id='select'
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
				  id='name'
				  bg={'white'}
				  placeholder={formData.invalid ? "Name min size required is 3" : "Name"}
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
				  id='password'
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
	const user = API.getMyself();
	const [ messages, setMessages ] = useState<any>(null);
	const [ channel, setChannel ] = useState<any>(null);
	const chatRef = useRef<HTMLDivElement>(null);

	
	const self = 'my-5 px-5 bg-slate-700/20 text-white flex min-h-24 w-64 mx-3 border border-1 border-black rounded-xl';
 
	const other = 'my-5 px-5 bg-indigo-700/40 text-white justify-self-end flex min-h-24 w-4/6 max-w-sm mx-3 border border-1 border-black rounded-xl';

    const handleValue = (event: any) => setValue(event.target.value);
	//socket.emit("joinChannel", "30");

	useEffect(() => {

		const elem = document.getElementById('chatmain');

		if (elem) {
			elem.scrollTop = elem.scrollHeight;
		}
	}, [messages]);
	useEffect(() => {

		const retrieveMessages = async () => {
			if (selectedChat && selectedChat !== -1 && selectedChat !== -2) {
				const res = await API.listMessages(selectedChat.channelId);
				console.log("res chat: ", res);
				console.log("sChat: ", selectedChat);
				if (res)
					return res;
			}
		}

		retrieveMessages().then((response: any) => setMessages(response));
	}, [selectedChat]);

	useEffect(() => {

		if (selectedChat && selectedChat !== -1 && selectedChat !== -2) {
			socket.emit('joinChannel', selectedChat.channelId);
			setChannel(selectedChat.channelId);
		}

		return () => {
			if (channel) {
				socket.emit('leaveChannel', channel);
			}
			setChannel(null);
		}

	}, []);

	useEffect(() => {

		const handleNewMessage = (payload: any) => {

			if (payload.channelId === channel) {
				console.log('received message: ', payload);
				setMessages((prevMessages: any) => [...prevMessages, payload.message]);
				if (chatRef.current) {
					chatRef.current.scrollTop = chatRef.current.scrollHeight;
				}
			}
		}
		socket.on('newMessage', handleNewMessage);

		return () => {
			socket.off('newMessage', handleNewMessage);
		}

	}, [channel, messages]);

	const submitMessage = async () => {

		const res = await API.sendMessage({channelId: selectedChat.channelId, userId: `${user.userId}`, message: value});

		console.log("after submit: ", res);
		console.log(selectedChat);
		setValue('');
	}

    const handleEnterInput = (event: any) => {

		if (event.key === 'Enter' && inputFocus) {
			console.log("pressed ENTER");
			submitMessage();
			setValue('');
		}
	};

	if (selectedChat === -1) {
		return <CreateConversation user={user}/>;
	} else if (selectedChat === -2) {
		return <FindConversation user={user}/>;
	}

	const getPlayerFromMessage = (userId: number) => {

		const player = selectedChat.players.find((player: any) => player.userId === userId);
		return player;
	}

    return (
        <>
			<div id='chatmain' ref={chatRef} className='grid newChat bg-slate-500/ overflow-auto'>
				{messages &&
					messages.map((message: any, index: number) => {

					const player = getPlayerFromMessage(message.userId);

					return (
						<div className={message.userId == user.userId ? self : other} key={index}>
							<div className='my-5'>
							<div className='h-12 w-12 min-h-12 min-w-12 rounded-full'>
								<img onClick={() => console.log(`pmessage: ${player.pseudo}`)} className='object-fill rounded-full' src={player.urlPhotoProfile} alt="Profile" />
							</div>
							</div>
							<div className='max-w-sm my-5 mx-5'>
							<strong className='flex text-start'>{player.pseudo}</strong>
							<div className='break-all'>{message.content}</div>
							</div>
						</div>
					)
				})}
    		</div>
		<div className="newMessage bg-slate-500/10 flex justify-center items-center">
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