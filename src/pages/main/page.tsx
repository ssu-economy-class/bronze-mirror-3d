import { useEffect, useRef, useState } from "react";
import { useSpawnedImagesStore } from "@/stores/useSpawnedImagesStore";
import SceneCanvas from "@/components/3d/SceneCanvas";
import { useRecentImageUrls } from "@/pages/main/useImagePolling";

const audioPaths = ["/assets/audio/ai_audio.mp3"];

export default function MainPage() {
  const { data: recentUrls = [] } = useRecentImageUrls();
  const { spawnedUrls, addSpawnedUrls } = useSpawnedImagesStore();

  const [activeUrls, setActiveUrls] = useState<string[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioIndexRef = useRef(0);

  // ✅ 이미지 관련 로직
  useEffect(() => {
    const newUrls = recentUrls.filter((url) => !spawnedUrls.includes(url));
    if (newUrls.length > 0) {
      addSpawnedUrls(newUrls);
      setActiveUrls((prev) => [...prev, ...newUrls]);
    }
  }, [recentUrls, spawnedUrls, addSpawnedUrls]);

  // ✅ 음악 자동 재생 및 반복 처리
  useEffect(() => {
    const playNext = () => {
      audioIndexRef.current = (audioIndexRef.current + 1) % audioPaths.length;
      const nextAudio = new Audio(audioPaths[audioIndexRef.current]);
      audioRef.current = nextAudio;
      nextAudio.volume = 0.5; // 볼륨 조절 (0~1)
      nextAudio.play();
      nextAudio.addEventListener("ended", playNext);
    };

    // 첫 번째 오디오 시작
    const firstAudio = new Audio(audioPaths[0]);
    audioRef.current = firstAudio;
    firstAudio.volume = 0.5;
    firstAudio.play();
    firstAudio.addEventListener("ended", playNext);

    return () => {
      audioRef.current?.pause();
      audioRef.current?.removeEventListener("ended", playNext);
    };
  }, []);

  return (
    <div className="relative w-full h-screen">
      <SceneCanvas personTextureList={activeUrls} />
    </div>
  );
}
