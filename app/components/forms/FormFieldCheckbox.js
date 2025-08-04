import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFormikContext } from "formik";
import { Checkbox } from "react-native-paper";

function FormFieldCheckbox({ name, value, label }) {
  const { values, setFieldValue } = useFormikContext();

  const selected = values[name]?.includes(value);

  const handleToggle = () => {
    const currentArray = values[name] || [];
    if (selected) {
      setFieldValue(
        name,
        currentArray.filter((item) => item !== value)
      );
    } else {
      setFieldValue(name, [...currentArray, value]);
    }
  };

  return (
    <View style={styles.container}>
      <Checkbox
        status={selected ? "checked" : "unchecked"}
        onPress={handleToggle}
      />
      <Text style={styles.label} onPress={handleToggle}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
  },
});

export default FormFieldCheckbox;
