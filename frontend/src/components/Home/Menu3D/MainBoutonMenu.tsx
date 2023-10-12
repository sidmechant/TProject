import { useActualRefMenu, useMeshState } from "../../ContextBoard";
import { Plane } from "@react-three/drei";
import { useNavigate } from "react-router-dom";

type Props = {
    setCursor: React.Dispatch<React.SetStateAction<string>>;
}

const MainBoutonMenu = (props: Props) => {
    const { meshRefs } = useMeshState();
    const navigate = useNavigate();
    const { AboutUS, ChatBox, Play, Profile } = meshRefs;
    const tabRef = [Play, AboutUS, ChatBox, Profile];
    const { actualRef } = useActualRefMenu();
    const tabRedirection = ['/lobby', '/about', '/chatbox', '/profile'];

    const handlePointerOver = () => {
        props.setCursor('pointer');
    };

    const handlePointerOut = () => {
        props.setCursor('default');
    };

    const handleClick = () => {
        tabRef.map((ref, index) => {
            if (ref === actualRef) {
                navigate(tabRedirection[index]);
            }
        })
    };
    return (
        <>
            <Plane
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onClick={handleClick}
                visible={false}
                args={[3.4, 1, 1]}
                position={[0, 0, 0]} />
        </>
    )
}

export default MainBoutonMenu