import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import React, { useEffect } from "react";
import { useTheme } from "@react-navigation/native";
import {
  getCategories,
  getAccounts,
  createTransaction,
} from "../constants/functions";
import MyPicker from "../components/Buttons/Picker";
import PrimaryBtn from "../components/Buttons/PrimaryBtn";
import { handleImageRender } from "../constants/handleImageRender";
import { useNavigation } from "expo-router";
import LoadingSpinner from "../components/LoadingSpinner";

const RecordTransactionScreen = () => {
  const { colors, dark } = useTheme();
  const router = useNavigation();
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
    name: "",
    amount: 0,
    type: "",
    category: "",
    image: "",
    account: "",
  });
  const [icon, setIcon] = React.useState<React.ReactElement | null>(null);
  const [loading, setLoading] = React.useState(false);

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
      const data = await createTransaction({
        description: form.name,
        amount: form.amount,
        type: form.type,
        category: form.category,
        image: form.image,
        accountId: form.account,
      });
      if (data?.status === 201) {
        setLoading(false);
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
        router.canGoBack() && router.goBack();
      }
    };
    post();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View
          style={[
            styles.imageContainer,
            {
              backgroundColor: dark ? "#cccccc" + "10" : "#cccccc" + "50",
            },
          ]}
        >
          {icon}
        </View>
        <View style={styles.inputContainer}>
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
                const { name, element } = handleImageRender(e.nativeEvent.text);
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
            <Text style={[styles.currency, { color: colors.text }]}>$</Text>
            <TextInput
              style={[styles.amount, { color: colors.text }]}
              placeholder="0.00"
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
                    setForm({ ...form, type: type, image: type.toLowerCase() });
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
                  selectedType ? "Select Category" : "Please select Type first"
                }
                data={filteredCategories}
                onSelectType={() => ""}
                onSelectId={(id: string) => setForm({ ...form, category: id })}
                disabled={!selectedType}
              />
            </View>
          </View>
          <View>
            <Text style={[styles.label, { color: colors.text }]}>Account</Text>
            <MyPicker
              label="Choose Transaction Account"
              data={allAccounts}
              onSelectType={(type: string) => {
                setForm({ ...form, account: type });
              }}
              onSelectId={(type: string) => setForm({ ...form, account: type })}
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
              <PrimaryBtn title="Record Transaction" onPress={handleSubmit} />
            )}
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
    height: 200,
    width: 200,
    borderRadius: 5,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    marginTop: 20,
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
});

export default RecordTransactionScreen;
