import { useEffect, useState } from "react";
import { useSpawnedImagesStore } from "@/stores/useSpawnedImagesStore";
import SceneCanvas from "@/components/3d/SceneCanvas";
import { useRecentImageUrls } from "@/pages/main/useImagePolling";

export default function MainPage() {
  const { data: recentUrls = [] } = useRecentImageUrls();
  const { spawnedUrls, addSpawnedUrls } = useSpawnedImagesStore();

  const [activeUrls, setActiveUrls] = useState<string[]>([]);

  // ✅ 콘솔 로그로 확인
  useEffect(() => {
    console.log("[recentUrls]", recentUrls);
  }, [recentUrls]);

  useEffect(() => {
    const newUrls = recentUrls.filter((url) => !spawnedUrls.includes(url));

    if (newUrls.length > 0) {
      console.log("[newUrls]", newUrls);
      addSpawnedUrls(newUrls);
      setActiveUrls((prev) => [...prev, ...newUrls]);
    }
  }, [recentUrls, spawnedUrls, addSpawnedUrls]);

  return (
    <div className="relative w-full h-screen">
      <SceneCanvas personTextureList={activeUrls} />
    </div>
  );
}
