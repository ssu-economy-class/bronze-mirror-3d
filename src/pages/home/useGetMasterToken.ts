import { client } from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { z } from "zod";

// masterToken 데이터 스키마
const MasterTokenSchema = z.object({
  masterToken: z.string(),
});

// 전체 응답 스키마
const TokenRespSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: MasterTokenSchema,
  success: z.boolean(),
});

// masterToken만 반환하도록 타입 수정
const postMasterToken = async (): Promise<string | null> => {
  try {
    const response = await client({
      method: "POST",
      url: `/api/auth/af/master-token`,
      data: {
        adminSecret: import.meta.env.VITE_SECRET_KEY,
      },
    });

    const parsed = TokenRespSchema.parse(response.data);
    return parsed.data.masterToken;
  } catch (error) {
    console.log("server error: ", error);
    return null;
  }
};

export const useGetMasterToken = () => {
  return useQuery<string | null, AxiosError>({
    queryKey: ["post-master-token"],
    queryFn: () => postMasterToken(),
  });
};
