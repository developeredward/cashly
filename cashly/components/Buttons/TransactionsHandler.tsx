import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { EvilIcons, Feather } from "@expo/vector-icons";

interface TransactionsHandlerProps {
  color: string;
  background: string;
}

const TransactionsHandler = ({
  color,
  background,
}: TransactionsHandlerProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: background + "90" }]}
      >
        <Feather name="arrow-down-left" size={32} color={color} />
        <Text style={[styles.text, { color }]}>Income</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: background + "20" }]}
      >
        <Feather name="arrow-up-right" size={32} color={color} />
        <Text style={[styles.text, { color: color }]}>Expenses</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
    marginTop: 40,
  },
  text: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  btn: {
    flex: 1,
    borderRadius: 50,
    marginBottom: 10,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    height: 60,
  },
});
export default TransactionsHandler;
