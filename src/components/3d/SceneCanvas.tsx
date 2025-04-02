import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Person } from "@/components/3d/person/Person";

interface SceneCanvasProps {
  personTextureList: string[];
}

export default function SceneCanvas({ personTextureList }: SceneCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 40, 20], fov: 50 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight position={[30, 50, 10]} intensity={1} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>
      <OrbitControls
        enableRotate={true}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 3}
        target={[0, 0, 0]}
      />
      {personTextureList.map((url) => (
        <Person key={url} textureUrl={url} />
      ))}
    </Canvas>
  );
}
