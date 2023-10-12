import { useMeshState } from '../../ContextBoard';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

type Props = {
    menu_obj: React.RefObject<THREE.Mesh>[];
    size_obj: number[];
};

export function SceneIntroAnimation({ menu_obj, size_obj }: Props) {
    const { meshRefs } = useMeshState();
    const lengthAnimation: number = 1.5;

    useEffect(() => {
        gsap.registerPlugin(CustomEase);
        if (meshRefs && meshRefs.group_menu.current) {
            const group = meshRefs.group_menu.current;
            group.scale.set(0, 0, 0);
            gsap.to(group.scale, {
                duration: 2.3,
                x: 1,
                y: 1,
                z: 1,
                ease: CustomEase.create("custom", "M0,0 C0,0 0.014,0.136 0.021,0.226 0.04,0.48 0.046,0.612 0.065,0.867 0.072,0.966 0.075,1.017 0.085,1.115 0.091,1.186 0.096,1.224 0.106,1.293 0.109,1.314 0.112,1.327 0.118,1.346 0.121,1.356 0.125,1.364 0.13,1.371 0.131,1.372 0.135,1.373 0.136,1.372 0.139,1.371 0.143,1.366 0.145,1.362 0.152,1.346 0.157,1.334 0.161,1.316 0.185,1.207 0.194,1.143 0.218,1.03 0.225,0.995 0.23,0.975 0.24,0.941 0.245,0.922 0.25,0.91 0.258,0.892 0.261,0.886 0.264,0.882 0.268,0.877 0.271,0.874 0.273,0.87 0.277,0.869 0.281,0.868 0.288,0.868 0.292,0.869 0.298,0.872 0.303,0.876 0.307,0.882 0.336,0.928 0.353,0.965 0.383,1.012 0.389,1.022 0.396,1.028 0.405,1.035 0.412,1.04 0.419,1.043 0.428,1.046 0.433,1.047 0.437,1.046 0.443,1.045 0.448,1.044 0.453,1.043 0.458,1.041 0.486,1.025 0.503,1.012 0.531,0.996 0.539,0.992 0.545,0.99 0.554,0.987 0.562,0.985 0.568,0.984 0.576,0.983 0.587,0.983 0.595,0.983 0.606,0.985 0.636,0.99 0.653,0.996 0.683,1.001 0.698,1.004 0.708,1.005 0.723,1.005 0.779,1.004 0.812,0.999 0.87,0.998 0.92,0.997 1,1 1,1 "),
            });
        }
        if (menu_obj) {
            menu_obj.forEach((obj, index) => {
                if (obj.current) {
                    obj.current.scale.set(0, 0, 0);
                }
                gsap.to(obj.current!.scale, {
                    delay: 1 + index/2,
                    duration: lengthAnimation + index * 0.9,
                    x: size_obj[index],
                    y: size_obj[index],
                    z: size_obj[index],
                    ease: CustomEase.create("custom", "M0,0 C0,0 0.014,0.136 0.021,0.226 0.04,0.48 0.046,0.612 0.065,0.867 0.072,0.966 0.075,1.017 0.085,1.115 0.091,1.186 0.096,1.224 0.106,1.293 0.109,1.314 0.112,1.327 0.118,1.346 0.121,1.356 0.125,1.364 0.13,1.371 0.131,1.372 0.135,1.373 0.136,1.372 0.139,1.371 0.143,1.366 0.145,1.362 0.152,1.346 0.157,1.334 0.161,1.316 0.185,1.207 0.194,1.143 0.218,1.03 0.225,0.995 0.23,0.975 0.24,0.941 0.245,0.922 0.25,0.91 0.258,0.892 0.261,0.886 0.264,0.882 0.268,0.877 0.271,0.874 0.273,0.87 0.277,0.869 0.281,0.868 0.288,0.868 0.292,0.869 0.298,0.872 0.303,0.876 0.307,0.882 0.336,0.928 0.353,0.965 0.383,1.012 0.389,1.022 0.396,1.028 0.405,1.035 0.412,1.04 0.419,1.043 0.428,1.046 0.433,1.047 0.437,1.046 0.443,1.045 0.448,1.044 0.453,1.043 0.458,1.041 0.486,1.025 0.503,1.012 0.531,0.996 0.539,0.992 0.545,0.99 0.554,0.987 0.562,0.985 0.568,0.984 0.576,0.983 0.587,0.983 0.595,0.983 0.606,0.985 0.636,0.99 0.653,0.996 0.683,1.001 0.698,1.004 0.708,1.005 0.723,1.005 0.779,1.004 0.812,0.999 0.87,0.998 0.92,0.997 1,1 1,1 "),
                });
            });
        }
    }, [meshRefs.group_menu]);

    return <></>;
}

export default SceneIntroAnimation;