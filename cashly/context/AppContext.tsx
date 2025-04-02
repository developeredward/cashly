import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "../constants/urls";

interface AuthContextProps {
  authState?: {
    token: string | null;
    user: { name: string; email: string } | null;
    authenticated: Boolean;
    loading: Boolean;
  };
  login?: (email: string, password: string) => Promise<any>;
  register?: (name: string, email: string, password: string) => Promise<any>;
  getProfile?: () => Promise<any>;
  logout?: () => Promise<any>;
}

export const API_URL = BASE_URL;

const AuthContext = createContext<AuthContextProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    user: { name: string; email: string } | null;
    authenticated: Boolean;
    loading: Boolean;
  }>({
    token: null,
    user: null,
    authenticated: false,
    loading: true,
  });

  useEffect(() => {
    const checkAuthenticated = async () => {
      setAuthState({ ...authState, loading: true });
      const token = await SecureStore.getItemAsync("token");
      const user = await SecureStore.getItemAsync("user");
      console.log("stored token::" + token);

      if (token && user) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({
          token,
          user: JSON.parse(user),
          authenticated: true,
          loading: false,
        });
      } else {
        setAuthState({
          token: null,
          user: null,
          authenticated: false,
          loading: false,
        });
      }
    };
    checkAuthenticated();

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response) {
          if (error.response.status === 401) {
            console.log("Token expired or unauthorized. Logging out...");
            await logout();
          }
        } else {
          console.log("Network error. Logging out...");
          await logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuthState({ ...authState, loading: true });
      const response = await axios.post(`${API_URL}/users/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        await SecureStore.setItemAsync("token", response.data.token);
        const user = JSON.stringify({
          name: response.data.name,
          email: response.data.email,
        });
        await SecureStore.setItemAsync("user", user);

        setAuthState({
          token: response.data.token,
          user: JSON.parse(user),
          authenticated: true,
          loading: false,
        });
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (error: any) {
      // Check if the error is a response error from the server
      setAuthState({ ...authState, loading: false });
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message); // Backend-defined error
      } else {
        throw new Error("Something went wrong. Please try again.");
      }
    }
  };

  const getProfile = async () => {
    setAuthState({ ...authState, loading: true });
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setAuthState({ ...authState, loading: false });
      try {
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAuthState({ ...authState, loading: false });

        return response.data;
      } catch (error) {
        console.log(error);
        setAuthState({ ...authState, loading: false });
      }
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setAuthState({ ...authState, loading: true });
      const response = await axios.post(`${API_URL}/users/`, {
        name,
        email,
        password,
      });
      // Automatically log in the user after registration
      await login(email, password);
      return response.data;
    } catch (error: any) {
      // Check if the error is a response error from the server
      setAuthState({ ...authState, loading: false });
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        throw new Error(error.response.data.message); // Backend-defined error
      } else {
        throw new Error("Something went wrong. Please try again.");
      }
    }
  };

  const logout = async () => {
    try {
      setAuthState({ ...authState, loading: true });
      await SecureStore.deleteItemAsync("token");
      await SecureStore.deleteItemAsync("user");
      setAuthState({
        token: null,
        user: null,
        authenticated: false,
        loading: false,
      });
    } catch (error) {
      setAuthState({ ...authState, loading: false });
      console.log(error);
    }
  };

  const value = { authState, login, register, getProfile, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
