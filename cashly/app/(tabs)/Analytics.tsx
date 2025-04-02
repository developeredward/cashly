import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Animated,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { ProgressChart } from "react-native-chart-kit";
import { getTransactions } from "../../services/api/wallet";
import { currencySymbol } from "../../constants/Currencies";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useFocusEffect } from "expo-router";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";

const CATEGORY_MAP = {
  Utilities: ["Utilities", "Insurance"],
  Subscription: ["Entertainment", "Education"],
  Payments: ["Rent", "Loans", "Tax"],
  "Other Expenses": [
    "Groceries",
    "Transportation",
    "Food",
    "Shopping",
    "Travel",
    "Health",
    "Donations and charity",
    "Family and personal care",
    "Others",
  ],
};
const categoryIcons = {
  Utilities: (
    <View
      style={[
        {
          borderWidth: 1,
          borderColor: "white",
          borderRadius: 25,
        },
      ]}
    >
      <MaterialCommunityIcons name="lightning-bolt" size={18} color="white" />
    </View>
  ),
  Subscription: <Ionicons name="tv" size={18} color="white" />,
  Payments: <FontAwesome name="money" size={18} color="white" />,
  "Other Expenses": (
    <MaterialCommunityIcons name="cart" size={18} color="white" />
  ),
  Income: <FontAwesome name="arrow-up" size={18} color="white" />,
};

const categorizeTransaction = (
  category: string,
  type: string
): keyof typeof CATEGORY_MAP | "Income" => {
  if (type.toLowerCase() === "income") return "Income";
  for (const [key, values] of Object.entries(CATEGORY_MAP)) {
    if (values.includes(category)) return key as keyof typeof CATEGORY_MAP;
  }
  return "Other Expenses";
};

