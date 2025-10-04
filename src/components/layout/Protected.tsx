import AuthContext from "@/context/AuthContext";
import { useContext } from "react";
import Loading from "../atoms/loading";
import { useRouter } from "next/router";

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useContext(AuthContext);
  const router = useRouter();

  if (isLoading) return <Loading />;
  else if (!user) {
    router.replace("/auth/login");
    return <Loading />;
  }
  return <>{children}</>;
}
