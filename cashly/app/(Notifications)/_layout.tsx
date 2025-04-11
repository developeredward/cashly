import React from "react";
import { Stack } from "expo-router";

import CustomHeader from "../../components/CustomHeader";

export default function NotificationsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="Notifications"
        options={{
          header: (props) => <CustomHeader title="Notifications" />,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
