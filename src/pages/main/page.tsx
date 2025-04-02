import { useUploadImage } from "@/api/useUploadImage";
import { useGetImage } from "@/api/useGetImage"; // 🔥 추가!
import SceneCanvas from "@/components/3d/SceneCanvas";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

export default function MainPage() {
  const { uploadImage, loading, error } = useUploadImage();
  const textureUrl = useGetImage();
  const [personList, setPersonList] = useState<string[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  useEffect(() => {
    if (!textureUrl) return;
    setPersonList((prev) => {
      if (prev.includes(textureUrl)) return prev;
      const updated = [...prev, textureUrl];
      if (updated.length > 10) updated.shift();
      return updated;
    });
  }, [textureUrl]);

  console.log(textureUrl);

  return (
    <div className="relative w-full h-screen">
      <SceneCanvas personTextureList={personList} />
      <div className="absolute top-4 left-4 z-10">
        <Input
          className="cursor-pointer"
          type="file"
          onChange={handleImageUpload}
          disabled={loading}
          accept="image/*"
        />
        {loading && <p>업로드 중...</p>}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
