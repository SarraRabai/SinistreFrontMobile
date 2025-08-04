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

const CustomPlacePicker = ({ selectedValue, onValueChange, items }) => {
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
        <Text style={styles.pickerTriggerText}>
          {selectedValue || "Sélectionnez un lieu"}
        </Text>
      </TouchableOpacity>

      {/* Modale pour afficher la liste des lieux */}
      <Modal isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Sélectionnez un lieu</Text>
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
            style={styles.flatList} // Appliquer un style à la FlatList
            contentContainerStyle={styles.flatListContent} // Style pour le contenu de la FlatList
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerTrigger: {
    width: "150%",

    height: "100%",
    alignContent: "center",

    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerTriggerText: {
    fontSize: 16,
    color: "#333",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    maxHeight: Dimensions.get("window").height * 0.8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  flatList: {
    flexGrow: 1,
  },
  flatListContent: {
    paddingBottom: 16,
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

export default CustomPlacePicker;
