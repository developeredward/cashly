import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import {
  getCategories,
  getAccounts,
  createTransaction,
  updateBalance,
  getBalanceById,
} from "../../services/api/wallet";
import {
  Ionicons,
  SimpleLineIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import MyPicker from "../../components/Buttons/Picker";
import PrimaryBtn from "../../components/Buttons/PrimaryBtn";
import { handleImageRender } from "../../constants/handleImageRender";
import { useRouter, useLocalSearchParams } from "expo-router";
import LoadingSpinner from "../../components/LoadingSpinner";
import Balance from "../../components/Balance/Balance";
import { currencySymbol } from "../../constants/Currencies";
import { getProfile } from "../../services/profile/profile";

const RecordTransactionScreen = () => {
  const { colors, dark } = useTheme();
  const { name, amount } = useLocalSearchParams();
  const router = useRouter();
  const [allAccounts, setAllAccounts] = React.useState<
    { id: string; title: string; type: string; balance: number }[]
  >([]);
  const [allCategories, setAllCategories] = React.useState<
    { id: string; title: string; type: string }[]
  >([]);
  const [filteredCategories, setFilteredCategories] = React.useState<
    { id: string; title: string; type: string }[]
  >([]);
  const [catType, setCatType] = React.useState<
    { id: string; title: string; type: string }[]
  >([
    { id: "1", title: "Expense", type: "Expense" },
    { id: "2", title: "Income", type: "Income" },
  ]);
  const [selectedType, setSelectedType] = React.useState("");
  const [form, setForm] = React.useState({
    name: name || "",
    amount: amount ? Number(amount) : 0.0,
    type: "",
    category: "",
    image: "",
    account: "",
  });
  const [icon, setIcon] = React.useState<React.ReactElement | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [currency, setCurrency] = React.useState("MAD");

  const filterCategories = (categories: any, type: string) => {
    return categories.filter((category: any) => category.type === type);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories();
      if (categories) {
        setAllCategories(categories);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchAccounts = async () => {
      const accounts = await getAccounts();
      if (getProfile) {
        await getProfile()
          .then((res) => {
            if (res) {
              setCurrency(res.currency);
            }
          })
          .catch((err) => {
            console.log("Error fetching profile:", err);
          });
      }
      if (accounts) {
        const formattedAccounts = accounts.map(
          (account: any, index: number) => ({
            id: account.id.toString(),
            title: `${account.type} ${account.title}`,
            type: account.type,
            balance: account.balance,
          })
        );
        setAllAccounts(formattedAccounts);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    const filteredCategories = filterCategories(allCategories, selectedType);
    setFilteredCategories(filteredCategories);
  }, [selectedType]);

  const handleSubmit = () => {
    if (
      !form.name ||
      !form.amount ||
      !form.type ||
      !form.category ||
      !form.account
    ) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);

    const post = async () => {
      setLoading(true);

      const amount = Number(form.amount);
      if (isNaN(amount) || amount <= 0) {
        alert("Invalid amount");
        setLoading(false);
        return;
      }

      try {
        // ✅ Fetch the current balance
        const currentBalance = await getBalanceById(form.account);

        console.log("Current Balance:", currentBalance);
        console.log("Transaction Amount:", amount);

        if (
          currentBalance === null ||
          currentBalance === undefined ||
          isNaN(currentBalance)
        ) {
          alert("Failed to fetch balance. Try again.");
          setLoading(false);
          return;
        }

        const isIncome = form.type.toLowerCase() === "income";
        const newBalance = isIncome
          ? currentBalance + amount
          : currentBalance - amount;

        console.log("New Balance After Transaction:", newBalance);

        // ✅ Prevent transactions if insufficient funds
        if (!isIncome && newBalance < 0) {
          alert("Insufficient balance for this transaction");
          setLoading(false);
          return;
        }

        // ✅ Proceed with transaction creation **only if balance is sufficient**
        const data = await createTransaction({
          description: form.name,
          amount: form.amount,
          type: form.type,
          category: form.category,
          image: form.image,
          accountId: form.account,
        });

        if (data?.status !== 201) {
          alert("Transaction creation failed");
          setLoading(false);
          return;
        }

        // ✅ Update balance
        const updateWallet = await updateBalance(
          form.account,
          amount,
          isIncome
        );

        if (updateWallet === 200) {
          console.log("Wallet updated successfully");
        } else {
          console.log("Wallet update failed");
        }

        setForm({
          name: "",
          amount: 0,
          type: "",
          category: "",
          image: "",
          account: "",
        });
        setIcon(null);
        alert("Transaction recorded successfully");
        router.canGoBack() && router.back();
      } catch (error) {
        console.error("Error processing transaction:", error);
        alert("Something went wrong, please try again");
      } finally {
        setLoading(false);
      }
    };

    post();
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.banner, { backgroundColor: colors.primary, zIndex: 1 }]}
      ></View>
      <View style={[styles.headingContainer, { zIndex: 1 }]}>
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: colors.background }]}
          onPress={() => router.canGoBack() && router.back()}
        >
          <Ionicons name="chevron-back-sharp" size={18} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.heading, { color: colors.text, fontSize: 20 }]}>
          Add Transaction
        </Text>
        <View
          style={[styles.navBtn, { backgroundColor: "transparent" }]}
        ></View>
      </View>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-100}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            top: -130,
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        >
          <View style={[styles.content]}>
            <View
              style={[
                styles.imageContainer,
                {
                  backgroundColor: colors.background,
                  borderColor: dark ? "#cccccc" + "50" : "#cccccc",
                  shadowColor: colors.primary,
                  shadowOffset: {
                    width: 0,
                    height: 0,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 1.0,
                  elevation: 1,

                  borderWidth: 1,
                },
              ]}
            >
              {icon}
            </View>

            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: dark ? "#1c1c1c" : "rgb(255, 255, 255)",
                  zIndex: -3,

                  borderWidth: 1,
                  borderColor: dark ? "" : "#cccccc",
                },
              ]}
            >
              <Text style={[styles.label, { color: colors.text }]}>Name</Text>
              <View
                style={[
                  styles.input,
                  { borderColor: dark ? "#cccccc" + "50" : "#cccccc" },
                ]}
              >
                <TextInput
                  style={[styles.amount, { color: colors.text }]}
                  placeholder="Name of transaction"
                  value={form.name}
                  onChange={(e) => {
                    setForm({ ...form, name: e.nativeEvent.text });
                  }}
                  onEndEditing={(e) => {
                    const { name, element } = handleImageRender(
                      e.nativeEvent.text
                    );
                    setIcon(element || null);
                    if (name === "default") {
                      setForm({ ...form, name: e.nativeEvent.text, image: "" });
                      return;
                    }
                    setForm({ ...form, name: e.nativeEvent.text, image: name });
                  }}
                  placeholderTextColor={colors.text + "50"}
                />
              </View>
              <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
              <View
                style={[
                  styles.input,
                  {
                    borderColor: dark ? "#cccccc" + "50" : "#cccccc",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.currency,
                    { color: colors.text, opacity: 0.8, fontSize: 16 },
                  ]}
                >
                  {currencySymbol[currency]}
                </Text>

                <TextInput
                  style={[styles.amount, { color: colors.text }]}
                  placeholder="0.00"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: parseFloat(e.nativeEvent.text) })
                  }
                  placeholderTextColor={colors.text + "50"}
                  keyboardType="numeric"
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Transaction type
                  </Text>
                  <MyPicker
                    label={"Select Type"}
                    data={catType}
                    onSelectType={(type: string) => {
                      setSelectedType(type);

                      if (icon === null) {
                        const { element } = handleImageRender(type);
                        setIcon(element || null);
                        setForm({
                          ...form,
                          type: type,
                          image: type.toLowerCase(),
                        });
                      } else {
                        setForm({ ...form, type: type });
                      }
                    }}
                    onSelectId={() => ""}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    Category
                  </Text>

                  <MyPicker
                    label={
                      selectedType
                        ? "Select Category"
                        : "Please select Type first"
                    }
                    data={filteredCategories}
                    onSelectType={() => ""}
                    onSelectId={(id: string) =>
                      setForm({ ...form, category: id })
                    }
                    disabled={!selectedType}
                  />
                </View>
              </View>
              <View>
                <Text style={[styles.label, { color: colors.text }]}>
                  Account
                </Text>
                <MyPicker
                  label="Choose Transaction Account"
                  data={allAccounts}
                  onSelectType={(type: string) => {
                    setForm({ ...form, account: type });
                  }}
                  onSelectId={(type: string) =>
                    setForm({ ...form, account: type })
                  }
                />
              </View>

              <View
                style={{
                  marginTop: 20,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {loading ? (
                  <LoadingSpinner color={colors.primary} />
                ) : (
                  <PrimaryBtn
                    title="Record Transaction"
                    onPress={handleSubmit}
                  />
                )}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {},
  imageContainer: {
    height: 200,
    width: 200,
    borderRadius: 5,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    paddingTop: 120,
    paddingLeft: 20,
    paddingRight: 20,

    paddingBottom: 200,
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -80,
  },
  label: {
    fontSize: 14,
    opacity: 0.6,
    fontFamily: "Poppins-Regular",
    left: 10,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  currency: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
  },
  amount: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    flex: 1,
    marginLeft: 5,
  },
  headingContainer: {
    position: "absolute",
    top: 60,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: 20,
  },
  banner: {
    width: "100%",
    height: 250,
    backgroundColor: "#f0f0f0",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",

    fontFamily: "Poppins-Bold",
  },
  navBtn: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 50,
  },
});

export default RecordTransactionScreen;
