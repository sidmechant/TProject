import { useState, useEffect } from 'react';
import * as API from './FetchAPiChat';
import './Chatbox.css';
import { BiSolidCrown } from 'react-icons/bi';
import { IconType } from 'react-icons';
import { FaUsers, FaUser, FaUserTie, FaUserAltSlash, FaUserCog, FaUserMinus, FaUserPlus } from 'react-icons/fa';

interface ConversationProps {

	onClick: () => void;
	id?: string;
	message: string;
	icon?: React.ReactNode;
}

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

function OptionConversation({onClick, message}: ConversationProps) {

	return (
		<button
		onClick={onClick}
		className='hover:bg-black/10 h-10 min-h-[3rem] w-[96%] mx-1 bg-black/30 border border-1 mt-4 flex items-center justify-center text-white'>
				{message}
		</button>
	)
}

function ButtonConversation({onClick, message, id, icon}: ConversationProps) {

	return (
		<button
		id={id}
		key={id}
		onClick={onClick}
		className='hover:bg-white/10 h-10 min-h-[4rem] w-[96%] mx-1 bg-white/20 border border-1 mt-4 flex items-center justify-center text-white'>
			{icon}
			{message}
		</button>
	)
}

export default function NavbarChat({selectedChat, setSelectedChat}: ChatProps) {

	const [ myChannels, setMyChannels ] = useState<Channel[] | null>(null);
	const myUser = API.getMyself();

	useEffect(() => {

		const getMyChannels = async () => {
			const fetchedMyChannels : any = await API.getMyChannels(); //tmp value need real userId
			console.log("FETCHED: ", fetchedMyChannels);
			return fetchedMyChannels;
		}

		getMyChannels().then((result) => {
			setMyChannels(result);
		});

	}, []);

	return (
		<div className='newNavMain bg-black/10 flex flex-col items-center overflow-auto'>
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
					console.log(`set conv ${channel.id}`);
					setSelectedChat(channel.id);
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