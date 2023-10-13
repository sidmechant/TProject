import './Chatbox.css';
import * as API from '../Profil/FetchApi.tsx';
import { useEffect, useState } from 'react';
import './interface.ts';

export default function NavbarFriends() {

	//list friends and display friend profile modal on click
    const [ friends, setFriends ] = useState<any>(null);
    const [ users, setUsers ] = useState<any>(null);
    const [ selectedUser, setSelectedUser ] = useState<User | null>(null);

    useEffect(() => {

        const getUsers = async () => {
            const AllUsers = await API.fetcher('players/all');
            console.log("ALL users: ", AllUsers)
            setUsers(AllUsers);
        }
        getUsers();
    }, []);

    useEffect(() => {

        console.log("FRIENDS = ", friends);
    }, [friends]);

    const selectUser = (currUser: User) => {
        setSelectedUser(currUser);
    };

    const userClass = 'h-10 w-[96%] mx-1 bg-white/20 border border-1 my-4 flex items-center justify-center text-white';
    const selectedUserClass = 'h-10 w-[96%] mx-1 bg-white/40 border border-1 border-indigo-400 my-4 flex items-center justify-center text-white'

	return (
		<div className='newNavMain bg-black/10 grid overflow-auto'>
            {users && (users.map((currUser: User, index: string) => (
                <button id={index}
                onClick={() => selectUser(currUser)}
                className={selectedUser === currUser ? selectedUserClass : userClass}
                >
                    {currUser.pseudo}
                </button>
            )))}
            <div className='h-10 w-[96%] mx-1 bg-white/20 border border-1 my-7 flex items-center 
                justify-center text-white'></div>
		</div>
	)
}