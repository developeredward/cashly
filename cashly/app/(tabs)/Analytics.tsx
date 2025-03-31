import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { getTransactions } from "../../services/api/wallet";
import { currencySymbol } from "../../constants/Currencies";
import LoadingSpinner from "../../components/LoadingSpinner";

const Analysis = () => {
  const { colors, dark } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await getTransactions();
      if (!data) return;

      let income = 0;
      let expense = 0;

      data.forEach((transaction) => {
        if (transaction.type === "Income") {
          income += transaction.amount;
        } else if (transaction.type === "Expense") {
          expense += transaction.amount;
        }
      });

      setTotalIncome(income);
      setTotalExpense(expense);
      setTransactions(data);
      setLoading(false);
    };

    fetchTransactions();
  }, []);

  const chartData = [
    {
      name: "Income",
      amount: totalIncome,
      color: "#4CAF50",
      legendFontColor: colors.text,
      legendFontSize: 14,
    },
    {
      name: "Expense",
      amount: totalExpense,
      color: "#FF5555",
      legendFontColor: colors.text,
      legendFontSize: 14,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.text }]}>
        Financial Analysis
      </Text>
      {loading ? (
        <LoadingSpinner color={colors.primary} />
      ) : (
        <>
          <PieChart
            data={chartData}
            width={Dimensions.get("window").width - 40}
            height={220}
            chartConfig={{
              backgroundGradientFrom: colors.background,
              backgroundGradientTo: colors.background,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
          <View style={styles.summaryContainer}>
            <Text style={[styles.summaryText, { color: "#4CAF50" }]}>
              Income: {totalIncome} {currencySymbol["MAD"]}
            </Text>
            <Text style={[styles.summaryText, { color: "#FF5555" }]}>
              Expense: {totalExpense} {currencySymbol["MAD"]}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  summaryContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
});

export default Analysis;
