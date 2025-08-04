import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Button,
} from "react-native";
import client from "../../api/client";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image"; //pour afficher des GIFs ou des icônes
import QRCode from "react-native-qrcode-svg";
import * as Linking from "expo-linking"; //pour ouvrir des URLs dans l’application
import { v4 as uuidv4 } from "uuid"; //pour générer des identifiants uniques
import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import AppTextInput from "../../components/AppTextInput";

const VehicleInputScreen = () => {
  const navigation = useNavigation();
  const [numberOfVehicles, setNumberOfVehicles] = useState(""); //stocke le nombre entré par l’utilisateur
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null); //véhicule sélectionné pour afficher le QR code
  const [qrValue, setQrValue] = useState(""); //URL encodée dans le QR code
  const [constatId, setConstatId] = useState(null); //ID unique pour l’accident

  useEffect(() => {}, [
    numberOfVehicles,
    vehicles,
    selectedVehicle,
    qrValue,
    constatId,
  ]);

  useEffect(() => {}, [selectedVehicle]);

  useEffect(() => {}, [qrValue]);

  useEffect(() => {
    if (constatId) {
    }
  }, [constatId]);

  const prefix = Linking.createURL(""); //Crée une URL de base pour les liens profonds,pour générer des liens

  const handleInputChange = async (text) => {
    setNumberOfVehicles(text);

    if (!isNaN(text) && text !== "") {
      const count = parseInt(text, 10);

      if (count > 0) {
        // 1. Générer les véhicules IMMÉDIATEMENT
        const newVehicles = Array.from(
          { length: count },
          (_, i) => `Véhicule ${String.fromCharCode(65 + i)}`
        );

        // 2. Mettre à jour l'état SYNCHRONEMENT
        setVehicles(newVehicles);

        // 3. Générer et stocker l'ID
        const newConstatId = uuidv4();

        setConstatId(newConstatId);

        // 4. Envoyer la requête API (en arrière-plan)
        try {
          await client.post("/addConstat/accident_init", {
            accidentId: newConstatId,
            totalVehicles: count,
          });
        } catch (error) {
          console.error("Erreur API non bloquante:", error);
        }
      } else {
        // Reset si count = 0
        setVehicles([]);
        setConstatId(null);
      }
    } else {
      // Reset si texte invalide
      setVehicles([]);
      setConstatId(null);
    }
  };
  const handleVehiclePress = async (vehicle) => {
    if (!constatId) {
      console.error("Erreur : constatId est null ou non défini !");
      alert(
        "Veuillez entrer un nombre de véhicules valide avant de continuer."
      );
      return;
    }
    await AsyncStorage.setItem("currentAccidentId", constatId);
    if (vehicle === "Véhicule A") {
      navigation.navigate("General_Info", {
        vehicleName: vehicle,
        accidentId: constatId,
        vehicleType: vehicle.replace("Véhicule ", ""),
      });
      setSelectedVehicle(null);
      setQrValue("");
    } else {
      setSelectedVehicle(vehicle);

      const qrLink = Linking.createURL("general-info", {
        queryParams: { vehicle, accidentId: constatId },
      });

      setQrValue(qrLink);
    }
  };
  const shareLink = () => {
    if (!qrValue) return;
    Linking.openURL(
      `sms:&body=Voici le lien pour ${selectedVehicle} : ${qrValue}`
    ).catch((err) => console.error("Erreur lors du partage :", err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>Nombre de véhicules impliqués</Text>

        <View style={styles.imageContainer}>
          <Image
            source={require("./image/IMPLI.gif")} // Remplacez par le chemin de votre GIF
            style={styles.carImage}
            contentFit="contain" // Ajuster l'image
          />
        </View>
        <AppTextInput
          icon="car"
          placeholder="Entrez le nombre de véhicules"
          keyboardType="numeric"
          value={numberOfVehicles}
          onChangeText={handleInputChange}
        />

        {/* Conteneurs des véhicules */}
        {vehicles.map((vehicle, index) => (
          <TouchableOpacity
            key={index}
            style={styles.vehicleContainer}
            onPress={() => handleVehiclePress(vehicle)}
            disabled={!constatId}
          >
            <View style={styles.vehicleContent}>
              <Image
                source={require("./image/car.png")}
                style={styles.carIcon}
                contentFit="contain"
              />
              <Text style={styles.vehicleText}>{vehicle}</Text>
            </View>
          </TouchableOpacity>
        ))}
        {selectedVehicle && qrValue ? (
          <View style={styles.qrContainer}>
            <Text>QR Code pour {selectedVehicle}</Text>
            <QRCode
              value={qrValue}
              size={200}
              color="black"
              backgroundColor="white"
            />
            <Text style={{ marginTop: 10 }}>{qrValue}</Text>
            <TouchableOpacity style={styles.shareButton} onPress={shareLink}>
              <Text style={styles.shareButtonText}>Partager le lien</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center", // Centrer le texte
  },
  imageContainer: {
    alignItems: "center", // Centrer l'image
    marginBottom: 20, // Espace sous l'image
  },
  carImage: {
    width: 450, //Taille de l'image
    height: 280,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  vehicleContainer: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  vehicleContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  carIcon: {
    width: 32,
    height: 32,
    marginRight: 10, // Espace entre l'icône et le texte
  },
  vehicleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  qrContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  shareButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default VehicleInputScreen;
