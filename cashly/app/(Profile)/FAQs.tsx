import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const faqs = [
  {
    question: "How do I update my profile?",
    answer:
      "Go to the profile section, make your changes, and tap 'Done' to save.",
  },
  {
    question: "Can I change my email address?",
    answer:
      "No, the email address is fixed and cannot be changed after registration.",
  },
  {
    question: "What currencies are supported?",
    answer:
      "We support all major global currencies up to three characters long (e.g., USD, EUR).",
  },
];

const FAQs = () => {
  const { colors, dark } = useTheme();
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      <View style={[styles.banner, { backgroundColor: colors.primary }]}></View>
      <View style={styles.headingContainer}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: colors.background }]}
          onPress={() => router.canGoBack() && router.back()}
        >
          <Ionicons name="chevron-back-sharp" size={18} color={colors.text} />
        </TouchableOpacity>
        <Text
          style={[
            styles.heading,
            {
              color: colors.text,
              textAlign: "center",
            },
          ]}
        >
          FAQs
        </Text>
        <View style={[styles.navBtn]}></View>
      </View>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, marginTop: 20 }}>
        {faqs.map((faq, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.faqContainer,
              {
                backgroundColor: dark ? "#1e1e1e" : colors.card,
              },
            ]}
            onPress={() => setExpanded(expanded === index ? null : index)}
          >
            <Text style={[styles.question, { color: colors.text }]}>
              {faq.question}
            </Text>
            {expanded === index && (
              <Text style={[styles.answer, { color: colors.text + "80" }]}>
                {faq.answer}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headingContainer: {
    position: "absolute",
    top: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 26,
    fontFamily: "Poppins-Bold",
    marginLeft: 20,
    textAlign: "center",
  },
  navBtn: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  faqContainer: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  answer: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginTop: 10,
  },
});

export default FAQs;
