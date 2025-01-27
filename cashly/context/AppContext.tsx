import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";

interface AuthContextProps {
  authState?: { token: string | null; authenticated: Boolean };
  login?: (email: string, password: string) => Promise<any>;
  register?: (name: string, email: string, password: string) => Promise<any>;
  getProfile?: () => Promise<any>;
  logout?: () => Promise<any>;
}
let ALL_API_URL = "http://192.168.11.111:3000/api/v1/";
let TEMP_API_URL = "http://192.168.8.127:3000/api/v1/";
let LOCAL_API_URL = "http://localhost:3000/api/v1/";

export const API_URL = LOCAL_API_URL;

const AuthContext = createContext<AuthContextProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: Boolean;
  }>({
    token: null,
    authenticated: false,
  });

  useEffect(() => {
    const checkAuthenticated = async () => {
      const token = await SecureStore.getItemAsync("token");
      console.log("stored token::" + token);

      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAuthState({ token: token, authenticated: true });
      } else {
        setAuthState({ token: null, authenticated: false });
      }
    };
    checkAuthenticated();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}users/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        await SecureStore.setItemAsync("token", response.data.token);
        setAuthState({ token: response.data.token, authenticated: true });
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.token}`;
      }

      return response.data;
    } catch (error: any) {
      // Check if the error is a response error from the server
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
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await axios.get(`${API_URL}users/profile/:id`);

        return response.data;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}users/`, {
        name,
        email,
        password,
      });
      // Automatically log in the user after registration
      await login(email, password);
      return response.data;
    } catch (error: any) {
      // Check if the error is a response error from the server
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
      await SecureStore.deleteItemAsync("token");
      setAuthState({ token: null, authenticated: false });
    } catch (error) {
      console.log(error);
    }
  };

  const value = { authState, login, register, getProfile, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
