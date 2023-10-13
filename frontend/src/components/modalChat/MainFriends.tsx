import './Chatbox.css';
import { motion } from "framer-motion"
import { Input } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import { Avatar } from '@chakra-ui/react'
import { BiSolidLeftArrow, BiSolidRightArrow } from 'react-icons/bi';
import * as oldAPI from '../Profil/FetchApi';
import * as API from './FetchAPiChat';

export default function MainFriends(user: any) {

    const [ users, setUsers ] = useState<any>(null);
    const [ userIdx, setUserIdx ] = useState<number>(0);

    const handleCreateFriendship = async () => {

        const targetUser = users[userIdx];

        const res = await API.sendFriendRequest(targetUser.pseudo);

        console.log(res);
    };

    useEffect(() => {

        const getUsers = async () => {
            const AllUsers = await oldAPI.fetcher('players/all');
            console.log("ALL users: ", AllUsers)
            setUsers(AllUsers);
        }
        getUsers();

    }, []);

    if (!users)
        return <></>
    return (
        <>
        {users && 
            <div className='bg-slate-500/50 flex flex-col MainFriends items-center justify-center'>
                <div className='-translate-y-1/5 h-1/2 w-1/2 flex flex-col justify-center items-center'>
                    <div className='flex w-full justify-around'>
                        <button 
                        onClick={() => {
                            if (userIdx > 0)
                                setUserIdx(userIdx - 1);
                            else
                                setUserIdx(users.length - 1);  
                        }}
                        className='mx-5 hover:text-white'><BiSolidLeftArrow/></button>
                        <img src={users[userIdx].urlPhotoProfile} className='rounded-full'/>
                        <button
                        onClick={() => {
                            if (userIdx < users.length -1)
                                setUserIdx(userIdx + 1);
                            else
                                setUserIdx(0); 
                        }}
                        className='mx-5 hover:text-white'><BiSolidRightArrow/></button>
                    </div>
                    <strong className='text-white'>{users[userIdx].pseudo}</strong>
                </div>
                <button
                    onClick={() => handleCreateFriendship()}
                    className='h-10 w-[40%] bg-white/20 border border-1 my-5 flex items-center 
                    justify-center break-all text-ellipsis overflow-hidden text-white hover:bg-white/10'
                >
                    Add friend
                </button>
            </div>
        }
        </>
    )
}