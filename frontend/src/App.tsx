import './styles/App.css';
import { useLocation, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Home from './pages/Home';
import About from './pages/About';
import Profil from './pages/Profil';
import Game from './pages/Game';
import { ChatBoxContext } from './components/ContextBoard';
import { GlobalStyle } from './styles/HomeStyles';
import AnimatedPage from './components/AnimatedPage';
import { UserInfosContext } from './components/ContextBoard';
import Test from './pages/Test';
import Chat from './pages/Chat';
import { Connection } from './components/Connection';
import { ChakraProvider } from '@chakra-ui/react'
import NewChatBox from './components/modalChat/Chatbox';





// function useSocketAndMessages() {
//   const [socket, setSocket] = useState<Socket | undefined>();
//   const [messages, setMessages] = useState<string[]>([]);

//   socket?.emit("message", value);

//   return <div className='Chat'></div>
// }


function App() {
	const location = useLocation();
	const [isChatBoxOpen, setIsChatBoxOpen] = useState<boolean>(false);

	return (
		<ChakraProvider>
			<GlobalStyle />
			{/* <Connection> */}
				<ChatBoxContext.Provider value={{ isChatBoxOpen, setIsChatBoxOpen }}>
					<AnimatePresence mode="wait">
						<Routes location={location} key={location.pathname}>
							<Route index element={
								<Home />} />
							<Route path="/about" element={
								<AnimatedPage endColor="#df6b58">
									<About />
								</AnimatedPage>} />
							<Route path="/game" element={
								<Game />
							} />
							<Route path="/test" element={
								<Test />
							} />
							<Route path="/profile" element={
								<AnimatedPage endColor="#71ca71">
									<Profil />
								</AnimatedPage>} />
							<Route path="/chat" element={
								<AnimatedPage endColor="#71ca71">
									<Chat />
								</AnimatedPage>} />
						</Routes>
					</AnimatePresence>
				</ChatBoxContext.Provider>
			{/* </Connection> */}
			<NewChatBox />
		</ChakraProvider>
	)
}
export default App
