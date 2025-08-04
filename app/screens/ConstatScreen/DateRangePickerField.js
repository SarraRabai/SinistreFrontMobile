import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons"; // Pour l'icône de flèche
import moment from "moment";
import "moment/locale/fr"; // Importer les locales françaises

moment.locale("fr");

const DateRangePickerField = ({
  label,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  error,
  touched,
  //placeholder = "Sélectionnez une date", // Texte de placeholder par défaut
}) => {
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.dateRangeContainer}>
        {/* Champ de date de début */}
        <TouchableOpacity
          onPress={() => setStartDatePickerVisibility(true)}
          style={styles.dateInput}
        >
          <Text style={[styles.dateText, !startDate && styles.placeholderText]}>
            {startDate ? moment(startDate).format("DD/MM/YYYY") : "De"}{" "}
            {/* Placeholder spécifique */}
          </Text>
        </TouchableOpacity>

        <MaterialIcons
          name="arrow-forward"
          size={24}
          color="#007BFF"
          style={styles.arrowIcon}
        />

        <TouchableOpacity
          onPress={() => setEndDatePickerVisibility(true)}
          style={styles.dateInput}
        >
          <Text style={[styles.dateText, !endDate && styles.placeholderText]}>
            {endDate ? moment(endDate).format("DD/MM/YYYY") : "À"}{" "}
            {/* Placeholder spécifique */}
          </Text>
        </TouchableOpacity>
      </View>
      {touched && error && <Text style={styles.errorText}>{error}</Text>}

      {/* Sélecteur de date de début */}
      {isStartDatePickerVisible && (
        <DateTimePicker
          value={startDate ? new Date(startDate) : new Date()} // Utiliser new Date() uniquement si une date est fournie
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setStartDatePickerVisibility(false);
            if (selectedDate) {
              onStartDateChange(selectedDate.toISOString().split("T")[0]); // Formater la date en YYYY-MM-DD
            }
          }}
        />
      )}

      {/* Sélecteur de date de fin */}
      {isEndDatePickerVisible && (
        <DateTimePicker
          value={endDate ? new Date(endDate) : new Date()} // Utiliser new Date() uniquement si une date est fournie
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setEndDatePickerVisibility(false);
            if (selectedDate) {
              onEndDateChange(selectedDate.toISOString().split("T")[0]); // Formater la date en YYYY-MM-DD
            }
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  dateRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },
  dateText: {
    fontSize: 16,
    color: "black",
  },
  arrowIcon: {
    marginHorizontal: 8, // Espacement autour de la flèche
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
});

export default DateRangePickerField;
