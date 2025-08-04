import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import UsersApi from "../api/UsersApi";
import { FontAwesome } from "@expo/vector-icons";
const ListAdminScreen = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);

  const getListAdmin = async () => {
    try {
      const response = await UsersApi.getListAdmin();

      setUsers(response?.data?.result || []);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    getListAdmin();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Messages", {
          reciverId: item._id,
          recivedName: item?.name,
          role: item?.role,
        })
      }
    >
      <View style={styles.itemContainer}>
        <FontAwesome name="user" size={24} color="#333" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.role}>{item.role}</Text>
        </View>
        <FontAwesome name="chevron-right" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des Administrations</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default ListAdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Pour pousser la flèche à droite
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  role: {
    fontSize: 14,
    color: "gray",
  },
  icon: {
    marginRight: 12,
  },
});
