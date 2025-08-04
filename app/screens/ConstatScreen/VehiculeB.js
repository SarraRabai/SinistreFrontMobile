import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Button,
  SafeAreaView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Checkbox } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import VoiceRecording from "./VoiceRecording"; // Importez le composant VoiceRecording

// Schéma de validation avec Yup
const validationSchema = Yup.object().shape({
  insuredVehicle: Yup.string().required("Véhicule assuré est requis"),
  contractNumber: Yup.string().required("Numéro de contrat est requis"),
  agency: Yup.string().required("Agence est requise"),
  validFrom: Yup.string().required("Date de début est requise"),
  validTo: Yup.string().required("Date de fin est requise"),
  driverLastName: Yup.string().required("Nom du conducteur est requis"),
  driverFirstName: Yup.string().required("Prénom du conducteur est requis"),
  driverAddress: Yup.string().required("Adresse du conducteur est requise"),
  driverLicenseNumber: Yup.string().required("Numéro de permis est requis"),
  licenseIssueDate: Yup.string().required("Date de délivrance est requise"),
  insuredLastName: Yup.string().required("Nom de l'assuré est requis"),
  insuredFirstName: Yup.string().required("Prénom de l'assuré est requis"),
  insuredAddress: Yup.string().required("Adresse de l'assuré est requise"),
  insuredPhone: Yup.string().required("Téléphone de l'assuré est requis"),
  vehicleBrand: Yup.string().required("Marque du véhicule est requise"),
  vehicleRegistration: Yup.string().required("Immatriculation est requise"),
  direction: Yup.string().required("Sens suivi est requis"),
  comingFrom: Yup.string().required("Venant de est requis"),
  goingTo: Yup.string().required("Allant à est requis"),
  damageDescription: Yup.string().required(
    "Description des dégâts est requise"
  ),
});

