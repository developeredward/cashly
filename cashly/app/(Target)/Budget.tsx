import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Modal,
  Button,
  ScrollView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { PieChart, ProgressChart } from "react-native-chart-kit";
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../../services/api/operations"; // Assuming updateBudget and deleteBudget are implemented
import LoadingSpinner from "../../components/LoadingSpinner";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Assuming you're using expo-router for navigation

const Budget = () => {
  const { colors, dark } = useTheme();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<string>("MAD");
  const router = useRouter();

  // State for the form modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newBudget, setNewBudget] = useState({
    name: "",
    amount: "",
    period: "Monthly",
    startDate: "",
    endDate: "",
  });

  // State for expanded budget
  const [expandedBudgetId, setExpandedBudgetId] = useState<string | null>(null);
  const [editedSpentAmount, setEditedSpentAmount] = useState<string>("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const fetchBudgets = async () => {
    try {
      const data = await getBudgets(); // Fetch budgets from your API
      if (Array.isArray(data)) {
        setBudgets(data); // Ensure the response is an array before setting the state
      } else {
        setBudgets([]); // Set to an empty array if the data is not an array
      }
      console.log("Budgets data:", data);
    } catch (error) {
      setBudgets([]); // Set to an empty array in case of error
    } finally {
      setLoading(false); // Stop loading once the fetch is done
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const chartWidth = Dimensions.get("window").width - 200;
  const chartHeight = 220;

  // Handle the form input change
  const handleInputChange = (name: string, value: string) => {
    setNewBudget((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleCreateBudget = async () => {
    const { name, amount, period, startDate, endDate } = newBudget;

    // Make sure all fields are filled
    if (!name || !amount || !startDate || !endDate) {
      alert("Please fill in all fields.");
      return;
    }

    const budgetData = {
      name, // Name of the budget
      amount: parseFloat(amount), // Ensure amount is a number
      period, // e.g., "Monthly"
      startDate: new Date(startDate), // Ensure the date is in the correct format
      endDate: new Date(endDate), // Ensure the date is in the correct format
    };

    try {
      await createBudget(budgetData);
      setIsModalVisible(false);
      fetchBudgets();
    } catch (error) {
      alert("Failed to create budget.");
    }
  };
  const formatDate = (dateString) => {
    // Ensure the date string is valid
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      // Return an empty string or a default value if the date is invalid
      console.error("Invalid date string:", dateString);
      return "Invalid Date";
    }

    // Format the valid date
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // Test the function

  //   // Handle editing the spent amount
  //   const handleEditSpentAmount = async (budgetId: string) => {
  //     if (!editedSpentAmount) {
  //       alert("Please enter a valid spent amount.");
  //       return;
  //     }

  //     try {
  //       const updatedBudget = {
  //         spentAmount: parseFloat(editedSpentAmount),
  //       };

  //       await updateBudget(budgetId, updatedBudget); // Assuming `updateBudget` sends the data to the backend
  //       setExpandedBudgetId(null); // Close the expanded view
  //       fetchBudgets(); // Refresh the budget list
  //     } catch (error) {
  //       alert("Failed to update spent amount.");
  //     }
  //   };

  const handleEditSpentAmount = async (budgetId: string) => {
    // Convert editedSpentAmount to a number
    const enteredAmount = parseFloat(editedSpentAmount);

    // Check if the entered amount is valid and within range
    if (isNaN(enteredAmount)) {
      alert("Please enter a valid spent amount.");
      return;
    }

    // Ensure the entered amount is not less than 0 and not greater than the budgeted amount
    if (
      enteredAmount < budgets.find((b) => b._id === budgetId)?.spentAmount ||
      enteredAmount > budgets.find((b) => b._id === budgetId)?.amount
    ) {
      alert(
        "Spent amount cannot be less than 0 or greater than the budgeted amount."
      );
      return;
    }

    try {
      const updatedBudget = {
        spentAmount: enteredAmount,
      };

      // Assuming `updateBudget` sends the data to the backend
      await updateBudget(budgetId, updatedBudget);
      setExpandedBudgetId(null); // Close the expanded view
      fetchBudgets(); // Refresh the budget list
    } catch (error) {
      alert("Failed to update spent amount.");
    }
  };

  const handleIncreaseSpentAmount = (budget: any) => {
    // Get the current spent amount from editedSpentAmount, if it exists, or fallback to budget.spentAmount
    const currentAmount = parseFloat(editedSpentAmount) || budget.spentAmount;

    // Increment the spent amount by 10, but don't exceed the budgeted amount
    const newAmount = Math.min(currentAmount + 10, budget.amount);
    setEditedSpentAmount(newAmount.toString());
  };

  const handleDecreaseSpentAmount = (budget: any) => {
    // Decrement the spent amount by 10, but don't go below 0
    const newAmount = Math.max(budget.spentAmount - 10, 0);
    setEditedSpentAmount(newAmount.toString());
  };

  // Handle deleting the budget
  const handleDeleteBudget = async (budgetId: string) => {
    try {
      await deleteBudget(budgetId); // Assuming `deleteBudget` sends the request to the backend
      fetchBudgets(); // Refresh the budget list
    } catch (error) {
      alert("Failed to delete budget.");
    }
  };

  const onStartDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date();
    setShowStartDatePicker(false);
    handleInputChange("startDate", currentDate.toISOString());
  };

  const onEndDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date();
    setShowEndDatePicker(false);
    handleInputChange("endDate", currentDate.toISOString());
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.banner, { backgroundColor: colors.primary, zIndex: 1 }]}
      ></View>
      <View style={[styles.headingContainer, { zIndex: 1 }]}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: colors.background }]}
          onPress={() => router.canGoBack() && router.back()}
        >
          <Ionicons name="chevron-back-sharp" size={18} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.heading, { color: colors.text, fontSize: 20 }]}>
          Budgets
        </Text>
        <View
          style={[styles.navBtn, { backgroundColor: "transparent" }]}
        ></View>
      </View>

      {/* Create Budget Button */}
      <View style={{ paddingHorizontal: 20 }}>
        <TouchableOpacity
          style={[
            styles.createBudgetButton,
            { backgroundColor: colors.primary },
          ]}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.createBudgetButtonText}>Create New Budget</Text>
        </TouchableOpacity>
      </View>

      {/* Loading Spinner */}
      {loading ? (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <LoadingSpinner color={colors.primary} />
        </View>
      ) : (
        <>
          <ScrollView style={{ flex: 1, marginTop: 20, paddingHorizontal: 20 }}>
            {budgets.length === 0 && (
              <Text
                style={[
                  styles.heading,
                  {
                    color: colors.text + "20",
                    fontSize: 18,
                    textAlign: "center",
                  },
                ]}
              >
                No budgets available.
              </Text>
            )}
            {budgets.map((budget, index) => {
              const progress = (budget.spentAmount / budget.amount) * 100; // Calculate progress
              const chartData = [
                {
                  name: "Spent",
                  population: budget.spentAmount,
                  color: "#FF7043",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
                {
                  name: "Remaining",
                  population: budget.amount - budget.spentAmount,
                  color: "#66BB6A",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
              ];

              return (
                <View
                  key={index}
                  style={[
                    styles.budgetCard,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      borderWidth: 1,
                    },
                  ]}
                >
                  {/* Pie Chart */}
                  <TouchableOpacity
                    onPress={() =>
                      setExpandedBudgetId(
                        budget._id === expandedBudgetId ? null : budget._id
                      )
                    }
                  >
                    <ProgressChart
                      data={{
                        data: [progress / 100],
                      }}
                      width={chartWidth}
                      height={chartHeight}
                      chartConfig={{
                        backgroundGradientFrom: colors.background,
                        backgroundGradientTo: colors.background,
                        color: (opacity = 1, index) => {
                          const baseColors = dark
                            ? [
                                "#1DB954",
                                "#E74C3C",
                                "#FFB74D",
                                "#6A1B9A",
                                "#FFD700",
                              ]
                            : [
                                "#4CAF50",
                                "#FF5555",
                                "#FFA726",
                                "#8E24AA",
                                "#FFD700",
                              ];

                          return `${baseColors[index ?? 0]}${Math.floor(
                            opacity * 255
                          )
                            .toString(16)
                            .padStart(2, "0")}`;
                        },
                        labelColor: (opacity = 1) =>
                          dark
                            ? `rgba(255, 255, 255, ${opacity})`
                            : `rgba(0, 0, 0, ${opacity})`,
                      }}
                      style={{
                        borderRadius: 16,
                        // left: "-5%",
                      }}
                      radius={52}
                    />
                    <View
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "30%",
                      }}
                    >
                      <Text
                        style={[styles.budgetTitle, { color: colors.text }]}
                      >
                        {budget.name} {/* Displaying the name of the budget */}
                      </Text>
                      <Text
                        style={[styles.budgetAmount, { color: colors.text }]}
                      >
                        {budget.spentAmount} / {budget.amount} {currency}
                      </Text>
                      <Text
                        style={[styles.detailsText, { color: colors.text }]}
                      >
                        <Text style={styles.detailsLabel}>Period: </Text>
                        {budget.period}
                      </Text>
                      <Text
                        style={[styles.detailsText, { color: colors.text }]}
                      >
                        <Text style={styles.detailsLabel}>Start Date: </Text>
                        {formatDate(new Date(budget.startDate))}
                      </Text>
                      <Text
                        style={[styles.detailsText, { color: colors.text }]}
                      >
                        <Text style={styles.detailsLabel}>End Date: </Text>
                        {formatDate(new Date(budget.endDate))}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {expandedBudgetId === budget._id && (
                    <View style={styles.expandedDetails}>
                      {/* Edit Spent Amount */}
                      <View>
                        <View style={styles.adjustButtons}>
                          <TouchableOpacity
                            style={[
                              {
                                backgroundColor: colors.notification,
                                height: 50,
                                borderRadius: 5,
                                width: 50,
                                justifyContent: "center",
                                alignItems: "center",
                              },
                            ]}
                            onPress={() => handleDecreaseSpentAmount(budget)}
                          >
                            <Text
                              style={[
                                styles.buttonText,
                                {
                                  fontSize: 28,
                                },
                              ]}
                            >
                              -
                            </Text>
                          </TouchableOpacity>
                          <TextInput
                            style={[
                              styles.input,
                              {
                                borderColor: colors.border,
                                backgroundColor: colors.background,
                                color: colors.text,
                                flex: 1,
                                height: 50,
                                textAlign: "center",

                                marginBottom: 0,
                              },
                            ]}
                            placeholder="Edit Spent Amount"
                            placeholderTextColor={colors.text}
                            value={
                              editedSpentAmount || budget.spentAmount.toString()
                            }
                            onChangeText={setEditedSpentAmount}
                            keyboardType="numeric"
                          />
                          <TouchableOpacity
                            style={[
                              {
                                backgroundColor: colors.primary,
                                height: 50,
                                borderRadius: 5,
                                width: 50,
                                justifyContent: "center",
                                alignItems: "center",
                              },
                            ]}
                            onPress={() => handleIncreaseSpentAmount(budget)}
                          >
                            <Text
                              style={[
                                styles.buttonText,
                                {
                                  fontSize: 28,
                                },
                              ]}
                            >
                              +
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                      <View style={styles.adjustButtons}>
                        {/* Delete Budget Button */}
                        <TouchableOpacity
                          style={[
                            styles.button,
                            {
                              backgroundColor: colors.notification,
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: 10,
                              height: 40,
                              padding: 0,
                              width: "30%",
                            },
                          ]}
                          onPress={() => handleDeleteBudget(budget._id)}
                        >
                          <Octicons
                            name="trash"
                            size={14}
                            color={colors.text}
                          />
                          <Text
                            style={[
                              styles.buttonText,
                              {
                                fontSize: 14,
                              },
                            ]}
                          >
                            Delete
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.button,
                            {
                              backgroundColor: colors.primary,
                              flexDirection: "row",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: 10,
                              height: 40,
                              padding: 0,
                              flex: 1,
                            },
                          ]}
                          onPress={() => handleEditSpentAmount(budget._id)}
                        >
                          <Text
                            style={[
                              styles.buttonText,
                              {
                                fontSize: 14,
                              },
                            ]}
                          >
                            Save Changes
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </>
      )}

      {/* Modal for creating new budget */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <View
              style={{
                justifyContent: "flex-end",
                alignItems: "flex-end",
                marginBottom: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: colors.notification,
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => setIsModalVisible(false)}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  X
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  borderWidth: 1,
                  backgroundColor: colors.background,
                  color: colors.text,
                },
              ]}
              placeholder="Budget Name"
              placeholderTextColor={colors.text + "50"}
              value={newBudget.name}
              onChangeText={(value) => handleInputChange("name", value)}
            />
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  borderWidth: 1,
                  backgroundColor: colors.background,
                  color: colors.text,
                },
              ]}
              placeholder="Amount"
              placeholderTextColor={colors.text + "50"}
              value={newBudget.amount}
              onChangeText={(value) => handleInputChange("amount", value)}
              keyboardType="numeric"
            />
            {/* Start Date Selector */}
            <TouchableOpacity
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  borderWidth: 1,
                  backgroundColor: colors.background,
                },
              ]}
              onPress={() => setShowStartDatePicker(true)}
            >
              <Text style={{ color: colors.text }}>
                {newBudget.startDate
                  ? new Date(newBudget.startDate).toLocaleDateString()
                  : "Start Date (DD-MM-YYYY)"}
              </Text>
            </TouchableOpacity>

            {/* End Date Selector */}
            <TouchableOpacity
              style={[
                styles.input,
                {
                  borderColor: colors.border,
                  borderWidth: 1,
                  backgroundColor: colors.background,
                },
              ]}
              onPress={() => setShowEndDatePicker(true)}
            >
              <Text style={{ color: colors.text }}>
                {newBudget.endDate
                  ? new Date(newBudget.endDate).toLocaleDateString()
                  : "End Date (DD-MM-YYYY)"}
              </Text>
            </TouchableOpacity>

            {/* DateTimePicker for Start Date */}
            {showStartDatePicker && (
              <DateTimePicker
                value={
                  newBudget.startDate
                    ? new Date(newBudget.startDate)
                    : new Date()
                }
                mode="date"
                display="inline"
                onChange={onStartDateChange}
                style={{
                  backgroundColor: colors.background,
                  position: "absolute",
                  zIndex: 1,
                }}
              />
            )}

            {/* DateTimePicker for End Date */}
            {showEndDatePicker && (
              <DateTimePicker
                value={
                  newBudget.endDate ? new Date(newBudget.endDate) : new Date()
                }
                mode="date"
                display="inline"
                onChange={onEndDateChange}
                style={{
                  backgroundColor: colors.background,
                  position: "absolute",
                  zIndex: 1,
                }}
              />
            )}

            {/* Period Selector */}
            <Text
              style={{
                color: colors.text,
                fontSize: 16,
              }}
            >
              Select Time Period
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 10,
                width: "100%",
                gap: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => handleInputChange("period", "Monthly")}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderWidth: 1,
                    flex: 1,
                  },
                  newBudget.period === "Monthly" && {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.periodText,
                    {
                      color: colors.text,
                    },
                    newBudget.period === "Monthly" && styles.selectedPeriodText,
                  ]}
                >
                  Monthly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleInputChange("period", "Yearly")}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderWidth: 1,
                    flex: 1,
                  },
                  newBudget.period === "Yearly" && {
                    backgroundColor: colors.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.periodText,
                    {
                      color: colors.text,
                    },
                    newBudget.period === "Yearly" && styles.selectedPeriodText,
                  ]}
                >
                  Yearly
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  padding: 10,
                  borderRadius: 5,
                  flex: 1,
                  alignItems: "center",
                }}
                onPress={handleCreateBudget}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Create Budget
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  createBudgetButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  createBudgetButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  budgetCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  budgetTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  budgetAmount: {
    fontSize: 12,
    marginVertical: 10,
  },
  expandedDetails: {
    marginTop: 15,
  },
  detailsText: {
    fontSize: 12,
  },
  detailsLabel: {
    fontWeight: "bold",
  },
  adjustButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    gap: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: "48%",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  periodButton: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#EEE",
    borderRadius: 5,
    alignItems: "center",
  },
  selectedPeriod: {
    backgroundColor: "#007BFF",
  },
  periodText: {
    fontSize: 16,
  },
  selectedPeriodText: {
    color: "#FFF",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  headingContainer: {
    position: "absolute",
    top: 60,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
  },
  banner: {
    width: "100%",
    height: 250,
    backgroundColor: "#f0f0f0",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",

    fontFamily: "Poppins-Bold",
  },
  navBtn: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 50,
  },
});

export default Budget;
