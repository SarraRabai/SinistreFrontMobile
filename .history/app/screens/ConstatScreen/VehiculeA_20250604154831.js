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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Checkbox } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import VoiceRecording from "./VoiceRecording";
import DatePickerField from "./DatePickerField";
import CustomPicker from "./Picker";
import DateRangePickerField from "./DateRangePickerField";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import UploadScreen from "../UploadScreen";
import constatApi from "../../api/constatApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { use } from "react";
import useAuth from "../../auth/useAuth";
import { AppFormField } from "../../components/forms";
import AppTextInput from "../../components/AppTextInput";
//const { uploadImage, uploadVoice } = constatApi;

// Schéma de validation avec Yup
const validationSchema = Yup.object().shape({
  // ... (le reste du schéma de validation)
});

const vehicleFaces = [
  "avant",
  "arrière",
  "gauche",
  "droite",
  "avant-arrière",
  "avant-gauche",
  "avant-droite",
  "arrière-gauche",
  "arrière-droite",
  "gauche-droite",
  "avant-arrière-gauche",
  "avant-arrière-droite",
  "tous",
];
const VehiculeA = () => {
  const { user } = useAuth();

  const navigation = useNavigation();
  const route = useRoute();
  const { generalData, accidentId } = route.params;

  const [step, SetStep] = useState(1);

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

  // États pour les enregistrements vocaux
  const [voiceRecordings, setVoiceRecordings] = useState([]);

  // États pour les parties du numéro d'immatriculation
  const [firstPart, setFirstPart] = useState("");
  const [secondPart, setSecondPart] = useState("");
  const [selectedFace, setSelectedFace] = useState("");
  // États pour la progression de l'upload
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

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

  // Soumettre le formulaire
  const handleFormSubmit = async (values) => {
    setProgress(0);
    setUploadVisible(true);

    try {
      // Récupération multi-source de l'ID
      const finalAccidentId =
        route.params.accidentId ||
        (await AsyncStorage.getItem("currentAccidentId"));

      if (!finalAccidentId) {
        throw new Error("ID d'accident introuvable");
      }

      // Préparer les données du formulaire
      const vehicleAData = {
        frontImage,
        backImage,
        leftImage,
        rightImage,
        voiceRecordings,
        ...values,
        circumstances,
        numberOfCheckedBoxes: countCheckedBoxes(),
        accidentId: finalAccidentId,
        //voiceRecordings,
      };
      //console.log("Soumission avec accidentId:", vehicleAData.accidentId);

      // Combiner les données
      const combinedData = {
        ...generalData,
        ...vehicleAData,
      };

      // console.log("Données combinées :", combinedData);

      // Envoyer les données au backend
      const result = await constatApi.addConstat(combinedData, (progress) =>
        setProgress(progress)
      );
      setUploadVisible(false);

      if (!result.ok) {
        alert(result.problem, result.data);
        return;
      }

      alert("Constat saved successfully!");
      await AsyncStorage.removeItem("currentAccidentId"); // Nettoyage
      navigation.navigate("MesConstats");
    } catch (error) {
      console.log("err", error);
      setUploadVisible(false);
      alert("An error occurred while saving the constat.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <UploadScreen
        onDone={() => setUploadVisible(false)}
        progress={progress}
        visible={uploadVisible}
      />
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
            insuredLastName: user?.name,
            insuredFirstName: user?.prenom,
            insuredAddress: user?.adresse,
            insuredPhone: user?.numeroTelephone,
            vehicleBrand: "",
            vehicleType: "",
            face: "",
            //vehicleLetter: route.params.vehicleLetter,
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

              {step === 1 && (
                <>
                  <Text style={styles.sectionTitle}>Capture des dégâts</Text>
                  <View style={styles.cameraButtonsContainer}>
                    {renderCameraButton("front", frontImage)}
                    {renderCameraButton("back", backImage)}
                    {renderCameraButton("left", leftImage)}
                    {renderCameraButton("right", rightImage)}
                  </View>

                  {/* Section 1 : Identité du Véhicule */}

                  <Text style={styles.sectionTitle}>Identité du Véhicule</Text>

                  <Text style={styles.label}>N°Matricule</Text>

                  <TouchableOpacity style={styles.touchableInput}>
                    <MaterialCommunityIcons
                      name="car"
                      size={25}
                      color="black"
                    />
                    <CustomPicker
                      selectedValue={secondPart}
                      onValueChange={(itemValue) => {
                        setSecondPart(itemValue);

                        // Trouver l'objet véhicule correspondant
                        const selectedVehicle = user?.vehicules.find(
                          (vehicule) => vehicule.numeroMatricule === itemValue
                        );

                        setFieldValue("vehicleBrand", selectedVehicle?.brand);
                        setFieldValue("vehicleType", selectedVehicle?.type);

                        setFirstPart(selectedVehicle?.numeroSerie);

                        setFieldValue(
                          "vehicleRegistration",
                          `${selectedVehicle?.numeroSerie} ${selectedVehicle?.type} ${itemValue}`
                        );

                        setFieldValue(
                          "validFrom",
                          new Date(
                            selectedVehicle?.insuranceStartDate
                          ).toLocaleDateString()
                        );
                        setFieldValue(
                          "validTo",
                          new Date(
                            selectedVehicle?.insuranceEndDate
                          ).toLocaleDateString()
                        );

                        setFieldValue(
                          "insuredVehicle",
                          selectedVehicle?.assure
                        );
                        setFieldValue(
                          "contractNumber",
                          selectedVehicle?.numeroContrat
                        );

                        setFieldValue("agency", selectedVehicle?.agence);
                      }}
                      items={[
                        { label: "Sélectionnez Matricule", value: "" },
                        ...user?.vehicules.map((numeroMatricule) => ({
                          label: numeroMatricule?.numeroMatricule,
                          value: numeroMatricule?.numeroMatricule,
                        })),
                      ]}
                      placeholder="Sélectionnez Matricule"
                    />
                  </TouchableOpacity>

                  <AppFormField
                    autoCorrect={false}
                    icon="car"
                    name="vehicleBrand"
                    value={values.vehicleBrand}
                    placeholder="Brand"
                    editable={false}
                  />

                  <AppFormField
                    editable={false}
                    autoCorrect={false}
                    icon="car"
                    placeholder="Type "
                    value={values.vehicleType}
                  />

                  <Text style={styles.label}>N° d'immatriculation</Text>
                  <View style={styles.registrationContainer}>
                    <AppTextInput
                      width="35%"
                      icon="car"
                      placeholder="N° serie"
                      value={firstPart}
                      editable={false}
                      keyboardType="numeric"
                    />

                    {/* <TextInput
                      style={[styles.input, styles.registrationInput]}
                      placeholder="N° serie"
                      value={firstPart}
                      editable={false}
                      keyboardType="numeric"
                    /> */}

                    <Text style={styles.registrationText}>
                      {values?.vehicleType || "Type"}
                    </Text>

                    <AppTextInput
                      width="35%"
                      icon="car"
                      placeholder="N° Matricule"
                      value={secondPart}
                      editable={false}
                      keyboardType="numeric"
                    />
                    {/* <TextInput
                      style={[styles.input, styles.registrationInput]}
                      placeholder="N° Matricule "
                      value={secondPart}
                      editable={false}
                      keyboardType="numeric"
                    /> */}
                  </View>

                  <Text style={styles.label}>Choisissez la face du choc :</Text>
                  <TouchableOpacity style={styles.touchableInput}>
                    <MaterialCommunityIcons
                      name="car"
                      size={25}
                      color="black"
                    />
                    <CustomPicker
                      selectedValue={selectedFace}
                      onValueChange={(itemValue) => {
                        setSelectedFace(itemValue);
                        setFieldValue("face", itemValue);
                      }}
                      items={[
                        { label: "Sélectionnez une face", value: "" },
                        ...vehicleFaces.map((face) => ({
                          label: face.charAt(0).toUpperCase() + face.slice(1), // capitalise
                          value: face,
                        })),
                      ]}
                      placeholder="Sélectionnez une face"
                    />
                  </TouchableOpacity>
                  {/* Section 2 : Société d'Assurances */}
                  <Text style={styles.sectionTitle}>Société d'Assurances</Text>
                  <Text style={styles.label}>Véhicule assuré par</Text>

                  <AppFormField
                    autoCorrect={false}
                    icon="home"
                    placeholder="assuré par "
                    name="insuredVehicle"
                    value={values?.insuredVehicle}
                    editable={false}
                  />

                  <Text style={styles.label}>Contrat d'Assurance N°</Text>

                  <AppFormField
                    autoCorrect={false}
                    icon="file-document"
                    placeholder="Contrat d'Assurance N°"
                    value={values?.contractNumber}
                    name="contractNumber"
                    editable={false}
                  />

                  <Text style={styles.label}>Agence</Text>
                  <AppFormField
                    autoCorrect={false}
                    icon="home"
                    placeholder="Agence"
                    name="agency"
                    value={values?.agency}
                    editable={false}
                  />

                  {/* pour assurance */}

                  <Text style={styles.label}>Attestation valable</Text>
                  <View style={styles.registrationContainer}>
                    <AppFormField
                      width="40%"
                      autoCorrect={false}
                      icon="calendar"
                      placeholder="De "
                      name="validFrom"
                      value={values?.validFrom}
                      editable={false}
                    />

                    <MaterialIcons
                      name="arrow-forward"
                      size={24}
                      color="#007BFF"
                    />

                    <AppFormField
                      width="40%"
                      autoCorrect={false}
                      icon="calendar"
                      placeholder="À"
                      name="validTo"
                      value={values?.validTo}
                      editable={false}
                    />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.SuivantButton,
                      { backgroundColor: step === 1 ? "#de6442" : "#007bff" },
                    ]}
                    onPress={() => SetStep(2)}
                  >
                    <Text style={styles.backButtonText}>Suivant</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Section 3 : Identité du Conducteur */}

              {step === 2 && (
                <>
                  <Text style={styles.sectionTitle}>
                    Identité du Conducteur
                  </Text>
                  <Text style={styles.label}>Nom</Text>
                  <AppTextInput
                    icon="account"
                    placeholder="Nom Conducteur"
                    onChangeText={handleChange("driverLastName")}
                    onBlur={handleBlur("driverLastName")}
                    value={values.driverLastName}
                  />
                  {touched.driverLastName && errors.driverLastName && (
                    <Text style={styles.errorText}>
                      {errors.driverLastName}
                    </Text>
                  )}

                  <AppTextInput
                    icon="account"
                    placeholder="Prénom Conducteur"
                    onChangeText={handleChange("driverFirstName")}
                    onBlur={handleBlur("driverFirstName")}
                    value={values.driverFirstName}
                  />
                  {touched.driverFirstName && errors.driverFirstName && (
                    <Text style={styles.errorText}>
                      {errors.driverFirstName}
                    </Text>
                  )}

                  <Text style={styles.label}>Adresse</Text>
                  <AppTextInput
                    icon="email"
                    placeholder="email Conducteur"
                    onChangeText={handleChange("driverAddress")}
                    onBlur={handleBlur("driverAddress")}
                    value={values.driverAddress}
                  />
                  {touched.driverAddress && errors.driverAddress && (
                    <Text style={styles.errorText}>{errors.driverAddress}</Text>
                  )}

                  <Text style={styles.label}>Permis de conduire N°</Text>
                  <AppTextInput
                    icon="card-account-details-star"
                    placeholder="Permis de conduire N°"
                    onChangeText={handleChange("driverLicenseNumber")}
                    onBlur={handleBlur("driverLicenseNumber")}
                    value={values.driverLicenseNumber}
                    keyboardType="numeric"
                  />
                  {touched.driverLicenseNumber &&
                    errors.driverLicenseNumber && (
                      <Text style={styles.errorText}>
                        {errors.driverLicenseNumber}
                      </Text>
                    )}

                  <Text style={styles.label}>Délivré le</Text>
                  <TouchableOpacity style={styles.touchableInput}>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={25}
                      color="black"
                    />
                    <DatePickerField
                      value={values.licenseIssueDate}
                      onChange={(date) =>
                        setFieldValue("licenseIssueDate", date)
                      }
                      error={errors.licenseIssueDate}
                      touched={touched.licenseIssueDate}
                      placeholder="Sélectionnez la date de délivrance"
                      style={styles.Délivré}
                    />
                  </TouchableOpacity>

                  {/* Section 4 : Assuré */}
                  <Text style={styles.sectionTitle}>Assuré</Text>
                  <Text style={styles.label}>Nom</Text>
                  <AppFormField
                    icon="account"
                    placeholder="Nom"
                    name="insuredLastName"
                    value={values.insuredLastName}
                    editable={false}
                  />

                  <Text style={styles.label}>Prénom</Text>
                  <AppFormField
                    icon="account"
                    placeholder="Nom"
                    name="insuredFirstName"
                    value={values.insuredFirstName}
                    editable={false}
                  />

                  <Text style={styles.label}>Adresse</Text>
                  <AppFormField
                    icon="email"
                    placeholder="Adresse"
                    name="insuredAddress"
                    value={values.insuredAddress}
                    editable={false}
                  />

                  <Text style={styles.label}>Téléphone</Text>

                  <AppFormField
                    icon="cellphone"
                    placeholder="telephone"
                    name="insuredPhone"
                    value={values.insuredPhone}
                    editable={false}
                  />

                  <TouchableOpacity
                    style={[
                      styles.SuivantButton,
                      { backgroundColor: step === 1 ? "#de6442" : "#007bff" },
                    ]}
                    onPress={() => SetStep(1)}
                  >
                    <Text style={styles.backButtonText}>Retour</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.SuivantButton,
                      { backgroundColor: step === 2 ? "#de6442" : "#007bff" },
                    ]}
                    onPress={() => SetStep(3)}
                  >
                    <Text style={styles.backButtonText}>Suivant</Text>
                  </TouchableOpacity>
                </>
              )}

              {step === 3 && (
                <>
                  <Text style={styles.label}>Sens suivi</Text>
                  <AppTextInput
                    placeholder="Sens suivi"
                    onChangeText={handleChange("direction")}
                    onBlur={handleBlur("direction")}
                    value={values.direction}
                  />
                  {touched.direction && errors.direction && (
                    <Text style={styles.errorText}>{errors.direction}</Text>
                  )}

                  <Text style={styles.label}>Venant de</Text>
                  <AppTextInput
                    placeholder="Venant de"
                    onChangeText={handleChange("comingFrom")}
                    onBlur={handleBlur("comingFrom")}
                    value={values.comingFrom}
                  />
                  {touched.comingFrom && errors.comingFrom && (
                    <Text style={styles.errorText}>{errors.comingFrom}</Text>
                  )}

                  <Text style={styles.label}>Allant à</Text>
                  <AppTextInput
                    placeholder="Allant à"
                    onChangeText={handleChange("goingTo")}
                    onBlur={handleBlur("goingTo")}
                    value={values.goingTo}
                  />
                  {touched.goingTo && errors.goingTo && (
                    <Text style={styles.errorText}>{errors.goingTo}</Text>
                  )}

                  <Text style={styles.sectionTitle}>Dégâts apparents</Text>

                  {/* Section 5 pour l'enregistrement vocal */}
                  <Text style={styles.sectionTitle}>Vocal</Text>
                  <VoiceRecording
                    onRecordingsChange={(recordings) => {
                      console.log("VoiceRecordings mis à jour :", recordings);
                      setVoiceRecordings(recordings);
                    }}
                  />

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
                    <Text style={styles.errorText}>
                      {errors.damageDescription}
                    </Text>
                  )}

                  <TouchableOpacity
                    style={[
                      styles.SuivantButton,
                      { backgroundColor: step === 1 ? "#de6442" : "#007bff" },
                    ]}
                    onPress={() => SetStep(2)}
                  >
                    <Text style={styles.backButtonText}>Retour</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.SuivantButton,
                      { backgroundColor: step === 3 ? "#de6442" : "#007bff" },
                    ]}
                    onPress={() => SetStep(4)}
                  >
                    <Text style={styles.backButtonText}>Suivant</Text>
                  </TouchableOpacity>
                </>
              )}

              {step === 4 && (
                <>
                  {/* Section 6 : Circonstances */}
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

                  <TouchableOpacity
                    style={[
                      styles.SuivantButton,
                      { backgroundColor: step === 1 ? "#de6442" : "#007bff" },
                    ]}
                    onPress={() => SetStep(3)}
                  >
                    <Text style={styles.backButtonText}>Retour</Text>
                  </TouchableOpacity>

                  {/* Bouton Valider */}

                  <TouchableOpacity
                    style={[
                      styles.SuivantButton,
                      { backgroundColor: "#de6442" },
                    ]}
                    onPress={handleSubmit}
                  >
                    <Text style={styles.backButtonText}>Valider</Text>
                  </TouchableOpacity>
                </>
              )}
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
  touchableInput: {
    width: "100%",
    flex: 1,
    backgroundColor: "#f8f4f4",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: "10%",
    padding: 8,
    marginVertical: 5,
    height: 50,
  },
  inputContainer: {
    backgroundColor: "#f8f4f4",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    marginVertical: 5,
    height: 50,
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
  pickerContainer: {
    marginBottom: 16,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
  },
  registrationContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-around",
  },
  registrationInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  registrationText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  Délivré: {
    color: "#333",
  },

  SuivantButton: {
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 10,
  },

  backButtonText: {
    color: "#fff",
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
});

export default VehiculeA;
