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
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../../services/api/operations"; // Assuming updateGoal and deleteGoal are implemented
import LoadingSpinner from "../../components/LoadingSpinner";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Assuming you're using expo-router for navigation

const Goal = () => {
  const { colors, dark } = useTheme();
  const [Goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<string>("MAD");
  const router = useRouter();

  // State for the form modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    targetAmount: "",
    priority: "Medium",
    deadline: "",
  });

  // State for expanded Goal
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [editedCurrentAmount, setEditedCurrentAmount] = useState<string>("");

  const [showdeadlinePicker, setShowdeadlinePicker] = useState(false);

  const fetchGoals = async () => {
    try {
      const data = await getGoals(); // Fetch Goals from your API
      if (Array.isArray(data)) {
        console.log("Fetched Goals:", data); // Log the fetched data
        setGoals(data); // Ensure the response is an array before setting the state
      } else {
        setGoals([]); // Set to an empty array if the data is not an array
      }
    } catch (error) {
      setGoals([]); // Set to an empty array in case of error
    } finally {
      setLoading(false); // Stop loading once the fetch is done
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const chartWidth = Dimensions.get("window").width - 200;
  const chartHeight = 220;

  // Handle the form input change
  const handleInputChange = (name: string, value: string) => {
    setNewGoal((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleCreateGoal = async () => {
    const { name, targetAmount, priority, deadline } = newGoal;

    // Make sure all fields are filled
    if (!name || !targetAmount || !deadline) {
      alert("Please fill in all fields.");
      return;
    }

    const GoalData = {
      name, // Name of the Goal
      targetAmount: parseFloat(targetAmount), // Ensure amount is a number
      deadline: new Date(deadline), // Ensure the date is in the correct format
      priority, // Default priority value (adjust as needed)
    };

    try {
      await createGoal(GoalData);
      setIsModalVisible(false);
      fetchGoals();
    } catch (error) {
      alert("Failed to create Goal.");
    }
  };
  const formatDate = (dateString: string): string => {
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

  const handleEditSpentAmount = async (GoalId: string) => {
    // Convert editedCurrentAmount to a number
    const enteredAmount = parseFloat(editedCurrentAmount);

    // Check if the entered amount is valid and within range
    if (isNaN(enteredAmount)) {
      alert("Please enter a valid spent amount.");
      return;
    }

    // Ensure the entered amount is not less than 0 and not greater than the Goaled amount
    if (
      enteredAmount < Goals.find((b) => b._id === GoalId)?.currentAmount ||
      enteredAmount > Goals.find((b) => b._id === GoalId)?.targetAmount
    ) {
      alert(
        "Spent amount cannot be less than 0 or greater than the Goaled amount."
      );
      return;
    }

    try {
      const existingGoal = Goals.find((b) => b._id === GoalId);
      if (!existingGoal) {
        alert("Goal not found.");
        return;
      }

      const updatedGoal = {
        ...existingGoal,
        currentAmount: enteredAmount,
      };

      // Assuming `updateGoal` sends the data to the backend
      await updateGoal(GoalId, updatedGoal);
      setExpandedGoalId(null); // Close the expanded view
      fetchGoals(); // Refresh the Goal list
    } catch (error) {
      alert("Failed to update spent amount.");
    }
  };

  const handleIncreaseSpentAmount = (Goal: any) => {
    // Get the current spent amount from editedCurrentAmount, if it exists, or fallback to Goal.spentAmount
    const currentAmount = parseFloat(editedCurrentAmount) || Goal.currentAmount;

    // Increment the spent amount by 10, but don't exceed the Goaled amount
    const newAmount = Math.min(currentAmount + 10, Goal.targetAmount);
    setEditedCurrentAmount(newAmount.toString());
  };

  const handleDecreaseSpentAmount = (Goal: any) => {
    // Get the current spent amount from editedCurrentAmount, if it exists, or fallback to Goal.spentAmount
    const currentAmount = parseFloat(editedCurrentAmount) || Goal.currentAmount;

    // Decrement the spent amount by 10, but don't go below 0
    const newAmount = Math.max(currentAmount - 10, Goal.currentAmount);
    setEditedCurrentAmount(newAmount.toString());
  };

  // Handle deleting the Goal
  const handleDeleteGoal = async (GoalId: string) => {
    try {
      await deleteGoal(GoalId); // Assuming `deleteGoal` sends the request to the backend
      fetchGoals(); // Refresh the Goal list
    } catch (error) {
      alert("Failed to delete Goal.");
    }
  };

  const ondeadlineChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || new Date();
    setShowdeadlinePicker(false);
    handleInputChange("deadline", currentDate.toISOString());
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
          Goals
        </Text>
        <View
          style={[styles.navBtn, { backgroundColor: "transparent" }]}
        ></View>
      </View>

      {/* Create Goal Button */}
      <View style={{ paddingHorizontal: 20 }}>
        <TouchableOpacity
          style={[styles.createGoalButton, { backgroundColor: colors.primary }]}
          onPress={() => setIsModalVisible(true)}
        >
          <Text style={styles.createGoalButtonText}>Create New Goal</Text>
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
            {Goals.length === 0 && (
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
                No Goals available.
              </Text>
            )}
            {Goals.map((Goal, index) => {
              const progress = (Goal.currentAmount / Goal.targetAmount) * 100; // Calculate progress
              const chartData = [
                {
                  name: "Spent",
                  population: Goal.spentAmount,
                  color: "#FF7043",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
                {
                  name: "Remaining",
                  population: Goal.amount - Goal.spentAmount,
                  color: "#66BB6A",
                  legendFontColor: "#7F7F7F",
                  legendFontSize: 15,
                },
              ];

              return (
                <View
                  key={index}
                  style={[
                    styles.GoalCard,
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
                      setExpandedGoalId(
                        Goal._id === expandedGoalId ? null : Goal._id
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
                      <Text style={[styles.GoalTitle, { color: colors.text }]}>
                        {Goal.name} {/* Displaying the name of the Goal */}
                      </Text>
                      <Text style={[styles.GoalAmount, { color: colors.text }]}>
                        {Goal.currentAmount} / {Goal.targetAmount} {currency}
                      </Text>
                      <Text
                        style={[styles.detailsText, { color: colors.text }]}
                      >
                        <Text style={styles.detailsLabel}>Priority: </Text>
                        {Goal.priority}
                      </Text>

                      <Text
                        style={[styles.detailsText, { color: colors.text }]}
                      >
                        <Text style={styles.detailsLabel}>DeadLine: </Text>
                        {formatDate(Goal.deadline)}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {expandedGoalId === Goal._id && (
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
                            onPress={() => handleDecreaseSpentAmount(Goal)}
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
                              editedCurrentAmount ||
                              Goal.currentAmount?.toString()
                            }
                            onChangeText={setEditedCurrentAmount}
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
                            onPress={() => handleIncreaseSpentAmount(Goal)}
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
                        {/* Delete Goal Button */}
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
                          onPress={() => handleDeleteGoal(Goal._id)}
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
                          onPress={() => handleEditSpentAmount(Goal._id)}
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

      {/* Modal for creating new Goal */}
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
              placeholder="Goal Name"
              placeholderTextColor={colors.text + "50"}
              value={newGoal.name}
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
              value={newGoal.targetAmount}
              onChangeText={(value) => handleInputChange("targetAmount", value)}
              keyboardType="numeric"
            />

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
              onPress={() => setShowdeadlinePicker(true)}
            >
              <Text style={{ color: colors.text }}>
                {newGoal.deadline
                  ? new Date(newGoal.deadline).toLocaleDateString()
                  : "Deadline (DD-MM-YYYY)"}
              </Text>
            </TouchableOpacity>

            {/* DateTimePicker for End Date */}
            {showdeadlinePicker && (
              <DateTimePicker
                value={
                  newGoal.deadline ? new Date(newGoal.deadline) : new Date()
                }
                mode="date"
                display="inline"
                onChange={ondeadlineChange}
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
              Priority
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
                onPress={() => handleInputChange("priority", "Low")}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderWidth: 1,
                    flex: 1,
                  },
                  newGoal.priority === "Low" && {
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
                    newGoal.priority === "Low" && styles.selectedPeriodText,
                  ]}
                >
                  Low
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleInputChange("priority", "Medium")}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderWidth: 1,
                    flex: 1,
                  },
                  newGoal.priority === "Medium" && {
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
                    newGoal.priority === "Medium" && styles.selectedPeriodText,
                  ]}
                >
                  Medium
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleInputChange("priority", "High")}
                style={[
                  styles.periodButton,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                    borderWidth: 1,
                    flex: 1,
                  },
                  newGoal.priority === "High" && {
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
                    newGoal.priority === "High" && styles.selectedPeriodText,
                  ]}
                >
                  High
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
                onPress={handleCreateGoal}
              >
                <Text
                  style={{
                    color: colors.text,
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  Create Goal
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

  createGoalButton: {
    backgroundColor: "#007BFF",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  createGoalButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  GoalCard: {
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
  GoalTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  GoalAmount: {
    fontSize: 12,
    marginVertical: 10,
  },
  expandedDetails: {
    marginTop: 14,
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

export default Goal;
