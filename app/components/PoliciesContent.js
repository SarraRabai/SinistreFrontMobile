import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PoliciesContent = () => (
  <View>
    <Text style={styles.title}>Informations sur Policies</Text>
    <Text style={styles.text}>Voici les détails de vos polices d'assurance.</Text>
  </View>
);

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 14,
    color: "#666",
  },
});

export default PoliciesContent;