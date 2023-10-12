import styled from 'styled-components'
import { MenuItem } from './MenuItem';


const MenuStyle = styled.div`
    font-size: 5.5vw;

    display: flex;
    flex-direction: column;
    list-style: none;
    user-select: none;

    @media (max-width: 600px) {
        font-size: 2rem;
    }

    @media (min-width: 1800px) {
        font-size: 4rem;
    }
`

interface MenuItemProps {
    to: string;
    children: any;
    rotationValue: number;
}


export default function MenuHome(props: { items: MenuItemProps[] }) {
    
    return (
        <MenuStyle
       >
            {props.items.map((item, index) => {
                return (
                    <MenuItem key={index} to={item.to} rotationValue={item.rotationValue}>
                        {item.children}
                    </MenuItem>
                )
            })}
        </MenuStyle>
    );
}