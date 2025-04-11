import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";

interface MyPickerProps {
  label: string;
  onSelectType: (type: string) => void;
  onSelectId: (id: string) => void;
  disabled?: boolean;
  data: { id: string; title: string; type: string; balance: number | null }[];
}

const MyPicker = ({
  data,
  label,
  onSelectType,
  onSelectId,
  disabled = false,
}: MyPickerProps) => {
  const [selectedValue, setSelectedValue] = useState(label);
  const [isVisible, setIsVisible] = useState(false);
  const { colors, dark } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.btn,
          {
            backgroundColor: dark ? "#cccccc" + "10" : "#cccccc" + "50",
          },
        ]}
        disabled={disabled}
        onPress={() => setIsVisible(!isVisible)}
      >
        <Text style={{ color: colors.text }}>{selectedValue}</Text>
      </TouchableOpacity>
      {isVisible ? (
        <Picker
          selectedValue={selectedValue}
          onValueChange={(itemValue) => {
            const selectedItem = data.find((item) => item.title === itemValue);
            if (selectedItem) {
              setSelectedValue(
                selectedItem.balance !== null && selectedItem.balance >= 0
                  ? selectedItem.title + " Bal:" + selectedItem?.balance
                  : selectedItem.title
              );
              onSelectType(selectedItem.type);
              onSelectId(selectedItem.id);
            }
            setIsVisible(false);
          }}
          itemStyle={styles.pickerContent}
        >
          {data.map((item, index) => (
            <Picker.Item
              key={item.id}
              label={
                item.balance !== null && item.balance >= 0
                  ? item.title + " Bal: " + item?.balance
                  : item.title
              }
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
    borderRadius: 5,
    padding: 10,
  },
  pickerContent: {
    top: -25,
    fontSize: 14,
    height: 100,
  },
});

export default MyPicker;

// import React, { useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { useTheme } from "@react-navigation/native";
// import { Picker } from "@react-native-picker/picker";

// interface MyPickerProps {
//   label: string;
//   onSelectType: (type: string) => void;
//   onSelectId: (id: string) => void;
//   disabled?: boolean;
//   data: { id: string; title: string; type: string }[];
// }

// const MyPicker = ({
//   data,
//   label,
//   onSelectType,
//   onSelectId,
//   disabled = false,
// }: MyPickerProps) => {
//   const [selectedValue, setSelectedValue] = useState(label);
//   const [isVisible, setIsVisible] = useState(false);
//   const { colors, dark } = useTheme();

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={[
//           styles.btn,
//           {
//             backgroundColor: dark ? "#cccccc" + "10" : "#cccccc" + "50",
//           },
//         ]}
//         disabled={disabled}
//         onPress={() => setIsVisible(!isVisible)}
//       >
//         <Text style={{ color: colors.text }}>{selectedValue}</Text>
//       </TouchableOpacity>
//       {isVisible ? (
//         <Picker
//           selectedValue={selectedValue}
//           onValueChange={(itemValue) => {
//             const selectedItem = data.find((item) => item.title === itemValue);
//             if (selectedItem) {
//               setSelectedValue(selectedItem.title);
//               onSelectType(selectedItem.type);
//               onSelectId(selectedItem.id);
//             }
//             setIsVisible(false);
//           }}
//           itemStyle={styles.pickerContent}
//         >
//           {data.map((item, index) => (
//             <Picker.Item key={item.id} label={item.title} value={item.title} />
//           ))}
//         </Picker>
//       ) : null}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 10,
//     marginBottom: 10,
//     // width: "100%",
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   picker: {
//     height: 50,
//     // width: "100%",
//   },
//   selectedText: {
//     marginTop: 10,
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   btn: {
//     height: 50,
//     justifyContent: "center",
//     borderRadius: 5,
//     padding: 10,
//   },
//   pickerContent: {
//     top: -25,
//     fontSize: 14,
//     height: 100,
//   },
// });

// export default MyPicker;
