import { useEffect, useRef, useState } from 'react';
import { motion } from "framer-motion"
import { BsFillChatLeftTextFill, BsPlusLg } from 'react-icons/bs';
import { AiOutlineClose, AiOutlineSend, AiOutlineMenu, AiFillPlusCircle } from 'react-icons/ai';
import { PiNotificationFill } from 'react-icons/pi';
import { FaUserFriends } from 'react-icons/fa';
import { MdChatBubble, MdMarkChatUnread} from 'react-icons/md';
import { BsToggleOn, BsToggleOff, BsMicMuteFill, BsPlusCircle } from 'react-icons/bs';
import { FaUsers, FaUser, FaUserTie, FaUserAltSlash, FaUserCog, FaUserMinus, FaUserPlus } from 'react-icons/fa';
import './Chatbox.scss';
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack, Input } from "@chakra-ui/react";
import NavbarChat from './Chat/NavbarChat.tsx';
import NavbarFriends from './Friends/NavbarFriends.tsx';
import NavbarNotif from './Notif/NavbarNotif.tsx';
import * as oldAPI from '../Profil/FetchApi.tsx';
import * as API from './FetchAPiChat.tsx';
import MainChat from './Chat/MainChat.tsx';
import MainFriends from './Friends/MainFriends.tsx';
import MainNotif from './Notif/MainNotif.tsx';
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card"

interface User {
    id: number;
    pseudo: string;
    urlPhotoProfile: string;
    userId: number;
}

interface ChatProps {
	myUser: any;
	selectedChat: any;
	setSelectedChat: React.Dispatch<any>;
	menu: number;
	setMenu: React.Dispatch<React.SetStateAction<number>>;
}

function ChatMain({myUser, selectedChat, setSelectedChat, menu, setMenu}: ChatProps) {
	const [ selectedFriend, setSelectedFriend] = useState<any>(null);
	const [ openNav, setOpenNav ] = useState<number>(1);

	const [ navStyles, setNavStyles ] = useState({
		NavOne: 'newNavOne',
		NavTwo: 'newNavTwo',
		NavThree: 'newNavThree',
		NavFour: 'newNavFour',
	});

    const user = myUser.myUser as User;

	const changeDisposition = () => {

		if (openNav === 1)
			setOpenNav(2);
		else
			setOpenNav(1);
	};

	useEffect(() => {
		document.documentElement.style.setProperty('--grid-placement', openNav.toString());
	  }, [openNav]);

	useEffect(() => {
		switch (menu) {
			case 1:
				setNavStyles({
					NavOne: 'newNavOne bg-black/10 text-white flex justify-center items-center',
					NavTwo: 'newNavTwo text-white flex justify-center items-center',
					NavThree: 'newNavThree text-white flex justify-center items-center',
					NavFour: 'newNavFour flex justify-center items-center',
				});
				break;
			case 2:
				setNavStyles({
					NavOne: 'newNavOne text-white flex justify-center items-center',
					NavTwo: 'newNavTwo bg-black/10 text-white flex justify-center items-center',
					NavThree: 'newNavThree text-white flex justify-center items-center',
					NavFour: 'newNavFour flex justify-center items-center',
				});
				break;
			case 3:
				setNavStyles({
					NavOne: 'newNavOne border-b-2 text-white flex justify-center items-center',
					NavTwo: 'newNavTwo border-b-2 text-white flex justify-center items-center',
					NavThree: 'newNavThree bg-black/10 text-indigo-400 border-l-2 flex justify-center items-center',
					NavFour: 'newNavFour flex justify-center items-center',
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
						<PiNotificationFill />
					</button>
					<button id='4' onClick={() => changeDisposition()} className={navStyles.NavFour}>
						{openNav === 1
							? <div className='text-white'><AiOutlineMenu /></div>
							: <div className='text-white/50'>
								<AiOutlineMenu />
							</div>
						}
					</button>
				</div>
				{openNav ? (menu === 1 
					? <NavbarChat selectedChat={selectedChat} setSelectedChat={setSelectedChat} className={`${openNav === 2 ? 'flex' : 'hidden'}`}/>
					: (menu === 2 ? <NavbarFriends selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} className={`${openNav === 2 ? 'flex' : 'hidden'}`}/>
					: <NavbarNotif />
				))	: <></>}
			</div>
			{menu === 1 
				? <MainChat selectedChat={selectedChat} setSelectedChat={setSelectedChat}/> 
				: (menu === 2 ? <MainFriends selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend}/> 
				: <MainNotif />
			)}
		</>
	)
}


export default function ChatBox({ready}: {ready: boolean}) {

	const [ isChatBoxOpen, setChatBoxOpen ] = useState<boolean>(false);
	const [ notification, setNotification ] = useState<boolean>(true);
	const [ chatRatio , setChatRatio ] = useState<number>(15);
	const [ selectedChat, setSelectedChat] = useState<any>(-1);
	const [ menu, setMenu ] = useState<number>(1);
    const [ myUser, setMyUser ] = useState<any>(null);
	const dragRef = useRef(null);

	const chatSize = (17 + chatRatio) < 32 ? 32 : 16 + chatRatio;

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
    
		const player = API.getMyself();
		setMyUser(player);

    }, [ready]);

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
			<div className='absolute h-full w-full' ref={dragRef}>
				<motion.div
					drag
					dragConstraints={dragRef}
					whileDrag={{ scale: 1.1, boxShadow: "-63px 42px 28px -7px rgba(0,0,0,0.1)" }}
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
					className="backdrop-blur-sm drop-shadow-xl newChatBox h-[26rem] w-[26rem]"
				>
					<div className="bg-black/70 drop-shadow-md newMenu flex flex-row-reverse items-center justify-between">
						<motion.button
						whileHover={{rotate: 90}}
						className="mr-1 text-white hover:text-red-500"
						onClick={() => setChatBoxOpen(false)}>
							<AiOutlineClose />
						</motion.button>
						<div className="mx-10 w-[100%] flex justify-center items-center">
							<Slider
								value={chatRatio}
								min={17}
								max={65}
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
					<ChatMain myUser={myUser} selectedChat={selectedChat} setSelectedChat={setSelectedChat}
						menu={menu} setMenu={setMenu}/>
				</motion.div>
			</div>
			)}
		</div>
	);
}
