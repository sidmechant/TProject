import styled from 'styled-components'
import SearchBar from './SearchBar'
import { useState } from 'react';
import { FriendsListType } from '../../types/Ux';
import FriendsList from './FriendsList';

const ContainerFriends = styled.div`
    display: flex; // Déjà présent
    position: absolute;
    align-items: flex-start;
    flex-direction: column;
    width: 100%;
    height: 86%;
    top: 14%;
`;

const friendsListDB = [
    {
        name: "CLOUCLOU",
        status: "online",
        url: "https://randomuser.me/api/portraits/women/69.jpg",
    },
    {
        name: "ZOUMZOUM",
        status: "offline",
        url: "https://randomuser.me/api/portraits/women/26.jpg",
    },
    {
        name: "GOUMGOUM",
        status: "online",
        url: "https://randomuser.me/api/portraits/men/26.jpg"
    }
]

const FriendsMenu = () => {
    const [friendsList, setFriendsList] = useState<FriendsListType[] | undefined>(undefined);

    return (
        <ContainerFriends>
            <SearchBar listToLookIn={friendsListDB} func={setFriendsList} list={friendsList}/>
            <FriendsList list={friendsList}/>
        </ContainerFriends>
    )
}

export default FriendsMenu