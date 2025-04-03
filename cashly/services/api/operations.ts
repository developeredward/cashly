import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { BASE_URL } from "../../constants/urls";

// Fetch budgets from the API
export const getBudgets = async () => {
  const token = await SecureStore.getItemAsync("token");
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }
  try {
    const response = await axios.get(`${BASE_URL}/budgets/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (
      Array.isArray(response.data.budgets) &&
      response.data.budgets.length > 0
    ) {
      return response.data.budgets;
    } else {
      throw new Error("No budgets found or invalid data format");
    }
  } catch (error) {
    console.log("Error fetching budgets:", error);
    return error;
  }
};

/// Create a new budget
export const createBudget = async (data: {
  name: string; // Name of the budget
  amount: number; // Total amount for the budget
  period: string; // Period like "Daily", "Weekly", "Monthly", "Yearly"
  startDate: Date; // Budget start date
  endDate: Date; // Budget end date
}) => {
  const token = await SecureStore.getItemAsync("token");
  try {
    // Assuming userId is stored in secure storage

    const response = await axios.post(
      `${BASE_URL}/budgets/`,
      {
        name: data.name, // Send the name of the budget
        amount: data.amount, // Total budget amount
        spentAmount: 0, // Default spentAmount to 0
        period: data.period, // Budget period (Monthly, Yearly, etc.)
        startDate: data.startDate, // Budget start date
        endDate: data.endDate, // Budget end date
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token for authorization
        },
      }
    );

    // Validate response data
    if (response.data) {
      return response.data; // Return the created budget if successful
    } else {
      throw new Error("Budget creation failed, invalid response data");
    }
  } catch (error) {
    console.log("Error creating budget:", error);
    throw error; // Re-throw the error to be handled in the component
  }
};

// Update an existing budget
export const updateBudget = async (
  id: string, // ID of the budget to update
  data: {
    name: string; // Updated name of the budget
    amount: number; // Updated total amount for the budget
    period: string; // Updated period like "Daily", "Weekly", "Monthly", "Yearly"
    spentAmount: number; // Updated spent amount
    startDate: Date; // Updated budget start date
    endDate: Date; // Updated budget end date
  }
) => {
  const token = await SecureStore.getItemAsync("token");
  try {
    const response = await axios.put(
      `${BASE_URL}/budgets/${id}/`,
      {
        name: data.name, // Updated name of the budget
        amount: data.amount, // Updated total budget amount
        period: data.period, // Updated budget period (Monthly, Yearly, etc.)
        spentAmount: data.spentAmount, // Updated spent amount
        startDate: data.startDate, // Updated budget start date
        endDate: data.endDate, // Updated budget end date
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token for authorization
        },
      }
    );

    if (response.data) {
      return response.data; // Return the updated budget if successful
    } else {
      throw new Error("Budget update failed, invalid response data");
    }
  } catch (error) {
    console.log("Error updating budget:", error);
    throw error; // Re-throw the error to be handled in the component
  }
};
// Delete a budget
export const deleteBudget = async (id: string) => {
  const token = await SecureStore.getItemAsync("token");
  try {
    const response = await axios.delete(`${BASE_URL}/budgets/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token for authorization
      },
    });

    if (response.status === 200) {
      return true; // Return true if the budget was deleted successfully
    } else {
      throw new Error("Budget deletion failed, invalid response status");
    }
  } catch (error) {
    console.log("Error deleting budget:", error);
    throw error; // Re-throw the error to be handled in the component
  }
};
// Fetch transactions for a specific budget

// Fetch Goals from the API
export const getGoals = async () => {
  const token = await SecureStore.getItemAsync("token");
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/goals/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Adjusted check to make sure 'goals' exists and is an array
    if (
      response.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      return response.data;
    } else {
      throw new Error("No goals found or invalid data format");
    }
  } catch (error) {
    console.log("Error fetching goals:", error);
    return error;
  }
};

// Create a new goal
export const createGoal = async (data: {
  name: string; // Name of the goal
  targetAmount: number; // Total amount for the goal
  period: string; // Period like "Daily", "Weekly", "Monthly", "Yearly"
  deadline: Date; // Goal deadline
  priority: string; // Priority of the goal
}) => {
  const token = await SecureStore.getItemAsync("token");
  try {
    const response = await axios.post(
      `${BASE_URL}/goals/`,
      {
        name: data.name, // Send the name of the goal
        targetAmount: data.targetAmount, // Total goal amount
        period: data.period, // Goal period (Monthly, Yearly, etc.)
        deadline: data.deadline, // Goal deadline
        priority: data.priority || "Medium", // Goal priority
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token for authorization
        },
      }
    );

    // Validate response data
    if (response.data) {
      return response.data; // Return the created goal if successful
    } else {
      throw new Error("Goal creation failed, invalid response data");
    }
  } catch (error) {
    console.log("Error creating goal:", error);
    throw error; // Re-throw the error to be handled in the component
  }
};
// Update an existing goal
export const updateGoal = async (
  id: string, // ID of the goal to update
  data: {
    name: string; // Updated name of the goal
    targetAmount: number; // Updated total amount for the goal
    period: string; // Updated period like "Daily", "Weekly", "Monthly", "Yearly"
    currentAmount: number; // Updated spent amount
    deadLine: Date; // Updated goal deadline
    priority: string; // Updated goal priority
    completed: boolean; // Updated goal completion status
  }
) => {
  const token = await SecureStore.getItemAsync("token");
  try {
    const response = await axios.put(
      `${BASE_URL}/goals/${id}/`,
      {
        name: data.name, // Updated name of the goal
        targetAmount: data.targetAmount, // Updated total goal amount
        period: data.period, // Updated goal period (Monthly, Yearly, etc.)
        currentAmount: data.currentAmount, // Updated spent amount
        deadLine: data.deadLine, // Updated goal deadline
        priority: data.priority, // Updated goal priority
        completed: data.completed, // Updated goal completion status
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token for authorization
        },
      }
    );

    if (response.data) {
      return response.data; // Return the updated goal if successful
    } else {
      throw new Error("Goal update failed, invalid response data");
    }
  } catch (error) {
    console.log("Error updating goal:", error);
    throw error; // Re-throw the error to be handled in the component
  }
};
// Delete a goal
export const deleteGoal = async (id: string) => {
  const token = await SecureStore.getItemAsync("token");
  try {
    const response = await axios.delete(`${BASE_URL}/goals/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token for authorization
      },
    });

    if (response.status === 200) {
      return true; // Return true if the goal was deleted successfully
    } else {
      throw new Error("Goal deletion failed, invalid response status");
    }
  } catch (error) {
    console.log("Error deleting goal:", error);
    throw error; // Re-throw the error to be handled in the component
  }
};
