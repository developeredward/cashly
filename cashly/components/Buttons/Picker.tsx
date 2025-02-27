import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

interface MyPickerProps {
  label: string;
  onSelectType: (type: string) => void;
  data: { id: string; title: string; type: string }[];
}

const MyPicker = ({ data, label, onSelectType }: MyPickerProps) => {
  const [selectedValue, setSelectedValue] = useState(label);
  const [isVisible, setIsVisible] = useState(false);
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => setIsVisible(!isVisible)}
      >
        <Text style={{ color: colors.text }}>{selectedValue}</Text>
      </TouchableOpacity>
      {isVisible ? (
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => {
            setSelectedValue(itemValue);
            onSelectType(itemValue);
            setIsVisible(false);
          }}
          itemStyle={styles.pickerContent}
        >
          {data.map((item, index) => (
            <Picker.Item
              key={item.id}
              style={styles.pickerContent}
              fontFamily="Poppins"
              label={item.title}
              value={item.title}
            />
          ))}
        </Picker>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    // width: "100%",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    // width: "100%",
  },
  selectedText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  btn: {
    height: 50,
    justifyContent: "center",
    backgroundColor: "#cccccc" + "10",
    borderRadius: 5,
    padding: 10,
  },
  pickerContent: {
    fontSize: 14,
    height: 100,
  },
});

export default MyPicker;
