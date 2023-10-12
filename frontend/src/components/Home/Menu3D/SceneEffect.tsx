import { EffectComposer, Outline } from '@react-three/postprocessing';
import { useThree } from "@react-three/fiber";


const SceneEffect = () => {
    const { size } = useThree();
    
    return (
        <EffectComposer multisampling={8} autoClear={false}>
            <Outline
                blur
                visibleEdgeColor={0xff6666} 
                hiddenEdgeColor={0x008000}
                edgeStrength={100}
                pulseSpeed={1.0}
                xRay={false}
                width={size.width / 1}
                height={size.height / 1}
            />
        </EffectComposer>
    )
}

export default SceneEffect
