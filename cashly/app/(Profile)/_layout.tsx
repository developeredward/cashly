import React from "react";
import { Stack } from "expo-router";

import CustomHeader from "../../components/CustomHeader";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="EditProfile"
        options={{
          header: (props) => <CustomHeader title="Edit Profile" />,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FAQs"
        options={{
          header: (props) => <CustomHeader title="FAQs" />,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
