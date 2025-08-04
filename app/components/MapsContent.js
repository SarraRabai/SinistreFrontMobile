import React from "react";
import { View, Text, StyleSheet } from "react-native";

const MapsContent = () => (
  <View>
    <Text style={styles.title}>Informations sur Maps</Text>
    <Text style={styles.text}>Voici la carte des emplacements.</Text>
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

export default MapsContent;