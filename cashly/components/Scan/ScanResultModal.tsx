// import React, { useState, useEffect } from "react";
// import {
//   Modal,
//   View,
//   Text,
//   TextInput,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   ScrollView,
// } from "react-native";
// import { useTheme } from "@react-navigation/native";
// import { useRouter } from "expo-router";

// interface ScanResultModalProps {
//   visible: boolean;
//   onClose: () => void;
//   scanResult: string;
//   onSave: (data: { name: string; amount: string }) => void;
// }

// const ScanResultModal: React.FC<ScanResultModalProps> = ({
//   visible,
//   onClose,
//   scanResult,
//   onSave,
// }) => {
//   const { colors } = useTheme();
//   const [name, setName] = useState("");
//   const [amount, setAmount] = useState("");
//   const router = useRouter();

//   const [form, setForm] = React.useState({
//     name: "",
//     amount: "0",
//   });

//   const handleSave = () => {
//     onSave({ name, amount });
//     setForm({
//       name,
//       amount,
//     });
//     router.push({
//       pathname: "/RecordTransaction",
//       params: {
//         name: name,
//         amount: amount,
//       },
//     });
//     onClose();
//   };

//   return (
//     <Modal visible={visible} animationType="slide" transparent={true}>
//       <View style={styles.modalContainer}>
//         <KeyboardAvoidingView
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={[styles.modalContent, { backgroundColor: colors.background }]}
//         >
//           <ScrollView>
//             <Text style={[styles.label, { color: colors.text }]}>
//               Scan Result
//             </Text>
//             <TextInput
//               style={[styles.textarea, { color: colors.text }]}
//               value={scanResult}
//               editable={false}
//               multiline
//             />

//             <Text style={[styles.label, { color: colors.text }]}>Name</Text>
//             <TextInput
//               style={[styles.input, { color: colors.text }]}
//               placeholder="Name of transaction"
//               value={name}
//               onChangeText={setName}
//             />

//             <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
//             <TextInput
//               style={[styles.input, { color: colors.text }]}
//               placeholder="Amount"
//               value={amount}
//               onChangeText={setAmount}
//               keyboardType="numeric"
//             />
//             <View
//               style={{ flexDirection: "row", justifyContent: "space-between" }}
//             >
//               <TouchableOpacity
//                 onPress={handleSave}
//                 style={[styles.button, { backgroundColor: colors.primary }]}
//               >
//                 <Text style={{ color: colors.text, fontSize: 16 }}>Next</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 onPress={onClose}
//                 style={[
//                   styles.button,
//                   { backgroundColor: colors.notification },
//                 ]}
//               >
//                 <Text style={{ color: colors.text, fontSize: 16 }}>Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </ScrollView>
//         </KeyboardAvoidingView>
//       </View>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     width: "90%",
//     backgroundColor: "white",
//     borderRadius: 10,
//     padding: 20,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 15,
//   },
//   textarea: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     height: 100,
//     marginBottom: 15,
//   },
//   button: {
//     backgroundColor: "#ccc",
//     height: 40,
//     justifyContent: "center",
//     alignContent: "center",
//     marginBottom: 30,
//     borderRadius: 5,
//     width: "45%",
//     alignItems: "center",
//   },
// });

// export default ScanResultModal;

import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";

interface ScanResultModalProps {
  visible: boolean;
  onClose: () => void;
  scanResult: string;
  onSave: (data: { name: string; amount: string }) => void;
}

const ScanResultModal: React.FC<ScanResultModalProps> = ({
  visible,
  onClose,
  scanResult,
  onSave,
}) => {
  const { colors } = useTheme();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!scanResult) return;

    const lower = scanResult.toLowerCase();

    // Extract name or nom
    const nameMatch = lower.match(/(?:name|nom)[:\-]?\s*(.+)/);
    if (nameMatch && nameMatch[1]) {
      const extractedName = nameMatch[1].split("\n")[0].trim();
      setName(extractedName);
    }

    // Extract amount or montant
    const amountMatch = lower.match(/(?:amount|montant)[:\-]?\s*([\d,.]+)/);
    if (amountMatch && amountMatch[1]) {
      const extractedAmount = amountMatch[1].replace(",", ".").trim();
      setAmount(extractedAmount);
    }
  }, [scanResult]);

  const handleSave = () => {
    onSave({ name, amount });
    router.push({
      pathname: "/RecordTransaction",
      params: {
        name: name,
        amount: amount,
      },
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[styles.modalContent, { backgroundColor: colors.background }]}
        >
          <ScrollView>
            <Text style={[styles.label, { color: colors.text }]}>
              Scan Result
            </Text>
            <TextInput
              style={[styles.textarea, { color: colors.text }]}
              value={scanResult}
              editable={false}
              multiline
            />

            <Text style={[styles.label, { color: colors.text }]}>Name</Text>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Name of transaction"
              value={name}
              onChangeText={setName}
            />

            <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.button, { backgroundColor: colors.primary }]}
              >
                <Text style={{ color: colors.text, fontSize: 16 }}>Next</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onClose}
                style={[
                  styles.button,
                  { backgroundColor: colors.notification },
                ]}
              >
                <Text style={{ color: colors.text, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    height: 100,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#ccc",
    height: 40,
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 30,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
});

export default ScanResultModal;
