import { Environment, useTexture } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { useThree } from "@react-three/fiber";

export const Experience = ({ currentAnimation, setAnimation }) => {
  const texture = useTexture("/textures/bank-background.jpg");
  const viewport = useThree((state) => state.viewport);

  return (
    <>
      <Avatar
        position={[0, -3, 5]}
        scale={2}
        animation={currentAnimation}
        setAnimation={setAnimation}
      />
      <Environment preset="sunset" />
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
};
