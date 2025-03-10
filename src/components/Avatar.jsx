import React, { useEffect, useRef } from "react";
import { useGraph } from "@react-three/fiber";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";

export function Avatar({ animation, setAnimation, ...props }) {
  const { scene } = useGLTF("/models/avatar.glb");
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone);
  const group = useRef();

  // Load FBX animations
  const idleFBX = useFBX("/animations/Idle.fbx");
  const bowFBX = useFBX("/animations/Bow.fbx");
  const walkFBX = useFBX("/animations/StartWalk.fbx");

  useEffect(() => {
    if (idleFBX && bowFBX && walkFBX) {
      idleFBX.animations[0].name = "Idle";
      bowFBX.animations[0].name = "Bow";
      walkFBX.animations[0].name = "Walk";
    }
  }, [idleFBX, bowFBX, walkFBX]);

  const { actions, mixer } = useAnimations(
    [idleFBX.animations[0], bowFBX.animations[0], walkFBX.animations[0]],
    group
  );

  // Set Idle animation as default
  useEffect(() => {
    if (actions && actions["Idle"]) {
      actions["Idle"].reset().fadeIn(0.5).play();
    }
  }, [actions]);

  // Handle animation transitions
  useEffect(() => {
    if (!actions || !actions[animation]) return;

    // Fade out all other actions
    const newAction = playAnimation(animation);

    // Handle non-looping animations (e.g., Bow)
    if (animation !== "Idle") {
      newAction.setLoop(THREE.LoopOnce, 1);
      //newAction.clampWhenFinished = true;

      const onAnimationFinished = () => {
        playAnimation("Idle");
      };

      mixer.addEventListener("finished", onAnimationFinished);

      return () => {
        mixer.removeEventListener("finished", onAnimationFinished);
      };
    }
  }, [animation, actions, setAnimation, mixer]);

  const playAnimation = (animation) => {
    Object.values(actions).forEach((action) => {
      if (action.isRunning() && action !== actions[animation]) {
        action.fadeOut(0.5);
      }
    });

    // Fade in new action
    const newAction = actions[animation];
    newAction.reset().fadeIn(0.5).play();
    return newAction;
  };

  return (
    <group ref={group} {...props}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
    </group>
  );
}

useGLTF.preload("/models/avatar.glb");
