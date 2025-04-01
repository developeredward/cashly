import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  TextInput,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getTransactions } from "../../services/api/wallet";
import { formatDate } from "../../constants/formateDate";
import { useRouter, useFocusEffect } from "expo-router";
import { currencySymbol } from "../../constants/Currencies";
import LoadingSpinner from "../LoadingSpinner";

interface TransactionsSheetProps {
  color: string;
  primary: string;
  background: string;
  title: string;
  type: string;
}

interface FilterTransactionsProps {
  transactions: any[];
  filter: string;
}

interface Transaction {
  id: string;
  title: string;
  dateTime: string;
  amount: number;
  type: string;
  img: string;
}

import { logos, logosPreview, LogosProps } from "../../constants/Logos";

const TransactionsSheet = ({
  color,
  primary,
  background,
  title,
  type,
}: TransactionsSheetProps) => {
  const { colors, dark } = useTheme();
  const [transactions, setTransactions] = useState<
    {
      id: string;
      title: string;
      dateTime: string;
      amount: number;
      type: string;
      img: string;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const router = useRouter();

  useFocusEffect(
    React.useCallback(() => {
      const fetchTransactionsData = async () => {
        const data = await getTransactions();
        if (!data) return;
        setLoading(false);
        setTransactions(
          data.map((transaction) => ({
            id: transaction.id,
            title: transaction.title,
            dateTime: formatDate(transaction.dateTime),
            amount: transaction.amount,
            type: transaction.type,
            img: transaction.image,
          }))
        );
      };

      fetchTransactionsData();
    }, [])
  );
  const generateBarcode = () => {
    return Array.from({ length: 50 }, () =>
      Math.random() > 0.5 ? "|" : " "
    ).join("");
  };

  const filterTransactions = ({
    transactions,
    filter,
    searchQuery,
  }: FilterTransactionsProps & { searchQuery: string }) => {
    let filtered = transactions;

    if (filter === "income") {
      filtered = filtered.filter(
        (transaction) => transaction.type === "Income"
      );
    } else if (filter === "expense") {
      filtered = filtered.filter(
        (transaction) => transaction.type === "Expense"
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((transaction) =>
        transaction.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: dark ? "#161616" : background,
          borderTopLeftRadius: type === "recent" ? 30 : 0,
          borderTopRightRadius: type === "recent" ? 30 : 0,
        },
      ]}
    >
      {type === "recent" && (
        <>
          <TouchableOpacity
            style={[
              styles.indicator,
              { backgroundColor: dark ? "#cccccc" + "20" : "#cccccc" + "50" },
            ]}
          ></TouchableOpacity>
          <View style={styles.headContainer}>
            <Text style={[styles.subHeading, { color: color }]}>{title}</Text>

            {type === "recent" && (
              <TouchableOpacity
                onPress={() => {
                  router.push("/Transactions");
                }}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Text
                  style={[styles.subHeading, { color: primary, fontSize: 12 }]}
                >
                  View All
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={12}
                  color={primary}
                />
              </TouchableOpacity>
            )}
          </View>
        </>
      )}

      <SafeAreaView
        style={[styles.content, { marginTop: type === "recent" ? 20 : 0 }]}
      >
        {loading ? (
          <View
            style={{
              top: "30%",
              alignItems: "center",
              height: type === "recent" ? 220 : "100%",
            }}
          >
            <LoadingSpinner color={primary} />
          </View>
        ) : (
          <>
            {transactions.length === 0 ? (
              <View
                style={{
                  top: "30%",
                  alignItems: "center",
                  height: type === "recent" ? 220 : "100%",
                }}
              >
                <Text
                  style={[
                    styles.subHeading,
                    {
                      color: color + "30",
                    },
                  ]}
                >
                  No transactions found
                </Text>
              </View>
            ) : (
              <>
                {type !== "recent" && (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 20,
                        gap: 10,
                      }}
                    >
                      <View
                        style={[
                          styles.searchContainer,
                          {
                            borderColor: dark
                              ? "#cccccc" + "20"
                              : " #cccccc" + "50",
                            borderWidth: 1,
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                          },
                        ]}
                      >
                        <MaterialCommunityIcons
                          name="magnify"
                          size={20}
                          color={dark ? "#cccccc" + "80" : "#000000"}
                          style={{
                            alignSelf: "center",
                          }}
                        />
                        <TextInput
                          value={searchQuery}
                          onChangeText={(text) => {
                            setSearchQuery(text);
                          }}
                          placeholder="Search transactions"
                          placeholderTextColor={
                            dark ? "#cccccc" + "80" : "#000000"
                          }
                          style={{
                            color: color,

                            flex: 1,
                            height: "100%",
                          }}
                        />
                      </View>
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            setFilter(
                              filter === "income" ? "expense" : "income"
                            );
                          }}
                          style={{
                            borderColor: dark
                              ? "#cccccc" + "20"
                              : " #cccccc" + "50",
                            borderWidth: 1,
                            borderRadius: 10,
                            height: 40,
                            width: 40,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <MaterialCommunityIcons
                            name="filter-variant"
                            size={20}
                            color={dark ? "#cccccc" + "80" : "#000000"}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}

                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={
                    type === "recent"
                      ? transactions.slice(0, 10)
                      : filterTransactions({
                          transactions,
                          filter,
                          searchQuery,
                        })
                  }
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={{
                    gap: 20,
                    paddingBottom: 500,
                    flexGrow: 1,
                  }}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedTransaction(item);
                        setModalVisible(true);
                      }}
                      style={styles.list}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <View
                          style={{
                            backgroundColor: dark
                              ? "#cccccc" + "20"
                              : "#cccccc" + "50",
                            padding: 10,
                            borderRadius: 10,
                            marginRight: 10,
                          }}
                        >
                          {logos[item.img as keyof LogosProps]}
                        </View>
                        <View>
                          <Text style={[styles.title, { color: color }]}>
                            {item.title}
                          </Text>
                          <Text
                            style={[styles.subTitle, { color: color + "60" }]}
                          >
                            {item.dateTime}
                          </Text>
                        </View>
                      </View>
                      <View style={{ alignItems: "flex-end" }}>
                        <Text
                          style={[
                            styles.title,
                            {
                              color: color,
                            },
                          ]}
                        >
                          {item.type === "Income" ? "+" : "-"}
                          {item.amount} {currencySymbol["MAD"]}
                        </Text>
                        <Text
                          style={[styles.subTitle, { color: color + "60" }]}
                        >
                          {item.type === "Income" ? "Income" : "Expense"}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  initialNumToRender={5}
                  maxToRenderPerBatch={10}
                  windowSize={5}
                  removeClippedSubviews={true}
                  ListFooterComponent={() => {
                    const filteredTransactions = filterTransactions({
                      transactions,
                      filter,
                      searchQuery,
                    });

                    if (filteredTransactions.length === 0) {
                      return (
                        <View
                          style={{ alignItems: "center", paddingVertical: 10 }}
                        >
                          <Text
                            style={[styles.subTitle, { color: color + "60" }]}
                          >
                            End of Results
                          </Text>
                        </View>
                      );
                    }

                    return (
                      type === "recent" && (
                        <TouchableOpacity
                          style={{
                            marginTop: 20,
                            alignItems: "center",
                            paddingVertical: 10,
                          }}
                          onPress={() => {
                            router.push("/Transactions");
                          }}
                        >
                          <Text
                            style={[
                              styles.subTitle,
                              { color: primary, fontWeight: "bold" },
                            ]}
                          >
                            View All Transactions
                          </Text>
                        </TouchableOpacity>
                      )
                    );
                  }}
                />
              </>
            )}
          </>
        )}
      </SafeAreaView>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.ticketBackground,
                  { backgroundColor: background },
                ]}
              >
                {/* Left Cutout */}
                <View
                  style={[styles.ticketCutOut, { backgroundColor: background }]}
                ></View>
                {/* Right Cutout */}
                <View
                  style={[
                    styles.ticketCutOutRight,
                    { backgroundColor: background },
                  ]}
                ></View>

                {/* Ticket Header with Logo and Name */}
                <View style={styles.ticketHeader}>
                  <View
                    style={[
                      styles.logoContainer,
                      {
                        backgroundColor: dark
                          ? "#cccccc" + "20"
                          : "#cccccc" + "50",
                      },
                    ]}
                  >
                    {logosPreview[selectedTransaction?.img as keyof LogosProps]}
                  </View>
                  <Text style={[styles.modalTitle, { color }]}>
                    {selectedTransaction?.title}
                  </Text>
                </View>

                <View style={styles.ticketDetails}>
                  <Text
                    style={[
                      styles.modalAmount,
                      {
                        color:
                          selectedTransaction?.type === "Income"
                            ? primary
                            : "#FF5555",
                      },
                    ]}
                  >
                    {selectedTransaction?.type === "Income" ? "+" : "-"}
                    {selectedTransaction?.amount} {currencySymbol["MAD"]}
                  </Text>
                </View>

                <View style={styles.dottedLine}></View>

                <View
                  style={[
                    styles.barcodePlaceholder,
                    { backgroundColor: background },
                  ]}
                >
                  <Text style={{ color: color + "80" }}>
                    {generateBarcode()}
                  </Text>
                  <Text style={[styles.modalText, { color: color + "80" }]}>
                    {selectedTransaction?.dateTime}
                  </Text>
                </View>

                {/* <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: "#fff" }}>Close</Text>
                </TouchableOpacity> */}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -1,
    },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
    padding: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  content: {
    marginTop: 20,
  },
  headContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subHeading: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  indicator: {
    width: 30,
    height: 10,
    position: "absolute",
    top: -4,
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  list: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: 10, // Added padding for vertical spacing
    // marginBottom: 10, // Add margin between list items
  },
  title: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  subTitle: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 40,

    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  ticketBackground: {
    width: 300,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    alignItems: "center",
    position: "relative",
  },
  ticketHeader: {
    alignItems: "center",
    marginBottom: 10,
  },
  logoContainer: {
    marginRight: 10,
    borderRadius: 20,
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  ticketDetails: {
    alignItems: "center",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
  },
  modalAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dottedLine: {
    width: "100%",
    borderWidth: 1,
    borderStyle: "dotted",
    borderColor: "gray",
    marginVertical: 10,
  },
  barcodePlaceholder: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#ddd",
    alignItems: "center",
    gap: 10,
    borderRadius: 5,
  },
  // closeButton: {
  //   // marginTop: 20,
  //   backgroundColor: "#FF5555",
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   borderRadius: 10,
  // },
  ticketCutOut: {
    position: "absolute",
    top: "50%",
    left: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
  },
  ticketCutOutRight: {
    position: "absolute",
    top: "50%",
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "white",
  },
});

export default TransactionsSheet;
