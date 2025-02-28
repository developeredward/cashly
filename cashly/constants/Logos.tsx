import React from "react";
import {
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
  FontAwesome,
  Feather,
} from "@expo/vector-icons";

export interface LogosProps {
  netflix: JSX.Element;
  amazon: JSX.Element;
  apple: JSX.Element;
  google: JSX.Element;
  spotify: JSX.Element;
  wifi: JSX.Element;
  bus: JSX.Element;
  salary: JSX.Element;
  income?: JSX.Element;
  expense?: JSX.Element;
}

export const logos: LogosProps = {
  netflix: <MaterialCommunityIcons name="netflix" size={24} color="red" />,
  amazon: <AntDesign name="amazon" size={24} color="black" />,
  apple: <AntDesign name="apple1" size={24} color="black" />,
  google: <AntDesign name="google" size={24} color="#4185F2" />,
  spotify: <Entypo name="spotify" size={24} color="#31D165" />,
  wifi: <AntDesign name="wifi" size={24} color="black" />,
  bus: <FontAwesome name="bus" size={24} color="black" />,
  salary: <MaterialCommunityIcons name="bank" size={24} color="#F4CB52" />,
  income: <Feather name="arrow-down-left" size={24} color="#31D165" />,
  expense: <Feather name="arrow-up-right" size={24} color="#F4CB52" />,
};

export const logosPreview: LogosProps = {
  netflix: <MaterialCommunityIcons name="netflix" size={200} color="red" />,
  amazon: <AntDesign name="amazon" size={200} color="black" />,
  apple: <AntDesign name="apple1" size={200} color="black" />,
  google: <AntDesign name="google" size={200} color="#4185F2" />,
  spotify: <Entypo name="spotify" size={200} color="#31D165" />,
  wifi: <AntDesign name="wifi" size={200} color="black" />,
  bus: <FontAwesome name="bus" size={200} color="black" />,
  salary: <MaterialCommunityIcons name="bank" size={200} color="#F4CB52" />,
  income: <Feather name="arrow-down-left" size={200} color="#31D165" />,
  expense: <Feather name="arrow-up-right" size={200} color="#F4CB52" />,
};
