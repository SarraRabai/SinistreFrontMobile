// components/forms/VehicleTypePicker.js
import React from "react";
import { Picker } from "@react-native-picker/picker";
import { useFormikContext } from "formik";
import { StyleSheet } from "react-native";

const vehicleTypes = [
  "TU",
  "PAT",
  "CMD",
  "CD",
  "MD",
  "RS",
  "TRAC",
  "REM",
  "ONU",
  "OMG",
  "AA",
  "ES",
  "IT",
  "MC",
  "cC",
  "wW",
];

const VehicleTypePicker = ({ index }) => {
  const { setFieldValue, values } = useFormikContext();

  return (
    <Picker
      selectedValue={values.vehicules?.[index]?.type}
      onValueChange={(itemValue) =>
        setFieldValue(`vehicules[${index}].type`, itemValue)
      }
      style={styles.picker}
    >
      <Picker.Item label="Sélectionner le type" value="" />
      {vehicleTypes.map((type) => (
        <Picker.Item key={type} label={type} value={type} />
      ))}
    </Picker>
  );
};

const styles = StyleSheet.create({
  picker: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginVertical: 8,
    paddingHorizontal: 10,
  },
});

export default VehicleTypePicker;
