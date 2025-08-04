import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import "moment/locale/fr"; // Importer les locales françaises

moment.locale("fr");

const DatePickerField = ({
  label,
  value,
  onChange,
  error,
  touched,
  placeholder,
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={() => setDatePickerVisibility(true)}
        style={styles.touchableInput}
      >
        <View style={styles.inputContainer}>
          <Text
            style={[
              styles.inputText,
              value && styles.selectedText, // Appliquer le style si une valeur est sélectionnée
            ]}
          >
            {value ? moment(value).format("DD/MM/YYYY") : placeholder}
          </Text>
        </View>
      </TouchableOpacity>
      {touched && error && <Text style={styles.errorText}>{error}</Text>}

      {/* Sélecteur de date */}
      {isDatePickerVisible && (
        <View style={styles.dateTimePickerContainer}>
          <DateTimePicker
            value={value ? new Date(value) : new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setDatePickerVisibility(false);
              if (selectedDate) {
                onChange(selectedDate.toISOString().split("T")[0]); // Formater la date en YYYY-MM-DD
              }
            }}
          />
        </View>
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
  touchableInput: {
    width: "100%",
  },
  inputContainer: {
    padding: 8,
    justifyContent: "center",
    height: 40,
  },
  inputText: {
    fontSize: 16,
    color: "#ccc", // Couleur par défaut (gris clair)
  },
  selectedText: {
    color: "#000", // Couleur du texte lorsqu'une valeur est sélectionnée (noir)
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  dateTimePickerContainer: {
    marginBottom: 16,
  },
});

export default DatePickerField;
