import '../Chatbox.scss';
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from 'react';
import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi';
import * as oldAPI from '../../Profil/FetchApi';
import * as API from '../FetchAPiChat';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import ProfilCard from './ProfileCard';
import './Card.scss';

interface friendProps {
    selectedFriend: any;
    setSelectedFriend: React.Dispatch<any>;
}

const flipTransition = {
    type: "",
    ease: "linear",
    bounce: 0.25,
    duration: 0.1
};

function AcceptedFriend(friend: any, setFriend: any) {

    const player = friend.player;

    return (
        <div className='bg-slate-500/50 flex flex-col MainFriends items-start justify-center'>
            <div className='shadow-xl my-5 place-self-center bg-indigo-500/30 w-5/6 h-1/6 rounded-l-[5rem] rounded-r-xl flex'>
                <div className='relative -top-2 -left-3 w-[30%]'>
                    <img src={player.urlPhotoProfile} className='rounded-full shadow-xl'/>
                </div>
                <p className='text-white'>{friend.username}</p>
                <strong className='text-white text-xl place-self-center'>{player.pseudo}</strong>
            </div>
            <div className='shadow-xl bg-white/10 w-5/6 h-full place-self-center rounded-xl mb-5 text-white'>
            <Tabs isFitted defaultIndex={0} className='h-full'>
                <TabList>
                    <Tab>Game History</Tab>
                    <Tab>Options</Tab>
                </TabList>

                <TabPanels className='h-5/6'>
                    <TabPanel className='h-full flex flex-col items-center'>
                        <div className='w-full flex flex-row justify-between'>
                            <div>Ricko</div>
                            <div>3:4</div>
                            <div>Sid</div>
                        </div>
                        <div className='w-full flex flex-row justify-between'>
                            <div>Adnan</div>
                            <div>3:4</div>
                            <div>Ludi</div>
                        </div>
                    </TabPanel>
                    <TabPanel className='h-full flex flex-col items-center'>
                        <button
                            onClick={() => {
                                API.deleteFriend(player.id);
                                setFriend(null);
                            }}
                            className='h-10 w-[40%] bg-black/20 border border-1 my-5 flex items-center 
                            justify-center break-all text-ellipsis overflow-hidden text-white hover:bg-blue-500/20'
                        >
                            SPECTATE
                        </button>
                        <button
                            onClick={() => {
                                API.deleteFriend(player.id);
                                setFriend(null);
                            }}
                            className='h-10 w-[40%] bg-black/20 border border-1 my-5 flex items-center 
                            justify-center break-all text-ellipsis overflow-hidden text-white hover:bg-red-500/20'
                        >
                            REMOVE
                        </button>
                            <button
                            onClick={() => {
                                API.deleteFriend(player.id);
                                setFriend(null);
                            }}
                            className='h-10 w-[40%] bg-black/20 border border-1 my-5 flex items-center 
                            justify-center break-all text-ellipsis overflow-hidden text-white hover:bg-orange-500/20'
                        >
                            BLOCK
                        </button>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            </div>
        </div>
    )
}

function PendingFriend(friend: any, setFriend: any) {

    const player = friend.player;

    return (
        <div className='bg-slate-500/50 flex flex-col MainFriends items-center justify-center'>
            <div className='-translate-y-1/5 h-1/2 w-1/2 flex flex-col justify-center items-center'>
                <div className='flex w-full justify-around'>

                    <AnimatePresence mode='wait'>
                        <motion.img
                            key={player.id}
                            src={player.urlPhotoProfile}
                            className='rounded-full shadow-xl'
                            initial={{ scale: 0.7 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.7 }}
                            transition={flipTransition} 
                        />
                    </AnimatePresence>

                </div>
                <strong className='text-white'>{player.pseudo}</strong>
            </div>
            <div className='w-full flex justify-evenly'>
                <button
                    onClick={() => {
                        API.acceptFriendRequest(player.id);
                        const updatedFriend = {...friend, status: 'Accepted'};
                        setFriend(updatedFriend);
                    }}
                    className='h-10 w-[40%] bg-white/20 border border-1 my-5 flex items-center 
                    justify-center break-all text-ellipsis overflow-hidden text-white hover:bg-blue-500/20'
                >
                    Accept
                </button>
                <button
                    onClick={() => {
                        API.declineFriendRequest(player.id);
                        setFriend(null);
                    }}
                    className='h-10 w-[40%] bg-black/20 border border-1 my-5 flex items-center 
                    justify-center break-all text-ellipsis overflow-hidden text-white hover:bg-red-500/20'
                >
                    Decline
                </button>
            </div>
        </div>
    )
}