const VehiculeB = () => {
  const navigation = useNavigation();

  // États pour les images des 4 côtés
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [leftImage, setLeftImage] = useState(null);
  const [rightImage, setRightImage] = useState(null);

  // États pour les circonstances
  const [circumstances, setCircumstances] = useState({
    stationnement: false,
    quittaitStationnement: false,
    prenaitStationnement: false,
    sortaitParking: false,
    engageaitParking: false,
    arretCirculation: false,
    frottementSansChangementFile: false,
    heurtaitArriere: false,
    roulaitMemeSensFileDifferente: false,
    changeaitFile: false,
    doublait: false,
    viraitDroite: false,
    viraitGauche: false,
    reculait: false,
    empiétaitChausseeInverse: false,
    venaitDroiteCarrefour: false,
    nonRespectSignalPriorite: false,
  });

  // États pour le DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateField, setDateField] = useState(""); // Champ de date actuel

  // États pour les enregistrements vocaux
  const [voiceRecordings, setVoiceRecordings] = useState([]);

  // Ouvrir la caméra pour capturer une image
  const openCamera = (side) => {
    navigation.navigate("CameraScreen", {
      onImageCapture: (imageUri) => handleImageCapture(imageUri, side),
    });
  };

  // Gérer l'image capturée
  const handleImageCapture = (imageUri, side) => {
    if (imageUri) {
      switch (side) {
        case "front":
          setFrontImage(imageUri);
          break;
        case "back":
          setBackImage(imageUri);
          break;
        case "left":
          setLeftImage(imageUri);
          break;
        case "right":
          setRightImage(imageUri);
          break;
        default:
          break;
      }
    }
  };

  // Supprimer l'image capturée
  const removeImage = (side) => {
    switch (side) {
      case "front":
        setFrontImage(null);
        break;
      case "back":
        setBackImage(null);
        break;
      case "left":
        setLeftImage(null);
        break;
      case "right":
        setRightImage(null);
        break;
      default:
        break;
    }
  };

  // Rendre un bouton de caméra avec l'image ou l'icône
  const renderCameraButton = (side, image) => {
    return (
      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => openCamera(side)}
      >
        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeIcon}
              onPress={() => removeImage(side)}
            >
              <MaterialIcons name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <MaterialIcons name="directions-car" size={32} color="#007BFF" />
            <Text style={styles.cameraButtonText}>
              {side === "front"
                ? "Avant"
                : side === "back"
                ? "Arrière"
                : side === "left"
                ? "Gauche"
                : "Droite"}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  // Gérer le changement des cases à cocher
  const handleCheckboxChange = (key) => {
    setCircumstances((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Compter le nombre de cases cochées
  const countCheckedBoxes = () => {
    return Object.values(circumstances).filter((value) => value).length;
  };

  // Gérer l'affichage du DatePicker
  const handleDatePicker = (field) => {
    setDateField(field); // Définir le champ de date actuel
    setShowDatePicker(true); // Afficher le DatePicker
  };

  // Gérer la sélection de la date
  const handleDateChange = (event, selectedDate, setFieldValue) => {
    setShowDatePicker(false); // Masquer le DatePicker après la sélection
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0]; // Formater la date en YYYY-MM-DD
      setFieldValue(dateField, formattedDate); // Mettre à jour la valeur du champ
    }
  };

  // Soumettre le formulaire
  const handleFormSubmit = (values) => {
    const vehicleAData = {
      frontImage,
      backImage,
      leftImage,
      rightImage,
      ...values,
      circumstances,
      numberOfCheckedBoxes: countCheckedBoxes(),
      voiceRecordings, // Ajoutez les enregistrements vocaux aux données du formulaire
    };
    console.log("Données du véhicule A :", vehicleAData);
    navigation.navigate("VehiculeB", { vehicleAData });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Formik
          initialValues={{
            insuredVehicle: "",
            contractNumber: "",
            agency: "",
            validFrom: "",
            validTo: "",
            driverLastName: "",
            driverFirstName: "",
            driverAddress: "",
            driverLicenseNumber: "",
            licenseIssueDate: "",
            insuredLastName: "",
            insuredFirstName: "",
            insuredAddress: "",
            insuredPhone: "",
            vehicleBrand: "",
            vehicleRegistration: "",
            direction: "",
            comingFrom: "",
            goingTo: "",
            damageDescription: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <>
              {/* Section pour capturer les images */}
              <Text style={styles.sectionTitle}>Capture des dégâts</Text>
              <View style={styles.cameraButtonsContainer}>
                {renderCameraButton("front", frontImage)}
                {renderCameraButton("back", backImage)}
                {renderCameraButton("left", leftImage)}
                {renderCameraButton("right", rightImage)}
              </View>

              {/* Section 6 : Société d'Assurances */}
              <Text style={styles.sectionTitle}>Société d'Assurances</Text>
              <Text style={styles.label}>Véhicule assuré par</Text>
              <TextInput
                style={styles.input}
                placeholder="Véhicule assuré par"
                onChangeText={handleChange("insuredVehicle")}
                onBlur={handleBlur("insuredVehicle")}
                value={values.insuredVehicle}
              />
              {touched.insuredVehicle && errors.insuredVehicle && (
                <Text style={styles.errorText}>{errors.insuredVehicle}</Text>
              )}

              <Text style={styles.label}>Contrat d'Assurance N°</Text>
              <TextInput
                style={styles.input}
                placeholder="Contrat d'Assurance N°"
                onChangeText={handleChange("contractNumber")}
                onBlur={handleBlur("contractNumber")}
                value={values.contractNumber}
              />
              {touched.contractNumber && errors.contractNumber && (
                <Text style={styles.errorText}>{errors.contractNumber}</Text>
              )}

              <Text style={styles.label}>Agence</Text>
              <TextInput
                style={styles.input}
                placeholder="Agence"
                onChangeText={handleChange("agency")}
                onBlur={handleBlur("agency")}
                value={values.agency}
              />
              {touched.agency && errors.agency && (
                <Text style={styles.errorText}>{errors.agency}</Text>
              )}

              <Text style={styles.label}>Attestation valable du</Text>
              <TouchableOpacity onPress={() => handleDatePicker("validFrom")}>
                <TextInput
                  style={styles.input}
                  placeholder="Date de début"
                  value={values.validFrom}
                  editable={false} // Empêcher la saisie manuelle
                />
              </TouchableOpacity>
              {touched.validFrom && errors.validFrom && (
                <Text style={styles.errorText}>{errors.validFrom}</Text>
              )}

              <Text style={styles.label}>au</Text>
              <TouchableOpacity onPress={() => handleDatePicker("validTo")}>
                <TextInput
                  style={styles.input}
                  placeholder="Date de fin"
                  value={values.validTo}
                  editable={false} // Empêcher la saisie manuelle
                />
              </TouchableOpacity>
              {touched.validTo && errors.validTo && (
                <Text style={styles.errorText}>{errors.validTo}</Text>
              )}

              {/* Section 7 : Identité du Conducteur */}
              <Text style={styles.sectionTitle}>Identité du Conducteur</Text>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={styles.input}
                placeholder="Nom"
                onChangeText={handleChange("driverLastName")}
                onBlur={handleBlur("driverLastName")}
                value={values.driverLastName}
              />
              {touched.driverLastName && errors.driverLastName && (
                <Text style={styles.errorText}>{errors.driverLastName}</Text>
              )}

              <Text style={styles.label}>Prénom</Text>
              <TextInput
                style={styles.input}
                placeholder="Prénom"
                onChangeText={handleChange("driverFirstName")}
                onBlur={handleBlur("driverFirstName")}
                value={values.driverFirstName}
              />
              {touched.driverFirstName && errors.driverFirstName && (
                <Text style={styles.errorText}>{errors.driverFirstName}</Text>
              )}

              <Text style={styles.label}>Adresse</Text>
              <TextInput
                style={styles.input}
                placeholder="Adresse"
                onChangeText={handleChange("driverAddress")}
                onBlur={handleBlur("driverAddress")}
                value={values.driverAddress}
              />
              {touched.driverAddress && errors.driverAddress && (
                <Text style={styles.errorText}>{errors.driverAddress}</Text>
              )}

              <Text style={styles.label}>Permis de conduire N°</Text>
              <TextInput
                style={styles.input}
                placeholder="Permis de conduire N°"
                onChangeText={handleChange("driverLicenseNumber")}
                onBlur={handleBlur("driverLicenseNumber")}
                value={values.driverLicenseNumber}
              />
              {touched.driverLicenseNumber && errors.driverLicenseNumber && (
                <Text style={styles.errorText}>
                  {errors.driverLicenseNumber}
                </Text>
              )}

              <Text style={styles.label}>Délivré le</Text>
              <TouchableOpacity
                onPress={() => handleDatePicker("licenseIssueDate")}
              >
                <TextInput
                  style={styles.input}
                  placeholder="Date de délivrance"
                  value={values.licenseIssueDate}
                  editable={false} // Empêcher la saisie manuelle
                />
              </TouchableOpacity>
              {touched.licenseIssueDate && errors.licenseIssueDate && (
                <Text style={styles.errorText}>{errors.licenseIssueDate}</Text>
              )}

              {/* Afficher le DatePicker */}
              {showDatePicker && (
                <DateTimePicker
                  value={new Date()} // Valeur par défaut
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) =>
                    handleDateChange(event, selectedDate, setFieldValue)
                  }
                />
              )}

              {/* Section 8 : Assuré */}
              <Text style={styles.sectionTitle}>Assuré</Text>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={styles.input}
                placeholder="Nom"
                onChangeText={handleChange("insuredLastName")}
                onBlur={handleBlur("insuredLastName")}
                value={values.insuredLastName}
              />
              {touched.insuredLastName && errors.insuredLastName && (
                <Text style={styles.errorText}>{errors.insuredLastName}</Text>
              )}

              <Text style={styles.label}>Prénom</Text>
              <TextInput
                style={styles.input}
                placeholder="Prénom"
                onChangeText={handleChange("insuredFirstName")}
                onBlur={handleBlur("insuredFirstName")}
                value={values.insuredFirstName}
              />
              {touched.insuredFirstName && errors.insuredFirstName && (
                <Text style={styles.errorText}>{errors.insuredFirstName}</Text>
              )}

              <Text style={styles.label}>Adresse</Text>
              <TextInput
                style={styles.input}
                placeholder="Adresse"
                onChangeText={handleChange("insuredAddress")}
                onBlur={handleBlur("insuredAddress")}
                value={values.insuredAddress}
              />
              {touched.insuredAddress && errors.insuredAddress && (
                <Text style={styles.errorText}>{errors.insuredAddress}</Text>
              )}

              <Text style={styles.label}>Téléphone</Text>
              <TextInput
                style={styles.input}
                placeholder="Téléphone"
                onChangeText={handleChange("insuredPhone")}
                onBlur={handleBlur("insuredPhone")}
                value={values.insuredPhone}
                keyboardType="phone-pad"
              />
              {touched.insuredPhone && errors.insuredPhone && (
                <Text style={styles.errorText}>{errors.insuredPhone}</Text>
              )}

              {/* Section 9 : Identité du Véhicule */}
              <Text style={styles.sectionTitle}>Identité du Véhicule</Text>
              <Text style={styles.label}>Marque, Type</Text>
              <TextInput
                style={styles.input}
                placeholder="Marque, Type"
                onChangeText={handleChange("vehicleBrand")}
                onBlur={handleBlur("vehicleBrand")}
                value={values.vehicleBrand}
              />
              {touched.vehicleBrand && errors.vehicleBrand && (
                <Text style={styles.errorText}>{errors.vehicleBrand}</Text>
              )}

              <Text style={styles.label}>N° d'immatriculation</Text>
              <TextInput
                style={styles.input}
                placeholder="N° d'immatriculation"
                onChangeText={handleChange("vehicleRegistration")}
                onBlur={handleBlur("vehicleRegistration")}
                value={values.vehicleRegistration}
              />
              {touched.vehicleRegistration && errors.vehicleRegistration && (
                <Text style={styles.errorText}>
                  {errors.vehicleRegistration}
                </Text>
              )}

              <Text style={styles.label}>Sens suivi</Text>
              <TextInput
                style={styles.input}
                placeholder="Sens suivi"
                onChangeText={handleChange("direction")}
                onBlur={handleBlur("direction")}
                value={values.direction}
              />
              {touched.direction && errors.direction && (
                <Text style={styles.errorText}>{errors.direction}</Text>
              )}

              <Text style={styles.label}>Venant de</Text>
              <TextInput
                style={styles.input}
                placeholder="Venant de"
                onChangeText={handleChange("comingFrom")}
                onBlur={handleBlur("comingFrom")}
                value={values.comingFrom}
              />
              {touched.comingFrom && errors.comingFrom && (
                <Text style={styles.errorText}>{errors.comingFrom}</Text>
              )}

              <Text style={styles.label}>Allant à</Text>
              <TextInput
                style={styles.input}
                placeholder="Allant à"
                onChangeText={handleChange("goingTo")}
                onBlur={handleBlur("goingTo")}
                value={values.goingTo}
              />
              {touched.goingTo && errors.goingTo && (
                <Text style={styles.errorText}>{errors.goingTo}</Text>
              )}

              <Text style={styles.sectionTitle}>Dégâts apparents</Text>

              {/* Section pour l'enregistrement vocal */}
              <Text style={styles.sectionTitle}>Vocal</Text>
              <VoiceRecording
                onRecordingsChange={(recordings) =>
                  setVoiceRecordings(recordings)
                }
              />

              {/* Section 11 : Dégâts apparents */}
              <Text style={styles.sectionTitle}>Ecrite</Text>
              <TextInput
                style={[
                  styles.input,
                  { height: 100, textAlignVertical: "top" },
                ]}
                placeholder="Décrivez les dégâts apparents"
                onChangeText={handleChange("damageDescription")}
                onBlur={handleBlur("damageDescription")}
                value={values.damageDescription}
                multiline
              />
              {touched.damageDescription && errors.damageDescription && (
                <Text style={styles.errorText}>{errors.damageDescription}</Text>
              )}

              {/* Section 12 : Circonstances */}
              <Text style={styles.sectionTitle}>Circonstances</Text>
              {Object.keys(circumstances).map((key) => (
                <View key={key} style={styles.checkboxContainer}>
                  <View style={styles.checkboxWrapper}>
                    <Checkbox
                      status={circumstances[key] ? "checked" : "unchecked"}
                      onPress={() => handleCheckboxChange(key)}
                      color="#007BFF"
                    />
                  </View>
                  <Text style={styles.checkboxLabel}>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </Text>
                </View>
              ))}

              {/* Indiquer le nombre de cases cochées */}
              <Text style={styles.sectionTitle}>
                Nombre de cases cochées : {countCheckedBoxes()}
              </Text>

              {/* Bouton Suivant */}
              <Button title="Suivant" onPress={handleSubmit} />
            </>
          )}
        </Formik>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  cameraButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cameraButton: {
    alignItems: "center",
    justifyContent: "center",
    width: "23%",
    height: 100,
    padding: 10,
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 4,
  },
  cameraButtonText: {
    color: "#007BFF",
    fontSize: 14,
    marginTop: 8,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  removeIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 4,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkboxWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 4,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
});

export default VehiculeB;
