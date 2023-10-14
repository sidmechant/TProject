import { useState, useEffect } from 'react';
import * as API from './FetchAPiChat';
import './Chatbox.css';

interface ConversationProps {

	onClick: () => void;
	id?: string;
	message: string;
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

function ButtonConversation({onClick, message, id}: ConversationProps) {

	return (
		<button
		id={id}
		key={id}
		onClick={onClick}
		className='h-10 min-h-[4rem] w-[96%] mx-1 bg-white/20 border border-1 mt-4 flex items-center justify-center text-white'>
				{message}
		</button>
	)
}

export default function NavbarChat({selectedChat, setSelectedChat}: ChatProps) {

	const [ myChannels, setMyChannels ] = useState<Channel[] | null>(null);
	const myUser = API.getMyself();

	useEffect(() => {

		const getMyChannels = async () => {
			const fetchedMyChannels : Channel[] = await API.getMyChannels(myUser.id); //tmp value need real userId

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
			<OptionConversation
			message='Test'
			onClick={() => {
				console.log('Test');
				setSelectedChat(0);
			}}/>
			{myChannels && myChannels.map((channel: Channel, index: number) => (
				<ButtonConversation
				id={channel.id}
				message={channel.name}
				onClick={() => {
					console.log(`set conv ${channel.id}`);
					setSelectedChat(channel.id);
				}}
				/>
			))}
		</div>
	)
}