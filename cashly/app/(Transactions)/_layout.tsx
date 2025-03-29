import React from "react";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

import CustomHeader from "../../components/CustomHeader";

export default function DashboardLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="Transactions"
        options={{
          header: (props) => <CustomHeader title="Transactions" />,
        }}
      />
      <Stack.Screen
        name="RecordTransaction"
        options={{
          header: (props) => <CustomHeader title="Add transaction" />,
        }}
      />
    </Stack>
  );
}
