import './Chatbox.css';
import { motion } from "framer-motion"
import { Input } from "@chakra-ui/react";
import { useState } from 'react';
import { AiOutlineSend } from 'react-icons/ai';


export default function MainChat() {

    const [ value, setValue ] = useState<string>('');
    const [ inputFocus, setInputFocus ] = useState<boolean>(false);

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

    return (
        <>
        <div className="bg-slate-500/30 MainChat"></div>
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
    );
}