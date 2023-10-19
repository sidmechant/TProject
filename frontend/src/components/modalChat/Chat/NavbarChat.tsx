import { useState, useEffect } from 'react';
import * as API from '../FetchAPiChat';
import '../Chatbox.scss';
import { BiSolidCrown } from 'react-icons/bi';
import { IconType } from 'react-icons';
import { FaUsers, FaUser, FaUserTie, FaUserAltSlash, FaUserCog, FaUserMinus, FaUserPlus } from 'react-icons/fa';
import socket from '../../../socket';
import { Tooltip } from '@chakra-ui/react'

interface ConversationProps {

	onClick: () => void;
	id?: string;
	message: string;
	icon?: React.ReactNode;
}

interface ChatProps {
	
	selectedChat: any;
	setSelectedChat: React.Dispatch<any>;
	className?: string;
}

interface Channel {
    id: string;
    name: string;
    type: string;
    password: string;
    createdAt: Date;
    ownerId: number;
}

function OptionConversation({onClick, message}: ConversationProps) {

	return (
		<button
		onClick={onClick}
		className='hover:bg-black/10 h-10 min-h-[3rem] w-[90%] bg-black/30 border border-1 mt-4 flex items-center justify-center text-white'>
				{message}
		</button>
	)
}

function ButtonConversation({onClick, message, id, icon}: ConversationProps) {

	if (icon) {
		return (
			<button
			id={id}
			key={id}
			onClick={onClick}
			className='hover:bg-white/10 h-10 min-h-[4rem] w-[90%] bg-white/20 border border-1 mt-4 flex items-center justify-start text-white'>
				<div className='mx-3'>{icon}</div>
				<Tooltip label={message} aria-label='A Tooltip'>
					<p className='truncate'>{message}</p>
				</Tooltip>
			</button>
		)
	}
	return (
		<button
		id={id}
		key={id}
		onClick={onClick}
		className='hover:bg-white/10 h-10 min-h-[4rem] w-[90%] bg-white/20 border border-1 mt-4 flex items-center justify-start text-white'>
			<div className='mx-5'>{icon}</div>
			<Tooltip label={message} aria-label='A Tooltip'>
				<p className='truncate'>{message}</p>
			</Tooltip>
		</button>
	)
}

export default function NavbarChat({selectedChat, setSelectedChat, className}: ChatProps) {

	const [ myChannels, setMyChannels ] = useState<Channel[] | null>(null);
	const [ reload, setReload ] = useState<boolean>(false);
	const myUser = API.getMyself();

	useEffect(() => {

		const handleNewChannel = (channel: Channel) => {

			console.log("handleNewChannel: ", channel);
			if (channel.type === 'Private') {
				if (channel.ownerId === myUser.userId) {
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

		const getMyChannels = async () => {
			const fetchedMyChannels : any = await API.getMyChannels(); //tmp value need real userId
			console.log("FETCHED: ", fetchedMyChannels);
			return fetchedMyChannels;
		}

		getMyChannels().then((result) => {
			setMyChannels(result);
		});

	}, [reload]);

	return (
		<div className={`newNavMain bg-black/10 ${className} flex-col items-center overflow-auto`}>
			<OptionConversation
			message='Create'
			onClick={() => {
				console.log('new conv');
				setSelectedChat(-1);
			}}/>
			<OptionConversation
			message='Find'
			onClick={() => {
				console.log('find conv');
				setSelectedChat(-2);
			}}/>
			{myChannels && myChannels.map((channel: any, index: number) => (
				<ButtonConversation
				id={`${index}`}
				key={index}
				message={channel.channelName}
				icon={channel.ownerId === myUser.id ? <BiSolidCrown /> : undefined}
				onClick={() => {
					socket.emit('leaveChannel', selectedChat.channelId);
					setSelectedChat(channel);
					socket.emit('joinChannel', channel.channelId);
				}}
				/>
			))}
			<div className='bg-white flex'>
				<BiSolidCrown /><FaUser/><FaUserAltSlash/><FaUserCog/>
				<FaUserMinus/><FaUserPlus/><FaUserTie/><FaUsers/>
			</div>
		</div>
	)
}