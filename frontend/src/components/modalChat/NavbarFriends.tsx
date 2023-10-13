import './Chatbox.css';
import * as API from '../Profil/FetchApi.tsx';
import { useEffect, useState } from 'react';

export default function NavbarFriends() {

	//list friends and display friend profile modal on click
    const [ friends, setFriends ] = useState<any>(null);

    useEffect(() => {

        const fetchedFriends = API.getPlayerDataFriends();
        setFriends(fetchedFriends);
    });

    useEffect(() => {

        console.log("FRIENDS = ", friends);
    }, [friends]);

    const handleCreateFriendship = () => {

    };

	return (
		<div className='newNavMain bg-black/10 flex flex-col items-center'>
			<button
		        onClick={() => handleCreateFriendship()}
                className='h-10 w-[96%] bg-white/20 border border-1 my-5 flex items-center 
                justify-center break-all text-ellipsis overflow-hidden text-white'
            >
                        Add friend
		    </button>
		</div>
	)
}