const Analysis = () => {
  const { colors, dark } = useTheme();
  interface Transaction {
    id: string;
    title: string;
    amount: number;
    type: string;
    category: string;
    account: string;
    image: string;
    dateTime: string;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState<"weekly" | "monthly">("weekly");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [dataPoints, setDataPoints] = useState([0, 0, 0, 0]);
  const [categoryColors, setCategoryColors] = useState({
    Utilities: "",
    Subscription: "",
    Payments: "",
    "Other Expenses": "",
    Income: "",
  });
  const [currency, setCurrency] = useState<string>("MAD");

  const fetchTransactions = async () => {
    const data = await getTransactions();
    if (!data) return;
    updateData({ data, period: timePeriod, index: selectedIndex });
    setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [timePeriod, selectedIndex]);
  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchTransactions();
    }, [timePeriod, selectedIndex])
  );

  const updateData = ({
    data,
    period,
    index,
  }: {
    data: {
      id: string;
      title: string;
      amount: number;
      type: string;
      category: string;
      account: string;
      image: string;
      dateTime: string;
    }[];
    period: "weekly" | "monthly";
    index: number;
  }) => {
    let categorizedData = {
      Utilities: 0,
      Subscription: 0,
      Payments: 0,
      "Other Expenses": 0,
      Income: 0,
    };

    const categoryColors = {
      Utilities: dark ? "#1DB954" : "#4CAF50",
      Subscription: dark ? "#E74C3C" : "#FF5555",
      Payments: dark ? "#FFB74D" : "#FFA726",
      "Other Expenses": dark ? "#6A1B9A" : "#8E24AA",
      Income: dark ? "#FFD700" : "#FFD700",
    };

    const now = new Date();
    if (period === "weekly") {
      let weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay() + 1 - index * 7);
      let weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      data.forEach((transaction) => {
        const transactionDate = new Date(transaction.dateTime);

        if (transactionDate >= weekStart && transactionDate <= weekEnd) {
          const category = categorizeTransaction(
            transaction.category,
            transaction.type
          );
          categorizedData[category] += transaction.amount;
        }
      });
    } else {
      let monthStart = new Date(now.getFullYear(), index, 1);
      let monthEnd = new Date(now.getFullYear(), index + 1, 0);

      data.forEach(
        (transaction: {
          id: string;
          title: string;
          amount: number;
          type: string;
          category: string;
          account: string;
          image: string;
          dateTime: string;
        }) => {
          const transactionDate: Date = new Date(transaction.dateTime);
          if (transactionDate >= monthStart && transactionDate <= monthEnd) {
            const category = categorizeTransaction(
              transaction.category,
              transaction.type
            );

            categorizedData[category] += transaction.amount;
          }
        }
      );
    }
    setDataPoints(Object.values(categorizedData));
    setCategoryColors(categoryColors);
  };

  const chartWidth = Dimensions.get("window").width - 40;
  const chartHeight = 220;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background, flex: 1 },
      ]}
    >
      <Text style={[styles.heading, { color: colors.text }]}>Analytics</Text>

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
          <View style={{ position: "relative" }}>
            <ProgressChart
              data={{
                data: dataPoints.map(
                  (val) => val / (dataPoints.reduce((a, b) => a + b, 1) || 1)
                ),
              }}
              width={chartWidth}
              height={chartHeight}
              strokeWidth={12}
              radius={32}
              chartConfig={{
                backgroundGradientFrom: colors.background,
                backgroundGradientTo: colors.background,
                decimalPlaces: 2,

                color: (opacity = 1, index) => {
                  const baseColors = dark
                    ? ["#1DB954", "#E74C3C", "#FFB74D", "#6A1B9A", "#FFD700"]
                    : ["#4CAF50", "#FF5555", "#FFA726", "#8E24AA", "#FFD700"];

                  return `${baseColors[index ?? 0]}${Math.floor(opacity * 255)
                    .toString(16)
                    .padStart(2, "0")}`;
                },
                labelColor: (opacity = 1) =>
                  dark
                    ? `rgba(255, 255, 255, ${opacity})`
                    : `rgba(0, 0, 0, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              hideLegend={true}
            />

            {dataPoints.map((value, index) => {
              const percentage =
                (value / dataPoints.reduce((a, b) => a + b, 1)) * 100;

              const colorOrder = [
                "Utilities",
                "Subscription",
                "Payments",
                "Other Expenses",
                "Income",
              ];

              const angle = (360 / dataPoints.length) * (index + 0.5);

              const labelX =
                chartWidth / 2 +
                Math.cos((angle * Math.PI) / 180) * (chartHeight / 2.5);
              const labelY =
                chartHeight / 2 +
                Math.sin((angle * Math.PI) / 180) * (chartHeight / 2.5);

              const category = colorOrder[index];

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.percentageLabel,
                    {
                      left:
                        category === "Utilities"
                          ? labelX - 80
                          : category === "Payments"
                          ? labelY - 10
                          : category === "Income"
                          ? labelX - 5
                          : category === "Subscription"
                          ? labelX - 20
                          : labelX - 20,
                      top:
                        category === "Utilities"
                          ? labelY - 50
                          : category === "Subscription"
                          ? labelY - 25
                          : category === "Other Expenses"
                          ? labelY + 30
                          : category === "Income"
                          ? labelY + 30
                          : labelY - 10,
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor:
                          categoryColors[
                            category as keyof typeof categoryColors
                          ],
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.percentageText,
                        {
                          color:
                            category === "Income"
                              ? "#000"
                              : category === "Payments"
                              ? "#000"
                              : "#FFF",
                        },
                      ]}
                    >
                      {percentage.toFixed(0)}%
                    </Text>
                  </View>
                </Animated.View>
              );
            })}
          </View>

          <View
            style={[
              {
                marginTop: 20,
                justifyContent: "flex-end",
                alignItems: "flex-end",
                alignSelf: "flex-end",
                marginRight: 20,
              },
            ]}
          >
            <Text
              style={[
                styles.summaryText,
                {
                  color: categoryColors["Income"],
                  textAlign: "right",
                  fontWeight: "bold",
                },
              ]}
            >
              Income: {dataPoints[4]} {currencySymbol[currency]}{" "}
            </Text>
          </View>
          <View>
            <View style={styles.buttonContainer}>
              {["weekly", "monthly"].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[styles.button]}
                  onPress={() => setTimePeriod(period)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color:
                          timePeriod === period ? colors.primary : colors.text,
                      },
                    ]}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttonContainer}>
              {(timePeriod === "weekly"
                ? ["Week 1", "Week 2", "Week 3", "Week 4"]
                : [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ]
              ).map((label, i) => (
                <TouchableOpacity
                  key={label}
                  style={[styles.subButton]}
                  onPress={() => setSelectedIndex(i)}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      {
                        color:
                          selectedIndex === i ? colors.primary : colors.text,
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Animated.View
            style={[
              styles.summaryContainer,
              {
                backgroundColor: dark
                  ? "rgba(24, 24, 24, 0.86)"
                  : "rgba(255, 255, 255, 0.8)",
              },
            ]}
          >
            <Text
              style={[
                styles.summaryText,
                {
                  color: colors.text,
                  fontWeight: "bold",
                  marginVertical: 10,
                },
              ]}
            >
              Spending Categories
            </Text>
            <View style={styles.cardContainer}>
              {Object.keys(CATEGORY_MAP).map((category, i) => (
                <TouchableOpacity key={category}>
                  <View
                    style={[
                      styles.card,
                      {
                        backgroundColor: dark ? "#444" : "rgba(0, 0, 0, 0.05)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.summaryText,
                        {
                          color: colors.text,
                        },
                      ]}
                    >
                      {dataPoints[i]} {currencySymbol[currency]}{" "}
                    </Text>
                    <Text
                      style={[
                        styles.summaryText,
                        {
                          color: colors.text + (dark ? "90" : "ff"),
                          fontSize: 10,
                          fontWeight: "regular",
                        },
                      ]}
                    >
                      {category}
                    </Text>
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor:
                            categoryColors[
                              category as keyof typeof categoryColors
                            ],
                        },
                      ]}
                    >
                      {categoryIcons[category as keyof typeof categoryIcons]}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: "center" },
  heading: {
    fontSize: 26,

    marginBottom: 20,
    fontFamily: "Poppins-Bold",
  },
  buttonContainer: {
    flexDirection: "row",

    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    padding: 5,
    margin: 2,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  subButton: {
    padding: 5,
    margin: 2,
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  buttonText: { fontSize: 14, fontWeight: "bold", color: "#333" },

  summaryContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingVertical: 20,
    paddingHorizontal: 20,
    overflow: "hidden",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    height: 300,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  cardContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 15,
  },
  contentContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    flexWrap: "wrap",
    alignItems: "center",
  },
  card: {
    padding: 10,
    margin: 5,
    borderRadius: 20,
    height: 100,
    width: 165,

    position: "relative",
  },
  summaryText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },
  iconContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    alignItems: "flex-start",
    padding: 5,
    borderRadius: 50,
  },
  percentageLabel: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  percentageText: {
    fontSize: 8,
    fontWeight: "bold",
  },
});

export default Analysis;
