// hooks/useGetImage.ts
import { useEffect, useState } from "react";
import { storage, ref, listAll, getDownloadURL } from "./firebase";

// 가장 최근 업로드된 이미지 하나 가져오기
export const useGetImage = (): string | null => {
  const [latestUrl, setLatestUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestImage = async () => {
      try {
        const folderRef = ref(storage, "images");
        const res = await listAll(folderRef);

        // 이름 기준 정렬 (파일명을 timestamp로 저장했다고 가정)
        const sorted = res.items.sort((a, b) => b.name.localeCompare(a.name));
        const latestItem = sorted[0];

        if (!latestItem) return;

        const url = await getDownloadURL(latestItem);

        // 중복 방지: 새로운 URL만 반영
        setLatestUrl((prev) => (prev !== url ? url : prev));
      } catch (err) {
        console.error("가장 최근 이미지 가져오기 실패", err);
      }
    };

    fetchLatestImage();

    const interval = setInterval(fetchLatestImage, 3000); // 3초마다 체크
    return () => clearInterval(interval);
  }, []);

  return latestUrl;
};
