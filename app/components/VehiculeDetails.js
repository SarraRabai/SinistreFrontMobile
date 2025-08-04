import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "../config/colors";

const VehiculeDetails = ({ visible, vehicule, onClose }) => {
  if (!vehicule) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Détails du véhicule</Text>

          <View style={styles.detailRow}>
            <MaterialIcons name="directions-car" color="#333" size={25} />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Brand: </Text>
              {vehicule.brand}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="category" color="#333" size={25} />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Type: </Text>
              {vehicule.type}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="confirmation-number" color="#333" size={25} />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Numéro série: </Text>
              {vehicule.numeroSerie}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="confirmation-number" color="#333" size={25} />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Matricule: </Text>
              {vehicule.numeroMatricule}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="description" color="#333" size={25} />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Contrat: </Text>
              {vehicule.numeroContrat}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="home-work" color="#333" size={25} />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Agence: </Text>
              {vehicule.agence}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="verified-user" color="#333" size={25} />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Assure: </Text>
              {vehicule.assure}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="event" color="#333" size={25} />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Début assurance: </Text>
              {new Date(vehicule.insuranceStartDate).toLocaleDateString()}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="event-available" color="#333" size={25} />
            <Text style={styles.detailText}>
              <Text style={styles.bold}>Fin assurance: </Text>
              {new Date(vehicule.insuranceEndDate).toLocaleDateString()}
            </Text>
          </View>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default VehiculeDetails;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: colors.ctama1,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  closeButton: {
    backgroundColor: colors.ctama1,
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
