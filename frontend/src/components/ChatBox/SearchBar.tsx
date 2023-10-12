import React, { useState } from 'react';
import styled from 'styled-components';
import { FriendsListType } from '../../types/Ux';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const InputField = styled.input`
  max-width: 115px;
  margin-left: 5px;
`;

const SubmitButton = styled.button`
  margin-left: 5px;
`;

interface props {
    listToLookIn: FriendsListType[]; //ici la liste a fetch
    func: (list: FriendsListType[] | undefined) => void;
    list: FriendsListType[] | undefined;
}

const SearchBar = ({ listToLookIn, func, list }: props) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [error, setError] = useState<boolean>(false);

    const handleSubmit = () => {
        let newList: FriendsListType[] = list ? [...list] : []; //!!
        let userFound = false;

        listToLookIn.forEach((friend) => {
            if (friend.name === inputValue) {
                newList = newList.concat(friend);
                userFound = true;
            }
        });

        if (!userFound) {
            setError(true);
        } else {
            setError(false);
        }
        func(newList);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length <= 15) {
            setInputValue(value);
        }
    };

    return (
        <Container>
            <InputField
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="Search for a user..."
            />
            <SubmitButton onClick={handleSubmit}>
                {"->"}
            </SubmitButton>
            {error && <p>error</p>}
        </Container>
    );
};

export default SearchBar;
