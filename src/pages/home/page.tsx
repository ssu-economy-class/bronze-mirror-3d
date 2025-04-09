import { Button } from "@/components/ui/button";
import { useGetMasterToken } from "@/pages/home/useGetMasterToken";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const { data, isLoading, isError } = useGetMasterToken();
  const navigate = useNavigate();

  if (isLoading) {
    return <></>;
  }

  if (isError) {
    return <></>;
  }

  localStorage.setItem("accessToken", data!);

  return (
    <main>
      <section className="w-screen h-screen flex items-center justify-center">
        <Button
          onClick={() => {
            navigate("/main");
          }}
        >
          청동거울 세상으로!
        </Button>
      </section>
    </main>
  );
}
