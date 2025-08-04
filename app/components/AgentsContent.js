import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AgentsContent = () => (
  <View>
    <Text style={styles.title}>Informations sur Agents</Text>
    <Text style={styles.text}>Voici la liste des agents disponibles.</Text>
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

export default AgentsContent;