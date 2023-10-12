import { ModeType } from '../../../types/machine';
import MenuButton from './SelectModeMenuButton'
import styled from 'styled-components';


type ButtonProps = {
    $backgroundColor: string;
    label: string;
    modeValue: ModeType;
};

const MenuContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
`;

const Title = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 468px;
    height: 76px;
    margin: 10px;
    margin-top: 50px;
    font-family: "Yoster";
    font-size: 18px;
    font-weight: bold;
    text-shadow: -2px -2px 0 #000,
    2px -2px 0 #000,
    -2px 2px 0 #000,
    2px 2px 0 #000;
    color: #99c0ce;
    `
const Button: ButtonProps[] = [
    {
        $backgroundColor: '#165C5D',
        label: 'ONLINE MATCHMAKING',
        modeValue: ModeType.MATCHMAKING,
    },
    {
        $backgroundColor: '#215B33',
        label: 'ONLINE FRIENDS MATCH',
        modeValue: ModeType.ONLINEPLAYER,
    },
    {
        $backgroundColor: '#882178',
        label: 'LOCAL SPLITSCREEN MATCH',
        modeValue: ModeType.LOCALPLAYER,
    },
    {
        $backgroundColor: '#CD5050',
        label: 'LOCAL VS IA MATCH',
        modeValue: ModeType.IA,
    },
];

const SelectModeSubMenu = () => {
    return (
        <>
            <MenuContainer >
                <Title>
                    <h1>SELECT MODE</h1>
                </Title>
                {Button.map((button, index) => (
                    <MenuButton
                        key={index}
                        label={button.label}
                        modeValue={button.modeValue}
                        $backgroundColor={button.$backgroundColor}
                    />
                ))}
            </MenuContainer>
        </>
    );
};

export default SelectModeSubMenu;