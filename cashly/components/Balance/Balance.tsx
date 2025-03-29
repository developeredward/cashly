import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { getBalance } from "../../constants/functions";
import { currencySymbol } from "../../constants/Currencies";

interface BalanceProps {
  color: string;
}

const Balance = ({ color }: BalanceProps) => {
  const [balance, setBalance] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("MAD");
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(true);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible((prevState) => !prevState);
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchBalance = async () => {
        const balance = await getBalance();
        // console.log(balance);
        if (!balance) return;
        setBalance(balance?.totalBalance ?? 0);
        setCurrency(balance?.currency);
      };
      fetchBalance();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.title, { color: color + "60" }]}>
          Wallet Balance
        </Text>
      </View>
      <View style={styles.balanceContainer}>
        <View>
          <Text style={[styles.balance, { color: color }]}>
            {isBalanceVisible
              ? currencySymbol[currency] +
                " " +
                (balance
                  ? balance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
                  : "0.00")
              : "*****"}{" "}
          </Text>
        </View>
        <TouchableOpacity onPress={toggleBalanceVisibility} style={styles.icon}>
          <Ionicons
            name={isBalanceVisible ? "eye" : "eye-off"}
            size={24}
            color={color}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
  },
  balanceContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  balance: {
    fontSize: 40,
    fontFamily: "Poppins-Bold",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Balance;
