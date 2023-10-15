import { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion"
import { BsChatDots, BsFillChatLeftTextFill } from 'react-icons/bs';
import { AiOutlineClose, AiOutlineSend } from 'react-icons/ai';
import { PiNotificationFill } from 'react-icons/pi';
import { FaUserFriends } from 'react-icons/fa';
import { MdChatBubble, MdMarkChatUnread} from 'react-icons/md';
import { BsToggleOn, BsToggleOff } from 'react-icons/bs';
import './Chatbox.css';
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack, Input } from "@chakra-ui/react";
import NavbarChat from './NavbarChat.tsx';
import NavbarFriends from './NavbarFriends.tsx';
import NavbarNotif from './NavbarNotif.tsx';
import * as oldAPI from '../Profil/FetchApi.tsx';
import * as API from './FetchAPiChat.tsx';
import MainChat from './MainChat.tsx';
import MainFriends from './MainFriends.tsx';
import MainNotif from './MainNotif.tsx';

interface User {
    id: number;
    pseudo: string;
    urlPhotoProfile: string;
    userId: number;
}

function ChatMain(myUser: any) {
	const [ menu, setMenu ] = useState<number>(1);
	const [ selectedFriend, setSelectedFriend] = useState<any>(null);
	const [ selectedChat, setSelectedChat] = useState<any>(-1);

	const [ navStyles, setNavStyles ] = useState({
		NavOne: 'newNavOne',
		NavTwo: 'newNavTwo',
		NavThree: 'newNavThree',
	});

    const user = myUser.myUser as User;

	useEffect(() => {
		switch (menu) {
			case 1:
				setNavStyles({
					NavOne: 'newNavOne bg-black/10 border-r-2 text-white flex justify-center items-center',
					NavTwo: 'newNavTwo border-b-2 text-white flex justify-center items-center',
					NavThree: 'newNavThree border-b-2 text-white flex justify-center items-center',
				});
				break;
			case 2:
				setNavStyles({
					NavOne: 'newNavOne border-b-2 text-white flex justify-center items-center',
					NavTwo: 'newNavTwo bg-black/10 text-white border-r-2 border-l-2 flex justify-center items-center',
					NavThree: 'newNavThree border-b-2 text-white flex justify-center items-center',
				});
				break;
			case 3:
				setNavStyles({
					NavOne: 'newNavOne border-b-2 text-white flex justify-center items-center',
					NavTwo: 'newNavTwo border-b-2 text-white flex justify-center items-center',
					NavThree: 'newNavThree bg-black/10 text-indigo-400 border-l-2 flex justify-center items-center',
				});
				break;
			default:
				break;
		}
	}, [menu]);

	return (
		<>
			<div className="bg-black/70 newNav shadow-md">
				<div className='newNavMenu'>
					<button id='1' onClick={() => setMenu(1)} className={navStyles.NavOne}>
						<BsFillChatLeftTextFill />
					</button>
					<button id='2' onClick={() => setMenu(2)} className={navStyles.NavTwo}>
						<FaUserFriends />
					</button>
					<button id='3' onClick={() => setMenu(3)} className={navStyles.NavThree}>
						{menu === 3 ?
							<div className='animate-spin duration-500'>
								<PiNotificationFill />
							</div> :
							<PiNotificationFill />
						}
					</button>
				</div>
				{menu === 1 
					? <NavbarChat selectedChat={selectedChat} setSelectedChat={setSelectedChat}/>
					: (menu === 2 ? <NavbarFriends selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend}/>
					: <NavbarNotif />
				)}
			</div>
			{menu === 1 
				? <MainChat selectedChat={selectedChat} setSelectedChat={setSelectedChat}/> 
				: (menu === 2 ? <MainFriends selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend}/> 
				: <MainNotif />
			)}
		</>
	)
}


export default function NewChatBox() {

	const [ isChatBoxOpen, setChatBoxOpen ] = useState<boolean>(false);
	const [ notification, setNotification ] = useState<boolean>(true);
	const [ chatRatio , setChatRatio ] = useState<number>(15);
    const [ myUser, setMyUser ] = useState<any>(null);

	const chatSize = (16 + chatRatio) < 31 ? 31 : 16 + chatRatio;

	const chatBoxOpener = `${isChatBoxOpen ? 'hidden' : ''} ${notification ? 'text-indigo-700' : 'text-black'} hover:border-white hover:text-white bg-white/70 hover:bg-white/0 
	flex justify-center items-center shadow-xl fixed left-5 bottom-5 z-5 border border-2 border-slate-500 w-16 h-10`;

	const ToggleChat = () => {
		setChatBoxOpen(!isChatBoxOpen);
		setChatRatio(1);
	}

	const handleClickOutside = (event: MouseEvent) => {
			//ToggleChat();
	};

    useEffect(() => {
    
        const GetUserData = () => {

			const fetchedUser = API.getMyself();//await API.getPlayerDataApi();
			return fetchedUser.player;
        };
		if (API.getCookie('jwt_token'))
			setMyUser(GetUserData());
        //GetUserData();

    });

	useEffect(() => {
		if (isChatBoxOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isChatBoxOpen]);

    if (!myUser)
        return <></>

	return (
		<div className='z-10'>
			{!isChatBoxOpen && (
				<button 
				onClick={() => {setNotification(!notification)}}
				className="hover:border-white hover:text-white bg-white/70 
				flex justify-center items-center shadow-xl fixed left-40 bottom-5 z-5 border-2 border-slate-500 w-16 h-10">
					{notification ? <BsToggleOn/> : <BsToggleOff/>}
				</button>
			)}
			<motion.button layout
				whileHover={{ scale: 1.2 }}
				transition={{ duration: 0.3 }}
				className={chatBoxOpener} onClick={() => ToggleChat()}>
				{notification ? <MdMarkChatUnread/> :<MdChatBubble /> }
			</motion.button>
			{isChatBoxOpen && (
					<motion.div
						drag
						style={{
							width: chatSize + "rem",
							height: chatSize + "rem",
							position: "fixed",
							left: "0%",
							bottom: "0%",
						}}
						initial={{ opacity: 0, scale: 0.5 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
						className="backdrop-blur-sm bg-white/30 shadow-xl newChatBox h-[26rem] w-[26rem]"
					>
						<div className="bg-black/70 shadow-md newMenu flex flex-row-reverse items-center justify-between">
							<motion.button
							whileHover={{rotate: 90}}
							className="mr-1 text-white hover:text-red-500"
							onClick={() => setChatBoxOpen(false)}>
								<AiOutlineClose />
							</motion.button>
							<div className="mx-10 w-[100%] flex justify-center items-center">
								<Slider
									value={chatRatio}
									min={15}
									max={40}
									aria-label="slider-chat"
									colorScheme="gray"
									onChange={(val) => setChatRatio(val)}
								>
									<SliderTrack>
										<SliderFilledTrack />
									</SliderTrack>
									<SliderThumb />
								</Slider>
							</div>
						</div>
						<ChatMain myUser={myUser}/>
					</motion.div>
			)}
		</div>
	);
}
