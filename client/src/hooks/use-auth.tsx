import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User as SelectUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type BanInfo = {
  type: "permanent" | "temporary";
  reason: string;
  banUntil?: string;
};

type AuthContextType = {
  user: SelectUser | null;
  isLoading: boolean;
  error: Error | null;
  isBanned: boolean;
  banInfo: BanInfo | null;
  loginMutation: UseMutationResult<SelectUser, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<SelectUser, Error, RegisterData>;
};

type LoginData = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  password: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

// Helper function to parse ban error from API response
function parseBanError(error: Error): BanInfo | null {
  const message = error.message;

  // Check if it's a 403 ban error
  if (message.includes("403:")) {
    try {
      const responseText = message.substring(4); // Remove "403: " prefix
      const response = JSON.parse(responseText);

      if (response.error === "Account banned") {
        return {
          type: "permanent",
          reason: response.reason || "No reason provided",
        };
      } else if (response.error === "Account temporarily banned") {
        return {
          type: "temporary",
          reason: response.reason || "Temporary ban",
          banUntil: response.banUntil,
        };
      }
    } catch (e) {
      // If JSON parsing fails, check for simple ban messages
      if (message.includes("Account banned") || message.includes("banned")) {
        return {
          type: "permanent",
          reason: "Account banned",
        };
      } else if (
        message.includes("temporarily banned") ||
        message.includes("temp")
      ) {
        return {
          type: "temporary",
          reason: "Account temporarily banned",
        };
      }
    }
  }

  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [banInfo, setBanInfo] = useState<BanInfo | null>(null);
  const [isBanned, setIsBanned] = useState(false);

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<SelectUser | undefined, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  // Check for ban errors when the error changes
  useEffect(() => {
    if (error) {
      const banInfoFromError = parseBanError(error);
      if (banInfoFromError) {
        setBanInfo(banInfoFromError);
        setIsBanned(true);
      } else {
        setBanInfo(null);
        setIsBanned(false);
      }
    } else {
      setBanInfo(null);
      setIsBanned(false);
    }
  }, [error]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.username} 🎉`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      const res = await apiRequest("POST", "/api/register", credentials);
      return await res.json();
    },
    onSuccess: (user: SelectUser) => {
      queryClient.setQueryData(["/api/user"], user);
      toast({
        title: "Welcome to Funny Economy!",
        description: `Account created for ${user.username}! Enjoy your 500 welcome coins! 💰`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "See you later!",
        description: "Successfully logged out 👋",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        isBanned,
        banInfo,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
