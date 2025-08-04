import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";

const CustomPicker = ({ selectedValue, onValueChange, items }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (value) => {
    onValueChange(value);
    setIsVisible(false);
  };

  return (
    <View>
      {/* Bouton pour ouvrir la modale */}
      <TouchableOpacity
        style={styles.pickerTrigger}
        onPress={() => setIsVisible(true)}
      >
        <Text
          style={[
            styles.pickerTriggerText,
            selectedValue && styles.selectedText, // Appliquer le style si une valeur est sélectionnée
          ]}
        >
          {selectedValue || "Sélectionnez une option"}
        </Text>
      </TouchableOpacity>

      {/* Modale pour afficher la liste des options */}
      <Modal isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Sélectionnez une option</Text>
          <FlatList
            data={items}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.pickerItem}
                onPress={() => handleSelect(item.value)}
              >
                <Text style={styles.pickerItemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerTrigger: {
    width: "140%",
  },
  pickerTriggerText: {
    fontSize: 16,
    color: "#ccc", // Couleur par défaut (gris clair)
  },
  selectedText: {
    color: "#000", // Couleur du texte lorsqu'une valeur est sélectionnée (noir)
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    maxHeight: Dimensions.get("window").height * 0.6,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  pickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  pickerItemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default CustomPicker;