export default function MainFriends({selectedFriend, setSelectedFriend}: friendProps) {

    const [ users, setUsers ] = useState<any>(null);
    const [slidePosition, setSlidePosition] = useState(63);

    const handleCreateFriendship = async (user: any) => {

        const targetUser = user;

        const res = await API.sendFriendRequest(targetUser.pseudo);

        console.log(res);
    };

    const handleRightCardClick = () => {

        const pos = slidePosition;
        let newPosition = slidePosition - 252;
        

        if (users && newPosition < -((users.length - 1) * 256)) {
            newPosition = pos;
        }

    
        setSlidePosition(newPosition);
    };

    const handleLeftCardClick = () => {


        const pos = slidePosition;
        let newPosition = slidePosition + 252;
        
    
        if (newPosition > 252) {
            newPosition = pos;
        }
    
        setSlidePosition(newPosition);
    };


    useEffect(() => {

        const getUsers = async () => {
            const AllUsers = await oldAPI.fetcher('players/all');
            console.log("ALL users: ", AllUsers)
            setUsers(AllUsers);
        }
        getUsers();

    }, []);

    useEffect(() => {
        const handleScroll = (e: WheelEvent) => {
            if (e.deltaY > 0) {
                handleRightCardClick();
            } else if (e.deltaY < 0) {
                handleLeftCardClick();
            }
        };
    
        window.addEventListener('wheel', handleScroll);
    
        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, [slidePosition]);

    if (!users)
        return <></>

    if (selectedFriend) {

        console.log('main selectedfriend : ', selectedFriend);

        switch (selectedFriend.status) {
            case 'accepted':
                return AcceptedFriend(selectedFriend, setSelectedFriend);
            case 'requested':
                return PendingFriend(selectedFriend, setSelectedFriend);
            default:
                break;
        }
    }

    return (
        <>
            {users && 
                <div style={{}} className='bg-slate-500/ newMain flex justify-center overflow-hidden'>
                    <motion.div
                    initial={{
                        opacity: 0, scale: 0.5,
                    }}
                    animate={{
                        opacity: 1, scale: 1,
                        translateX: `${slidePosition}px`,
                    }}
                    transition={{ duration: 0.5 }}
                    className='carousel-wrapper w-full flex items-center'>
                    {users.map((user: any, index: number) => {
                        
                        if (index % 3 === 0) {
                            return (
                                <ProfilCard
                                key={user.id}
                                dataImage={user.urlPhotoProfile}
                                header={<h1 className='ml-20 mb-16'>{user.pseudo}</h1>}
                                content={<p></p>}   
                                starter={-100}
                                className='flex justify-center items-center h-3/6'
                                onClick={() => handleCreateFriendship(user)}
                                />
                            )
                        } else if (index % 3 === 1) {
                            return (
                                <ProfilCard
                                key={user.id}
                                dataImage={user.urlPhotoProfile}
                                header={<h1 className='mb-16 ml-10'>{user.pseudo}</h1>}
                                content={<p></p>}
                                className='flex justify-center items-center mx-7 h-3/6'
                                info='flex flex-col justify-center items-center'
                                starter={0}
                                onClick={() => handleCreateFriendship(user)}

                                />
                            )
                        } else if (index % 3 === 2) {
                            return (
                                <ProfilCard
                                key={user.id}
                                dataImage={user.urlPhotoProfile}
                                header={<h1 className='mb-16'>{user.pseudo}</h1>}
                                content={<p></p>}
                                starter={100}
                                className='flex justify-center items-center h-3/6'
                                onClick={() => handleCreateFriendship(user)}

                                />
                            )
                        } else {
                            return (
                                <ProfilCard
                                key={user.id}
                                dataImage={user.urlPhotoProfile}
                                header={<h1 className='mb-16'>{user.pseudo}</h1>}
                                content={<p></p>}
                                starter={100}
                                className='flex justify-center items-center h-3/6'
                                onClick={() => handleCreateFriendship(user)}

                                />
                            )
                        }
                    })}
                    </motion.div>
                </div>
            }
        </>
    )
}