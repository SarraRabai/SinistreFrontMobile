import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

export default function CameraButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <FontAwesome6 name="car" size={40} color="gray" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "gray",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
    marginBottom: 20,
  },
});
