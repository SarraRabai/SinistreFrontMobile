import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import AppTextInput from "./AppTextInput";
import defaultStyles from "../config/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const AjoutVehiculeModal = ({ visible, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    brand: "",
    numeroSerie: "",
    numeroMatricule: "",
    type: "TU",
    numeroContrat: "",
    assure: "",
    agence: "",
    insuranceStartDate: new Date(),
    insuranceEndDate: new Date(),
  });

  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    onSubmit(form);
    setForm({
      brand: "",
      numeroSerie: "",
      numeroMatricule: "",
      type: "TU",
      numeroContrat: "",
      assure: "",
      agence: "",
      insuranceStartDate: new Date(),
      insuranceEndDate: new Date(),
    });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.header}>
              <Text style={styles.title}>Ajouter un véhicule</Text>
            </View>

            <AppTextInput
              icon="car"
              placeholder="Brand"
              onChangeText={(text) => handleChange("brand", text)}
            />
            <AppTextInput
              icon="car"
              placeholder="Numéro de série"
              onChangeText={(text) => handleChange("numeroSerie", text)}
            />
            <AppTextInput
              icon="car"
              placeholder="Numéro matricule"
              onChangeText={(text) => handleChange("numeroMatricule", text)}
            />
            <AppTextInput
              icon="car"
              placeholder="Type"
              value="TU"
              editable={false}
            />
            <AppTextInput
              icon="car"
              placeholder="Numéro contrat"
              onChangeText={(text) => handleChange("numeroContrat", text)}
            />
            <AppTextInput
              icon="car"
              placeholder="Assuré"
              onChangeText={(text) => handleChange("assure", text)}
            />
            <AppTextInput
              icon="car"
              placeholder="agence"
              onChangeText={(text) => handleChange("agence", text)}
            />
            <View style={styles.viewDate}>
              <MaterialCommunityIcons name="calendar" size={20} />
              <TouchableOpacity onPress={() => setShowStartDate(true)}>
                <Text style={styles.dateButton}>
                  Début assurance:{" "}
                  {form.insuranceStartDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>

            {showStartDate && (
              <DateTimePicker
                value={form.insuranceStartDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowStartDate(false);
                  if (selectedDate)
                    handleChange("insuranceStartDate", selectedDate);
                }}
              />
            )}

            <View style={styles.viewDate}>
              <MaterialCommunityIcons name="calendar" size={20} />
              <TouchableOpacity onPress={() => setShowEndDate(true)}>
                <Text style={styles.dateButton}>
                  Fin assurance: {form.insuranceEndDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            </View>

            {showEndDate && (
              <DateTimePicker
                value={form.insuranceEndDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowEndDate(false);
                  if (selectedDate)
                    handleChange("insuranceEndDate", selectedDate);
                }}
              />
            )}
            <TouchableOpacity
              style={styles.AjoutertButton}
              onPress={handleSubmit}
            >
              <Text style={styles.textAjouter}>Ajouter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.AnnulerButton} onPress={onClose}>
              <Text style={styles.textAnnuler}>Annuler</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default AjoutVehiculeModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 30,
    maxHeight: "90%",
  },
  header: {
    alignItems: "center",
    marginVertical: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },

  viewDate: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginVertical: 5,
  },

  dateButton: {
    padding: 10,

    borderRadius: 5,
    marginBottom: 10,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  AjoutertButton: {
    backgroundColor: "#de6442",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 10,
  },

  AnnulerButton: {
    backgroundColor: "#007bff",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 10,
  },

  textAjouter: {
    color: "#fff",
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  textAnnuler: {
    color: "#fff",
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});
