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

  // FBX 애니메이션 로드
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
    idleFBX.animations[0] && bowFBX.animations[0] && walkFBX.animations[0]
      ? [idleFBX.animations[0], bowFBX.animations[0], walkFBX.animations[0]]
      : idleFBX.animations[0],
    group
  );

  useEffect(() => {
    if (actions) {
      // 현재 실행 중인 애니메이션 찾기
      const currentAction = Object.values(actions).find((action) =>
        action.isRunning()
      );

      // crossFadeTo()로 자연스럽게 전환
      if (currentAction && currentAction !== actions[animation]) {
        currentAction.crossFadeTo(actions[animation], 0.5, false);
      }

      // 현재 애니메이션 실행
      if (actions[animation]) {
        console.log("dfdf");
        actions[animation].play(); // reset() 제거하여 기존 애니메이션 흐름 유지

        // 애니메이션 종료 후 Idle로 전환
        if (animation !== "Idle") {
          actions[animation].setLoop(THREE.LoopOnce, 1);
          actions[animation].clampWhenFinished = true;

          mixer.addEventListener("finished", () => {
            setAnimation("Idle"); // 애니메이션 종료 후 Idle로 복귀
          });
        } else {
          actions["Idle"].setLoop(THREE.LoopRepeat);
        }
      }
    } else {
      console.log("yeah?");
      setAnimation("Idle");
      actions["Idle"].setLoop(THREE.LoopRepeat);
    }
  }, [animation, actions, setAnimation, mixer]);

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
