// hooks/useUploadImage.ts
import { useState } from "react";
import { storage, ref, uploadBytes, getDownloadURL } from "./firebase";

export const useUploadImage = () => {
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [imageUrl, setImageUrl] = useState<string | null>(null); // 이미지 URL 관리
  const [error, setError] = useState<string | null>(null); // 에러 관리

  const uploadImage = async (file: File) => {
    setLoading(true);
    setError(null);

    const storageRef = ref(storage, `images/${file.name}`); // Firebase Storage 경로 설정

    try {
      // Firebase Storage에 파일 업로드
      await uploadBytes(storageRef, file);

      // 업로드된 파일의 다운로드 URL 얻기
      const downloadURL = await getDownloadURL(storageRef);
      setImageUrl(downloadURL); // 다운로드 URL 저장
    } catch (error) {
      setError("파일 업로드 실패");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { uploadImage, imageUrl, loading, error };
};
