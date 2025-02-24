import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

interface CardsProps {
  color: string;
  background: string;
}

const cardImages = {
  card1: require("../../assets/images/card1.jpg"),
  card2: require("../../assets/images/card2.jpg"),
};

const Cards = ({ color, background }: CardsProps) => {
  const [cards, setCards] = useState([
    {
      id: 1,
      cardNumber: "**** 1234",
      background: cardImages.card1,
      cardType: "visa",
    },
    {
      id: 2,
      cardNumber: "**** 5678",
      background: cardImages.card2,
      cardType: "mastercard",
    },
  ]);
  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.cardTitle, { color: color }]}>Cards</Text>
      </View>
      <View style={styles.cards}>
        <View>
          <TouchableOpacity
            style={[styles.addCard, { backgroundColor: background + "10" }]}
          >
            <AntDesign name="pluscircle" size={24} color={background} />
          </TouchableOpacity>
        </View>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card,
              { backgroundColor: card.background, marginRight: 10 },
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
                    card.id === 1
                      ? "rgba(164, 164, 164, 0.3)"
                      : "rgba(0,0,0,0.3)",
                  borderRadius: 10,
                }}
              >
                <Text style={[styles.cardDescription]}>{card.cardNumber}</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>
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
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    position: "absolute",
    bottom: 4,
    left: 4,
    color: "#fff",
    zIndex: 2,
  },
});

export default Cards;
