import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";

import Screen from "../components/Screen";
import colors from "../config/colors";
import client from "../api/client";
import authStorage from "../../app/auth/storage";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  Entypo,
} from "@expo/vector-icons";
import AjoutVehiculeModal from "../components/AjoutVehiculeModal";
import VehiculeDetails from "../components/VehiculeDetails";
const MesVehicules = () => {
  const [mesVehicules, setMesVehicules] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedVehicule, setSelectedVehicule] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const getMesVehicules = async () => {
    const token = await authStorage.getToken();
    try {
      const response = await client.get(
        "/users/getAllVehicule",

        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setMesVehicules(response?.data?.result || []);
    } catch (error) {
      console.error("Erreur API non bloquante:", error);
    }
  };

  useEffect(() => {
    getMesVehicules();
  }, []);

  const handleAddVehicule = async (formData) => {
    const token = await authStorage.getToken();
    try {
      const response = await client.post(
        "/users/addvehicule",
        { vehicules: formData },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      console.log("✅ Véhicule ajouté:", response?.data);
      getMesVehicules();
    } catch (error) {
      console.error(
        "❌ Erreur ajout véhicule:",
        error?.response?.data || error.message
      );
    }
  };

  const openDetailModal = (vehicule) => {
    setSelectedVehicule(vehicule);
    setDetailModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.info}>
        <View style={styles.row}>
          <FontAwesome5 name="car" color="#333" size={20} style={styles.icon} />
          <Text style={styles.label}>Brand: </Text>
          <Text style={styles.text}>{item.brand}</Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="card-text"
            color="#333"
            size={20}
            style={styles.icon}
          />
          <Text style={styles.label}>Matricule: </Text>
          <Text style={styles.text}>{item.numeroMatricule}</Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="file-document-outline"
            color="#333"
            size={20}
            style={styles.icon}
          />
          <Text style={styles.label}>Contrat: </Text>
          <Text style={styles.text}>{item.numeroContrat}</Text>
        </View>
        <View style={styles.row}>
          <Entypo name="home" color="#333" size={20} style={styles.icon} />
          <Text style={styles.label}>Agence: </Text>
          <Text style={styles.text}>{item.agence}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => openDetailModal(item)}>
          <Ionicons name="eye-outline" size={27} color={colors.ctama1} />
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <Screen style={styles.screen}>
      <VehiculeDetails
        visible={detailModalVisible}
        vehicule={selectedVehicule}
        onClose={() => setDetailModalVisible(false)}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Mes véhicules</Text>
      </View>

      <FlatList
        data={mesVehicules}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        style={{ marginEnd: 10, marginStart: 10 }}
      />

      <AjoutVehiculeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddVehicule}
      />
    </Screen>
  );
};

export default MesVehicules;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.light,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 15,
  },

  addButton: {
    padding: 5,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: colors.ctama1,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  info: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontWeight: "bold",
    fontSize: 14,
    color: colors.dark,
  },
  text: {
    fontSize: 14,
    color: colors.dark,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionIcon: {
    marginLeft: 1,
  },
});
