import './Chatbox.css';

function CreateConversation() {

	const handleCreateConversation = () => {
		//create conv modal display on ChatMain
		console.log('handleCreateConv');
	}

	return (
		<button
		onClick={() => handleCreateConversation()}
		className='h-10 w-[96%] bg-white/20 border border-1 my-5 flex items-center 
		justify-center break-all text-ellipsis overflow-hidden text-white'>
				Create
		</button>
	)
}


export default function NavbarChat() {

	//list all conversation and display on ChatMain on click

	return (
		<div className='newNavMain bg-black/10 flex flex-col items-center'>
			<CreateConversation />
		</div>
	)
}