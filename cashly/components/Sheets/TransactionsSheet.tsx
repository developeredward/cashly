import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getTransactions } from "../../constants/functions";
import { formatDate } from "../../constants/formateDate";
import { useRouter, useFocusEffect } from "expo-router";

interface TransactionsSheetProps {
  color: string;
  primary: string;
  background: string;
}

import { logos, LogosProps } from "../../constants/Logos";

const TransactionsSheet = ({
  color,
  primary,
  background,
}: TransactionsSheetProps) => {
  const { colors, dark } = useTheme();
  const [transactions, setTransactions] = useState<
    {
      id: string;
      title: string;
      dateTime: string;
      amount: number;
      type: string;
      img: string;
    }[]
  >([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchTransactionsData = async () => {
        const data = await getTransactions();
        // console.log(data);
        setTransactions(
          data.map((transaction) => ({
            id: transaction.id,
            title: transaction.title,
            dateTime: formatDate(transaction.dateTime),
            amount: transaction.amount,
            type: transaction.type,
            img: transaction.image,
          }))
        );
      };

      fetchTransactionsData();
    }, [])
  );
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: dark ? "#161616" : background },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.indicator,
          { backgroundColor: dark ? "#cccccc" + "20" : "#cccccc" + "50" },
        ]}
      ></TouchableOpacity>
      <View style={styles.headContainer}>
        <Text style={[styles.subHeading, { color: color }]}>
          Recent Transactions
        </Text>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Text style={[styles.subHeading, { color: primary }]}>View All</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={primary}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {transactions.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              top: 50,
            }}
          >
            <Text
              style={[
                styles.subHeading,
                {
                  color: color + "30",
                },
              ]}
            >
              No transactions found
            </Text>
          </View>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ gap: 20, height: "100%" }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.list}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      backgroundColor: dark
                        ? "#cccccc" + "20"
                        : "#cccccc" + "50",
                      padding: 10,
                      borderRadius: 10,
                      marginRight: 10,
                    }}
                  >
                    {logos[item.img as keyof LogosProps]}
                  </View>
                  <View>
                    <Text style={[styles.title, { color: color }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.subTitle, { color: color + "60" }]}>
                      {item.dateTime}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={[
                      styles.title,
                      {
                        color: color,
                      },
                    ]}
                  >
                    {item.type === "Income" ? "+" : "-"} ${item.amount}
                  </Text>
                  <Text style={[styles.subTitle, { color: color + "60" }]}>
                    {item.type === "Income" ? "Income" : "Expense"}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
    height: "100%",
    padding: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    marginTop: 20,
  },

  headContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  subHeading: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  indicator: {
    width: 30,
    height: 10,
    position: "absolute",
    top: -4,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  list: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: 10,
  },
  title: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  subTitle: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
});

export default TransactionsSheet;
