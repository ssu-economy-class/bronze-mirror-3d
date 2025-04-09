import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils";

interface MirrorProps {
  textureUrl: string | null;
}

export function Mirror({ textureUrl }: MirrorProps) {
  const rootRef = useRef<THREE.Group>(null!);
  const modelRef = useRef<THREE.Group>(null!);
  const gltf = useGLTF("/models/bronze-mirror.glb");

  const angleRef = useRef(Math.random() * Math.PI * 2);
  const speed = 0.2;
  const LIMIT = 100;

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const down = new THREE.Vector3(0, -1, 0);

  const cloned = useMemo(() => {
    if (!gltf.scene) return null;
    return clone(gltf.scene);
  }, [gltf.scene]);

  useEffect(() => {
    if (!textureUrl || !cloned) return;

    const texture = new THREE.TextureLoader().load(textureUrl);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false;

    cloned.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh && obj.name === "마크") {
        const mesh = obj as THREE.Mesh;

        const frontMesh = mesh.clone();
        frontMesh.material = new THREE.MeshStandardMaterial({
          map: texture,
          metalness: 0.5,
          roughness: 0.7,
          transparent: true,
          side: THREE.FrontSide,
        });

        const backMesh = mesh.clone();
        backMesh.material = new THREE.MeshStandardMaterial({
          color: "#b87333",
          metalness: 0.7,
          roughness: 0.3,
          side: THREE.BackSide,
        });

        const parent = mesh.parent!;
        parent.remove(mesh);
        parent.add(frontMesh);
        parent.add(backMesh);
      }
    });
  }, [cloned, textureUrl]);

  useEffect(() => {
    // ✅ 초기 위치 지형 안 겹치게 설정
    if (rootRef.current) {
      rootRef.current.position.set(
        Math.random() * 60 - 30,
        10,
        Math.random() * 60 - 30
      );
    }
  }, []);

  useFrame(({ scene }) => {
    if (!rootRef.current) return;

    const dir = new THREE.Vector3(
      Math.sin(angleRef.current),
      0,
      Math.cos(angleRef.current)
    ).normalize();

    const cur = rootRef.current.position.clone();
    const nextX = cur.x + dir.x * speed;
    const nextZ = cur.z + dir.z * speed;
    const newX = THREE.MathUtils.clamp(nextX, -LIMIT, LIMIT);
    const newZ = THREE.MathUtils.clamp(nextZ, -LIMIT, LIMIT);

    if (newX !== nextX || newZ !== nextZ) {
      angleRef.current = Math.random() * Math.PI * 2;
    }

    // ✅ 지형 높이 계산 (raycast)
    const origin = new THREE.Vector3(newX, 50, newZ); // 위에서 쏨
    raycaster.set(origin, down);
    const intersects = raycaster.intersectObjects(scene.children, true);

    let newY = 1.5;
    if (intersects.length > 0) {
      newY = intersects[0].point.y + 5;
    }

    rootRef.current.position.set(newX, newY, newZ);
    rootRef.current.rotation.y = angleRef.current;
  });

  if (!cloned) return null;

  return (
    <group ref={rootRef} scale={3}>
      <primitive ref={modelRef} object={cloned} />
    </group>
  );
}
