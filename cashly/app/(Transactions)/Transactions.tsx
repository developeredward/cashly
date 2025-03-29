import { View, Text } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";

import TransactionsSheet from "../../components/Sheets/TransactionsSheet";

const Transactions = () => {
  const { colors } = useTheme();
  return (
    <View>
      <TransactionsSheet
        color={colors.text}
        primary={colors.primary}
        background={colors.background}
        title="History"
        type="transactions"
      />
    </View>
  );
};

export default Transactions;
