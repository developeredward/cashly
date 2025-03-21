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

export const getBalanceById = async (accountId: String) => {
  try {
    const token = await SecureStore.getItemAsync("token");

    const { data } = await axios.get(
      `http://localhost:3000/api/v1/accounts/${accountId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const account = data[0];
    if (!account) {
      console.error("Account not found");
      return;
    }

    return Number(account.balance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return null;
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

export const updateBalance = async (
  accountId: string,
  amount: number,
  isIncome: boolean
) => {
  const token = await SecureStore.getItemAsync("token");

  try {
    // Fetch current balance
    const { data } = await axios.get(
      `http://localhost:3000/api/v1/accounts/${accountId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Extract the first account from the array
    const account = data[0];
    if (!account) {
      console.error("Account not found");
      return;
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount)) {
      console.error("Invalid amount:", amount);
      return;
    }

    const currentBalance = Number(account.balance);
    const newBalance = isIncome
      ? currentBalance + parsedAmount
      : currentBalance - parsedAmount;

    console.log("Current balance:", currentBalance);
    console.log("Amount to update:", parsedAmount);
    console.log("New balance:", newBalance);

    const response = await axios.patch(
      `http://localhost:3000/api/v1/accounts/${accountId}`,
      { balance: newBalance },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("Balance updated:", response.data);

    return response.status;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(
        "Error updating balance:",
        error.response?.data || error.message
      );
    } else {
      if (error instanceof Error) {
        console.log("Error updating balance:", error.message);
      } else {
        console.log("Error updating balance:", error);
      }
    }
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
