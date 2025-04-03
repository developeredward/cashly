import React from "react";
import { Stack } from "expo-router";

import CustomHeader from "../../components/CustomHeader";

export default function TargetLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="Budget"
        options={{
          header: (props) => <CustomHeader title="Budgeting" />,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Goal"
        options={{
          header: (props) => <CustomHeader title="Goals" />,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
