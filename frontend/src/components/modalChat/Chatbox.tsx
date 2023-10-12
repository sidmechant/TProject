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
import * as API from '../Profil/FetchApi.tsx';

function ChatMain() {
	const [ menu, setMenu ] = useState<number>(1);
	const [ inputFocus, setInputFocus ] = useState<boolean>(false);
	const [ value, setValue ] = useState<string>('');
	const [ navStyles, setNavStyles ] = useState({
		NavOne: 'newNavOne',
		NavTwo: 'newNavTwo',
		NavThree: 'newNavThree',
	});

	const handleValue = (event: any) => setValue(event.target.value);

	const submitMessage = () => {
		console.log(value);
		setValue('');
	};

	const handleEnterInput = (event: any) => {

		if (event.key === 'Enter' && inputFocus) {
			console.log("pressed ENTER");
			submitMessage();
		}
	};

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
				{menu === 1 ? <NavbarChat /> : (menu === 2 ? <NavbarFriends /> : <NavbarNotif />)}
			</div>
			<div className="bg-slate-500/30 newMain"></div>
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
	)
}


export default function NewChatBox() {

	const [ isChatBoxOpen, setChatBoxOpen ] = useState<boolean>(false);
	const [ notification, setNotification ] = useState<boolean>(true);
	const [ chatRatio , setChatRatio ] = useState<number>(1);
    const [ myUser, setMyUser ] = useState<any>(null);

	const chatSize = 16 + chatRatio;

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
    
        const GetUserData = async () => {

            const fetchedUser = await API.getPlayerDataApi();

            console.log("fetchedUser: ", fetchedUser);
            setMyUser(fetchedUser);
        };
    }, []);

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
				flex justify-center items-center shadow-xl fixed left-40 bottom-5 z-5 border border-2 border-slate-500 w-16 h-10">
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
						className="backdrop-blur-sm bg-white/30 shadow-xl newChatBox"
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
									min={1}
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
						<ChatMain />
					</motion.div>
			)}
		</div>
	);
}
