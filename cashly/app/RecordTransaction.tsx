import { View, Text, SafeAreaView, StyleSheet, TextInput } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";

const RecordTransactionScreen = () => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageContainer}></View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
          <View style={styles.input}>
            <Text style={[styles.currency, { color: colors.text }]}>$</Text>
            <TextInput
              style={[styles.amount, { color: colors.text }]}
              placeholder="0.00"
              placeholderTextColor={colors.text + "50"}
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  content: {
    marginTop: 20,
  },
  imageContainer: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "#cccccc" + "20",
  },
  inputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc" + "50",
  },
  currency: {
    fontSize: 24,
    fontFamily: "Poppins-Regular",
  },
  amount: {
    fontSize: 24,
    fontFamily: "Poppins-Regular",
    flex: 1,
    marginLeft: 5,
  },
});

export default RecordTransactionScreen;
