import * as React from "react";
import instance from "@/config/axios.config";
import { useRouter } from "next/router";

const AuthContext = React.createContext<{
  user: AuthData | null;
  isLoading: boolean;
  setAuthData: React.Dispatch<React.SetStateAction<AuthData | null>>;
}>({
  user: null,
  isLoading: true,
  setAuthData: () => {},
});

function useAuth() {
  const [authData, setAuthData] = React.useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const initializeAuth = async () => {
      instance
        .get("/users/me?populate=role", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token") || "",
          },
        })
        .then((res) => {
          if (res.data) {
            setAuthData({
              fullname: res.data.fullname,
              email: res.data.email,
              id: res.data.id,
              role: res.data.role.name,
              designation: res.data.designation,
              phone: res.data.phone,
            });
          }
        })
        .catch((err) => {
          console.warn(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    initializeAuth();
  }, []);

  return { authData, isLoading, setAuthData };
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { authData, isLoading, setAuthData } = useAuth();
  return (
    <AuthContext.Provider value={{ user: authData, isLoading, setAuthData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
