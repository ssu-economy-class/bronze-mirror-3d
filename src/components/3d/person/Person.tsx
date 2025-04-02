import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

interface PersonProps {
  textureUrl: string | null; // 텍스처 URL을 받아옵니다.
}

export function Person({ textureUrl }: PersonProps) {
  const rootRef = useRef<THREE.Group>(null!);
  const modelRef = useRef<THREE.Group>(null!);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  const gltf = useGLTF("/models/walking.glb");

  const angleRef = useRef(Math.random() * Math.PI * 2);
  const speed = 0.05;
  const LIMIT = 15;

  const getDirection = (angle: number) =>
    new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle)).normalize();

  // GLTF clone
  const cloned = useMemo(() => clone(gltf.scene), [gltf.scene]);

  // 텍스처 적용 (Beta_Surface.001에만 적용)
  useEffect(() => {
    if (!textureUrl) return; // textureUrl이 없으면 리턴

    cloned.traverse((obj: THREE.Object3D) => {
      if ((obj as THREE.SkinnedMesh).isSkinnedMesh) {
        const mesh = obj as THREE.SkinnedMesh;
        if (obj.name === "Beta_Surface001") {
          const material = new THREE.MeshStandardMaterial({
            map: new THREE.TextureLoader().load(textureUrl),
          });
          (
            material as THREE.MeshStandardMaterial & { skinning: boolean }
          ).skinning = true;
          mesh.material = material;
        }
      }
    });
  }, [cloned, textureUrl]);

  // 애니메이션 설정
  useEffect(() => {
    if (!modelRef.current) return;

    const mixer = new THREE.AnimationMixer(modelRef.current);
    mixerRef.current = mixer;

    const clip = gltf.animations[1]; // 제자리 걷기 애니메이션
    const action = mixer.clipAction(clip);
    action.loop = THREE.LoopRepeat;
    action.play();

    return () => {
      mixer.stopAllAction();
    };
  }, [gltf.animations]);

  // 이동 + 애니메이션 업데이트
  useFrame((_, delta) => {
    if (!rootRef.current || !mixerRef.current) return;

    const dir = getDirection(angleRef.current);
    const currentPosition = rootRef.current.position.clone();
    const targetX = currentPosition.x + dir.x * speed;
    const targetZ = currentPosition.z + dir.z * speed;

    const newPosX = THREE.MathUtils.clamp(targetX, -LIMIT, LIMIT);
    const newPosZ = THREE.MathUtils.clamp(targetZ, -LIMIT, LIMIT);

    if (newPosX !== targetX || newPosZ !== targetZ) {
      angleRef.current = Math.random() * Math.PI * 2;
    }

    rootRef.current.position.set(newPosX, currentPosition.y, newPosZ);
    rootRef.current.rotation.y = angleRef.current;

    mixerRef.current.update(delta);
  });

  return (
    <group ref={rootRef} scale={2}>
      <primitive ref={modelRef} object={cloned} />
    </group>
  );
}
