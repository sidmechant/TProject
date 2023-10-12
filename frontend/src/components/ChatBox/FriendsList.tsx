import { FriendsListType } from '../../types/Ux';

type Props = {
    list: FriendsListType[] | undefined;
}

const FriendsList: React.FC<Props> = ({ list }) => {
    return (
        <>
            {list ? (
                list.map((friend: FriendsListType) => (  // Spécifiez le type ici
                    <div key={friend.name}>
                        <img src={friend.url} alt="friend" />
                        <p>{friend.name}</p>
                    </div>
                ))
            ) : (
                <></>
            )}
        </>
    );
}


export default FriendsList