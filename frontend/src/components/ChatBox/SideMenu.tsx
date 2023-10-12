import { useState } from "react";
import styled, { keyframes } from "styled-components";
import SearchBar from "./SearchBar";
import FriendsMenu from "./FriendsMenu";

interface ColorsProps {
    $color?: string;
    $icon?: string;
}


const SideMenuContainer = styled.div<ColorsProps>`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0%;
    left: 0%;
    height: 100%;
    width: 150px;
    border-right: 1px solid #b88a34;
    background-color: ${props => props.$color};
    transition: background-color 0.5s ease-in-out;
    border: 2px solid #5E57B0;
`;

const SideMenuHeader = styled.div`
display: flex; // Déjà présent
  justify-content: flex-start; // aligner les éléments à gauche
  align-items: flex-end; // centre les éléments verticalement
  position: absolute;
  top: 0%;
  left: 0%;
  height: 10%;
  width: 100%;
  background-color: #e26e6e;
`;

const TabStyle = styled.div<ColorsProps>`
	width: 50px;
	bottom: 0%;
	height: 80%;
	background-color: ${props => props.$color};
	border: 2px solid #5E57B0;
	border-top-right-radius: 10px;
	border-top-left-radius: 10px;
	border-bottom: none;
    background-image: url(${props => props.$icon});
    background-size: 25px 25px; // Taille de l'image
    background-repeat: no-repeat; // Empêche l'image de se répéter
    background-position: center; // Centre l'image
`;

type tabType = 'chat' | 'channel' | 'notification';

type tabInfos = {
    color: string;
    icon: string;
};

type tabInfosTab = {
    [K in tabType]: tabInfos;
};

const myTabInfos: tabInfosTab = {
    chat: {
        color: '#DECB66',
        icon: '/UI/icons_chat/chat_icon.png',
    },
    channel: {
        color: '#4C97A8',
        icon: '/UI/icons_chat/channels_icon.png',
    },
    notification: {
        color: '#894CEB',
        icon: '/UI/icons_chat/notification_icon.png',
    },
};

const SideMenu = () => {
    const [tab, setTab] = useState<'chat' | 'channel' | 'notification'>('chat'); // Ajout d'un état pour savoir si on est sur le chat ou le menu

    return (
        <SideMenuContainer $color={myTabInfos[tab].color}>
            <SideMenuHeader >
                <TabStyle onClick={() => { setTab('chat') }} $color={myTabInfos['chat'].color} $icon={myTabInfos['chat'].icon} />
                <TabStyle onClick={() => { setTab('channel') }} $color={myTabInfos['channel'].color} $icon={myTabInfos['channel'].icon} />
                <TabStyle onClick={() => { setTab('notification') }} $color={myTabInfos['notification'].color} $icon={myTabInfos['notification'].icon} />
            </SideMenuHeader>
            {tab === 'chat' && <FriendsMenu />}
        </SideMenuContainer>
    )
}

export default SideMenu