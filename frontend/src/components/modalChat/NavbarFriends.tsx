import './Chatbox.css';
import * as API from '../Profil/FetchApi.tsx';


function CreateFriendship() {

	const handleCreateFriendship = () => {
		//create conv modal display on ChatMain
		console.log('handleCreateConv');
	}

	return (
		<button
		onClick={() => handleCreateFriendship()}
		className='h-10 w-[96%] bg-white/20 border border-1 my-5 flex items-center 
		justify-center break-all text-ellipsis overflow-hidden text-white'>
				Add friend
		</button>
	)
}

export default function NavbarFriends() {

	//list friends and display friend profile modal on click
	return (
		<div className='newNavMain bg-black/10 flex flex-col items-center'>
			<CreateFriendship />
		</div>
	)
}