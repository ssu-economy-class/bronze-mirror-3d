import { useGLTF } from "@react-three/drei";

export default function Background() {
  const { scene } = useGLTF("/models/background.glb");

  return <primitive object={scene} scale={[10, 10, 10]} position={[0, 0, 0]} />;
}
