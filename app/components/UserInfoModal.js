import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Icon from "./Icon";
import colors from "../config/colors";

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.row}>
    <View style={styles.labelContainer}>
      <Icon name={icon} color="#333" size={25} />
      <Text style={styles.label}>{label}</Text>
    </View>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const UserInfoModal = ({ user, onClose }) => {
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.card}>
          <Icon
            backgroundColor={colors.ctama1}
            name="account-circle"
            size={50}
            color="#333"
            style={styles.icon}
          />

          <InfoRow icon="account" label="Nom" value={user?.name} />
          <InfoRow icon="account" label="Prénom" value={user?.prenom} />
          <InfoRow icon="id-card" label="CIN" value={user?.cin} />
          <InfoRow
            icon="cellphone"
            label="N°Téléphone"
            value={user?.numeroTelephone}
          />
          <InfoRow
            icon="map-marker-account"
            label="Adresse"
            value={user?.adresse}
          />

          <View style={styles.separator} />

          <InfoRow
            icon="card-account-details-star"
            label="N°Permis"
            value={user?.numeroPermis}
          />
          <InfoRow
            icon="calendar"
            label="Date Delivrance"
            value={new Date(user?.dateDelivrance).toLocaleDateString()}
          />
          <InfoRow
            icon="calendar"
            label="Date d'expiration"
            value={new Date(user?.dateExpiration).toLocaleDateString()}
          />
          <InfoRow
            icon="format-list-bulleted"
            label="Catégories"
            value={user?.categoriesPermis?.join(", ")}
          />
          <InfoRow
            icon="car-multiple"
            label="Total des véhicules"
            value={user?.vehicules?.length}
          />

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fermer</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#f8f4f4",
    padding: 20,
    borderRadius: 20,
    width: "90%",
  },
  card: {
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  icon: {
    marginBottom: 10,
  },
  separator: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 2,
    marginVertical: 10,
    alignSelf: "stretch",
  },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 6,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    flexShrink: 1,
    textAlign: "right",
    flex: 1,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: colors.ctama1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default UserInfoModal;
