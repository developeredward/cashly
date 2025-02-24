import axios from "axios";
import * as SecureStore from "expo-secure-store";

export const getBalance = async () => {
  const token = await SecureStore.getItemAsync("token");
  try {
    const response = await axios.get("http://localhost:3000/api/v1/accounts/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    interface Account {
      balance: number;
    }

    interface ApiResponse {
      data: Account[];
    }

    const totalBalance = (response.data as ApiResponse["data"]).reduce(
      (sum, account) => sum + account.balance,
      0
    );
    const currency = response.data[0].currency;
    return { totalBalance, currency };
  } catch (error) {
    console.log(error);
  }
};
