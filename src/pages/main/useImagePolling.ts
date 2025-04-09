import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { clientAuth } from "@/api/client";

// 🧩 Zod 스키마 정의
const ImageItemSchema = z.object({
  id: z.number(),
  url: z.string(),
  profileImage: z.string(),
  nickname: z.string(),
  date: z.string(),
});

const ImageListResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.object({
    content: z.array(ImageItemSchema),
    page: z.number(),
    size: z.number(),
    totalElements: z.number(),
    totalPages: z.number(),
    last: z.boolean(),
  }),
  success: z.boolean(),
});

export const useRecentImageUrls = () => {
  return useQuery<string[]>({
    queryKey: ["recent-image-urls"],
    queryFn: async () => {
      const response = await clientAuth({
        method: "GET",
        url: "/api/image/all-paged?page=0&size=10",
      });

      const parsed = ImageListResponseSchema.parse(response.data);
      const content = parsed.data.content;

      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

      const filtered = content.filter(
        (item) => new Date(item.date) >= twoHoursAgo
      );

      const urls = filtered.map((item) => item.url);

      console.log("[recentUrls]", urls); // ✅ 콘솔 찍어보자

      return urls;
    },
    refetchInterval: 30_000, // 30초 polling
  });
};
