import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Screen from "../../components/Screen";
import colors from "../../config/colors";
import client from "../../api/client";
import authStorage from "../../../app/auth/storage";
import { Ionicons } from "@expo/vector-icons";
import ConstatModal from "../../components/ConstatModal";

const MesConstatScreen = () => {
  const [mesConstat, setMesConstat] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const getMesConstats = async () => {
    const token = await authStorage.getToken();
    try {
      const response = await client.post(
        "/addConstat/constatByUser",
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setMesConstat(response?.data?.result || []);
    } catch (error) {
      console.error("Erreur API non bloquante:", error);
    }
  };

  useEffect(() => {
    getMesConstats();
  }, []);

  const renderItem = ({ item }) => {
    const formattedDate = new Date(item.date).toLocaleDateString();
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>📅 Date:</Text>
          <Text style={styles.value}>{formattedDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>🕒 Heure:</Text>
          <Text style={styles.value}>{item.time}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>📍 Lieu:</Text>
          <Text style={styles.value}>{item.location}</Text>
        </View>
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => {
            setSelectedItem(item);
            setModalVisible(true);
          }}
        >
          <Ionicons name="eye-outline" size={24} color={colors.ctama1} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Screen style={styles.screen}>
      <ConstatModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedItem={selectedItem}
        client={client}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Mes Constats</Text>
      </View>

      <FlatList
        data={mesConstat}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucun constat disponible.</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
};

export default MesConstatScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    alignItems: "center",
    marginVertical: 15,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: colors.ctama1,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    fontWeight: "bold",
    color: colors.dark,
    marginRight: 5,
  },
  value: {
    color: colors.medium,
  },
  eyeIcon: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: colors.medium,
    fontSize: 16,
  },
});
