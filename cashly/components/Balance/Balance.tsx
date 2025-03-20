import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { getBalance } from "../../constants/functions";

interface BalanceProps {
  color: string;
}
const currencySymbol: { [key: string]: string } = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  RUB: "₽",
  AUD: "A$",
  CAD: "C$",
  MXN: "Mex$",
  KRW: "₩",
  BRL: "R$",
  TRY: "₺",
  ZAR: "R",
  IDR: "Rp",
  CHF: "Fr",
  SAR: "﷼",
  NGN: "₦",
  AED: "د.إ",
  SEK: "kr",
  PKR: "₨",
  PLN: "zł",
  PHP: "₱",
  MYR: "RM",
  HUF: "Ft",
  CZK: "Kč",
  CLP: "CLP$",
  DKK: "kr",
  NOK: "kr",
  ILS: "₪",
  EGP: "E£",
  KES: "KSh",
  VND: "₫",
  IQD: "ع.د",
  COP: "COL$",
  RON: "L",
  UAH: "₴",
  UZS: "UZS",
  KZT: "₸",
  TWD: "NT$",
  THB: "฿",
  GHS: "GH₵",
  QAR: "﷼",
  CRC: "₡",
  HRK: "kn",
  DZD: "DA",
  MKD: "ден",
  BGN: "лв",
  LKR: "Rs",
  BDT: "৳",
  MAD: "DH",
  ETB: "Br",
  LBP: "ل.ل",
  BOB: "Bs",
  CUP: "₱",
  PYG: "₲",
  SDG: "ج.س.",
  SOS: "S",
  TZS: "TSh",
  UGX: "USh",
  GEL: "₾",
  AMD: "֏",
  AFN: "؋",
  XAF: "FCFA",
  XOF: "CFA",
};

const Balance = ({ color }: BalanceProps) => {
  const [balance, setBalance] = useState<number>(1900000.03);
  const [currency, setCurrency] = useState<string>("USD");
  const [isBalanceVisible, setIsBalanceVisible] = useState<boolean>(true);

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getBalance();
      // console.log(balance);
      if (!balance) return;
      setBalance(balance?.totalBalance ?? 0);
      setCurrency(balance?.currency);
    };
    fetchBalance();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={[styles.title, { color: color + "60" }]}>
          Wallet Balance
        </Text>
      </View>
      <View style={styles.balanceContainer}>
        <View>
          <Text style={[styles.balance, { color: color }]}>
            {isBalanceVisible
              ? currencySymbol[currency] +
                " " +
                (balance
                  ? balance.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
                  : "0.00")
              : "*****"}{" "}
          </Text>
        </View>
        <TouchableOpacity onPress={toggleBalanceVisibility} style={styles.icon}>
          <Ionicons
            name={isBalanceVisible ? "eye" : "eye-off"}
            size={24}
            color={color}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins-Regular",
  },
  balanceContainer: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  balance: {
    fontSize: 50,
    fontFamily: "Poppins-Bold",
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Balance;
