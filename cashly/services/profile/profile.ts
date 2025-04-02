import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "../../constants/urls";

export const getProfile = async () => {
  const token = await SecureStore.getItemAsync("token");
  try {
    const response = await axios.get(`${BASE_URL}/users/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (data: {
  name: string;
  currency: string;
}) => {
  const token = await SecureStore.getItemAsync("token");
  try {
    const response = await axios.put(`${BASE_URL}/users/profile/`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { data: response.data, status: response.status };
  } catch (error) {
    console.log(error);
  }
};
export const deleteProfile = async () => {
  const token = await SecureStore.getItemAsync("token");
  try {
    const response = await axios.delete(`${BASE_URL}/users/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { data: response.data, status: response.status };
  } catch (error) {
    console.log(error);
  }
};
