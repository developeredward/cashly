import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Modal,
  Animated,
} from "react-native";
import React, { useState, useRef } from "react";
import { AntDesign } from "@expo/vector-icons";
import { getAccounts } from "../../constants/functions";
import { currencySymbol } from "../../constants/Currencies";
import { useTheme } from "@react-navigation/native";

interface CardsProps {
  color: string;
  background: string;
}

const cardImages = {
  card1: require("../../assets/images/card1.jpg"),
  card2: require("../../assets/images/card2.jpg"),
};

const Cards = ({ color, background }: CardsProps) => {
  const { colors } = useTheme();
  const [cards, setCards] = useState<
    {
      id: string;
      balance: string;
      background: any;
      accountType: string;
      accountName: string;
    }[]
  >([]);
  const [selectedCard, setSelectedCard] = useState<{
    id: string;
    balance: string;
    background: any;
    accountType: string;
    accountName: string;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchAccounts = async () => {
    const accounts = await getAccounts();
    if (!accounts) return;
    setCards(
      accounts.map((account) => ({
        id: account.id,
        balance: String(account.balance),
        background: cardImages[account.title === "Savings" ? "card1" : "card2"],
        accountType: account.type,
        accountName: account.title,
      }))
    );
  };

  React.useEffect(() => {
    fetchAccounts();
  }, []);

  interface Card {
    id: string;
    balance: string;
    background: any;
    accountType: string;
    accountName: string;
  }

  const handleCardPress = (card: Card): void => {
    setSelectedCard(card);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.cardTitle, { color: color }]}>Accounts</Text>
      </View>
      <View style={styles.cards}>
        <View>
          <TouchableOpacity
            style={[styles.addCard, { backgroundColor: background + "10" }]}
          >
            <AntDesign name="pluscircle" size={24} color={background} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.cards, { paddingRight: 80 }]}
          style={{ marginLeft: 10 }}
        >
          {cards.map((card, index) => (
            <TouchableOpacity
              key={card.id}
              onPress={() => handleCardPress(card)}
            >
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: card.background,
                  },
                  { zIndex: cards.length - index, marginLeft: index * -10 },
                ]}
              >
                <ImageBackground
                  source={card.background}
                  style={{ width: "100%", height: "100%" }}
                  imageStyle={{ borderRadius: 10 }}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "flex-end",
                      backgroundColor:
                        card.background === cardImages.card1
                          ? "rgba(33, 33, 33, 0.3)"
                          : "rgba(0,0,0,0.3)",
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={[
                        styles.cardDescription,
                        {
                          fontSize: 8,
                          fontFamily: "Poppins-Bold",
                          position: "absolute",
                          top: 10,
                          left: 4,
                        },
                      ]}
                    >
                      {card.accountName + " " + "Account"}
                    </Text>
                    <View>
                      <View>
                        <Text style={[styles.cardDescription]}>
                          {card.accountType}
                        </Text>
                      </View>
                      <View
                        style={{ position: "relative", right: -50, bottom: 0 }}
                      >
                        <Text style={[styles.cardDescription]}>
                          {currencySymbol["MAD"]} {card.balance}
                        </Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background, borderColor: color },
              { borderWidth: 1 },
              { borderRadius: 10 },
              { padding: 20 },
              { width: "80%" },
              { alignItems: "center" },
              { justifyContent: "center" },
              { shadowColor: "black" },
              { shadowOffset: { width: 0, height: 0 } },
              { shadowOpacity: 0.25 },
              { shadowRadius: 10 },
              { elevation: 2 },
            ]}
          >
            {selectedCard && (
              <>
                <Text style={[styles.modalTitle, { color: color }]}>
                  {selectedCard.accountName} Account
                </Text>
                <Text style={[styles.modalText, { color: color }]}>
                  Account Type: {selectedCard.accountType}
                </Text>
                <Text style={[styles.modalText, { color: color }]}>
                  Balance: {selectedCard.balance} {currencySymbol["MAD"]}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cards: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  card: {
    width: 100,
    height: 60,
    backgroundColor: "#081616",
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    position: "relative",
  },
  addCard: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
    margin: 10,
  },
  cardDescription: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    position: "absolute",
    bottom: 4,
    left: 4,
    color: "#fff",
    zIndex: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#d9534f",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Cards;
