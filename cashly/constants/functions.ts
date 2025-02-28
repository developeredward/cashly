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

export const getCategories = async () => {
  const token = await SecureStore.getItemAsync("token");
  try {
    const response = await axios.get(
      "http://localhost:3000/api/v1/categories/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    interface Category {
      _id: string;
      name: string;
      type: string;
    }

    interface ApiResponse {
      data: Category[];
    }

    return (response.data as ApiResponse["data"]).map((category) => ({
      id: category._id,
      title: category.name,
      type: category.type,
    }));
  } catch (error) {
    console.log(error);
  }
};

export const getAccounts = async () => {
  const token = await SecureStore.getItemAsync("token");
  try {
    const response = await axios.get("http://localhost:3000/api/v1/accounts/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    interface Account {
      _id: string;
      name: string;
      type: string;
      balance: number;
    }

    interface ApiResponse {
      data: Account[];
    }

    return (response.data as ApiResponse["data"]).map((account) => ({
      id: account._id,
      title: account.name,
      type: account.type,
      balance: account.balance,
    }));
  } catch (error) {
    console.log(error);
  }
};

export const createTransaction = async (transaction: any) => {
  const token = await SecureStore.getItemAsync("token");
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/transactions/",
      transaction,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    interface Transaction {
      _id: string;
      description: string;
      amount: number;
      type: string;
      category: string;
      accountId: string;
    }
    interface ApiResponse {
      data: Transaction[];
    }
    return {
      data: response.data as ApiResponse["data"],
      status: response.status,
    };
  } catch (error) {
    console.log(error);
  }
};

export const getTransactions = async () => {
  const token = await SecureStore.getItemAsync("token");
  try {
    const response = await axios.get(
      "http://localhost:3000/api/v1/transactions/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Mapping the API response to a simplified format
    interface Transaction {
      _id: string;
      description: string;
      amount: number;
      type: string;
      category: { _id: string; name: string };
      accountId: { _id: string; name: string; type: string };
      image: string;
      createdAt: string;
    }

    interface ApiResponse {
      data: Transaction[];
    }

    return (response.data as ApiResponse["data"])
      .map((transaction) => ({
        id: transaction._id,
        title: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category.name,
        account: `${transaction.accountId.type} - ${transaction.accountId.name}`,
        image: transaction.image,
        dateTime: transaction.createdAt,
      }))
      .sort(
        (a, b) =>
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
      );
  } catch (error) {
    console.log(error);
    return [];
  }
};
