import { client } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { AxiosError } from "axios";

const ImageItemSchema = z.object({
  id: z.number(),
  url: z.string(),
  profileImage: z.string(),
  nickname: z.string(),
  date: z.string(),
});

const ImagePagedResponseSchema = z.object({
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

export type ImageItem = z.infer<typeof ImageItemSchema>;

const fetchAllPagedImages = async (): Promise<ImageItem[]> => {
  const response = await client({
    method: "GET",
    url: "/api/image/all-paged?page=0&size=10",
  });

  const parsed = ImagePagedResponseSchema.parse(response.data);
  return parsed.data.content;
};

export const useAllPagedImages = () => {
  return useQuery<ImageItem[], AxiosError>({
    queryKey: ["all-paged-images"],
    queryFn: fetchAllPagedImages,
    staleTime: 1000 * 60 * 5,
  });
};
