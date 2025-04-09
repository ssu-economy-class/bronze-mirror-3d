import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Mirror } from "@/components/3d/Mirror";
import Background from "@/components/3d/Background";

interface SceneCanvasProps {
  personTextureList: string[];
}

export default function SceneCanvas({ personTextureList }: SceneCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 60, 40], fov: 50 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[30, 50, 10]} intensity={1} />

      <Environment background files="/models/sky.hdr" />

      <Background />

      <OrbitControls
        enableRotate={true}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 3}
        target={[0, 0, 0]}
      />

      {personTextureList.map((url, index) => (
        <Mirror key={index} textureUrl={url} />
      ))}
    </Canvas>
  );
}
