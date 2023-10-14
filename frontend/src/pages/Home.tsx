import { useEffect, useState } from 'react';
import transition from '../components/Transition';
import styled from 'styled-components';
import HomeScene from '../components/Home/Menu3D/HomeScene';
import HomeLoading from './loadingPages/HomeLoading';
import MenuHome from '../components/Home/Menu2D/MenuHome';
import { LoadingContext, MeshProvider, RotationProvider } from '../components/ContextBoard';
import { ChatBox } from '../components/ChatBox';
import * as API from '../components/modalChat/FetchAPiChat';

const Container = styled.div`
	display: grid;
	grid-template-columns: 1fr minmax(0, 500px) minmax(0, 1000px) 1fr;
	grid-template-rows: 1fr 2fr;
	overflow-x: hidden;
	overflow-y: hidden;
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	z-index: 0;
`
const TitleContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: left;
	grid-column: 2 / 3;
	grid-row: 1 / 2;
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
`

const Title = styled.img`
	transform: translate(-10%, -10%);
	width: 65%;
	font-size: 3rem;
	color: #b36b89;
`

const MenuContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: left;
	grid-column: 2 / 3;
	grid-row: 2 / 3;
	width: 100%;
	height: 100%;
	transform: rotate(-5deg);
	margin-left: 30%;
	padding: 0;
`

const items = [
  { to: '/game', children: 'Let\'s Play', rotationValue: 1.245 },
  { to: '/profile', children: 'Profile', rotationValue: 5.95 },
  { to: '/chatbox', children: 'Chatbox', rotationValue: 4.39 },
  { to: '/about', children: 'About US', rotationValue: 2.837 },
]
const ChargingTime = 10;
const intervalTime = 10;

const Home = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {

    const getMyUser = async () => {
      const me = await API.fetcher('/players');

      return me;
    }

      getMyUser().then((response: any) => {
        console.log(response.player);
        localStorage.setItem('player', JSON.stringify(response.player));
      });
  })

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const currentelapsedTime = Date.now() - startTime;
      setElapsedTime(prevTime => (prevTime + (intervalTime / (ChargingTime / 100))));
      if (currentelapsedTime >= ChargingTime) {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, intervalTime);

    return () => {
      clearInterval(interval);
      console.log('Component will unmount');
    }
  }, []);

  if (isLoading) {
    return (
      <LoadingContext.Provider value={elapsedTime.toFixed()}>
        <HomeLoading>
        </HomeLoading>
      </LoadingContext.Provider>
    )
  }

  return (
    <>
    <ChatBox />
    </>
  )
  
  return (

    <MeshProvider>
      <RotationProvider>
        <Container
          draggable={false}
          onDragStart={(e) => e.preventDefault()}>
          <TitleContainer>
            <Title src="/images/CrossPongLogo.png" alt="Cross Pong Logo" />
          </TitleContainer>
          <MenuContainer>
            <MenuHome items={items} />
          </MenuContainer>
          <HomeScene />
        </Container>
        <ChatBox />
      </RotationProvider>
    </MeshProvider>
  )
}


export default transition(Home);