import React, { createContext, useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";
import authService from "../services/auth";
import { UserProfile, LoginCredentials, RegisterData } from "../types/user";

type AuthContextValue = {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (creds: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isAuthenticated = !!user;

  const refreshUser = async () => {
    try {
      const { value: token } = await Preferences.get({
        key: "Palazzo.accessToken",
      });

      if (!token) {
        setUser(null);
        return;
      }

      const profile = await authService.me();
      setUser(profile);
    } catch (err) {
      console.warn("Could not refresh user", err);
      setUser(null);
    }
  };

  useEffect(() => {
    // On mount try to populate user from token
    (async () => {
      await refreshUser();
      setLoading(false);
    })();
  }, []);

  const login = async (creds: LoginCredentials) => {
    await authService.login(creds);
    // after login, fetch profile
    await refreshUser();
  };

  const register = async (data: RegisterData) => {
    await authService.register(data);
    // do not auto-login here; caller can redirect or call login
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
