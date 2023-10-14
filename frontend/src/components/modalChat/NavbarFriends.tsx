import './Chatbox.css';
import * as oldAPI from '../Profil/FetchApi.tsx';
import React, { useEffect, useState } from 'react';
import './interface.ts';
import * as API from './FetchAPiChat.tsx';

interface friendProps {
    selectedFriend: any;
    setSelectedFriend: React.Dispatch<any>;
}

export default function NavbarFriends({selectedFriend, setSelectedFriend}: friendProps) {

	//list friends and display friend profile modal on click
    const [ friends, setFriends ] = useState<any>(null);

    useEffect(() => {
        const getFriends = async () => {
          const allFriends = API.getFriendlist();

          return allFriends;
        };
    
        getFriends().then(friends => {
          setFriends(friends);

          console.log("NAV FRIENDS: ", friends);
        });
    
      }, []);

    const selectFriend = (friend: any) => {
        setSelectedFriend(friend);
    };

    const pendingUserClass = 'hover:bg-amber-600/20 h-10 min-h-[4rem] w-[96%] mx-1 bg-amber-400/20 border border-1 border-amber-200  mt-4 flex items-center justify-center text-white';
    const userClass = 'h-10 min-h-[4rem] w-[96%] mx-1 bg-white/20 border border-1 mt-4 flex items-center justify-center text-white';
    const selectedUserClass = 'h-10 w-[96%] mx-1 bg-white/40 border border-1 border-indigo-400 mt-4 flex items-center justify-center text-white'
    const findClass = 'h-10 min-h-[3rem] w-[96%] mx-1 bg-black/30 border border-1 mt-4 flex items-center justify-center text-white';


	return (
		<div className='newNavMain bg-black/10 flex flex-col overflow-auto'>
            <button key={-1}
                onClick={() => selectFriend(null)}
                className={findClass}
                >
                    Find Users
                </button>
            {friends && (friends.map((friend: any, index: string) => (
                <button key={index}
                onClick={() => selectFriend(friend)}
                className={friend.status === 'Pending' ? pendingUserClass : selectedFriend === friend ? selectedUserClass : userClass}
                >
                    {friend.player.pseudo}
                </button>
            )))}
		</div>
	)
}