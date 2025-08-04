import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const actions = [
  {
    icon: "history",
    title: "mes Constats",
    subtitle: "Historique de vos constats",
    screen: "MesConstats",
  },
  {
    icon: "post-add",
    title: "Créer un constat",
    subtitle: "Démarrer un nouveau constat",
    screen: "VehicleInputScreen",
  },
  {
    icon: "quick-contacts-mail",
    title: "Nous contacter",
    subtitle: "Contactez-nous en cas de besoin",
    screen: "listeAdmin",
  },
];

const ActionList = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.verticalList}>
      {actions.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => navigation.navigate(item.screen)}
        >
          <MaterialIcons
            name={item.icon}
            size={30}
            color="#2B6CB0"
            style={styles.cardIcon}
          />
          <View style={styles.textContainer}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#A0AEC0" />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  verticalList: {
    padding: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4, // Android shadow
  },
  cardIcon: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2D3748",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#718096",
    marginTop: 2,
  },
});

export default ActionList;
