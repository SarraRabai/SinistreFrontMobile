// components/forms/AssurePicker.js
import React from "react";
import { Picker } from "@react-native-picker/picker";
import { useFormikContext } from "formik";
import { StyleSheet } from "react-native";

const assureurs = [
  "AMI",
  "ASTREE",
  "Attijari",
  "GAT",
  "G AT VIE",
  "MAE",
  "TUNIS RE",
  "STAR",
  "COMAR",
  "MAGHERBIA",
  "LLOYD",
  "CARTE",
  "GE",
  "CTAMA",
  "CORIS",
  "BUAT",
  "AVUS",
  "FGA",
  "NA",
];

const AssurePicker = ({ index }) => {
  const { setFieldValue, values } = useFormikContext();

  return (
    <Picker
      selectedValue={values.vehicules?.[index]?.assure}
      onValueChange={(itemValue) =>
        setFieldValue(`vehicules[${index}].assure`, itemValue)
      }
      style={styles.picker}
    >
      <Picker.Item label="Sélectionnez un assureur" value="" />
      {assureurs.map((type) => (
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

export default AssurePicker;
