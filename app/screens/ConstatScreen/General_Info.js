import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import CheckBox from "react-native-check-box";
import { Formik } from "formik";
import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import "moment/locale/fr"; // Importer les locales françaises
import CustomPlacePicker from "./CustomPlacePicker";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// Liste des villes de Tunis
const places = [
  { label: "Tunis", value: "Tunis" },
  { label: "Ariana", value: "Ariana" },
  { label: "Ben Arous", value: "Ben Arous" },
  { label: "Manouba", value: "Manouba" },
  { label: "Sfax", value: "Sfax" },
  { label: "Sousse", value: "Sousse" },
  { label: "Kairouan", value: "Kairouan" },
  { label: "Bizerte", value: "Bizerte" },
  { label: "Gabès", value: "Gabès" },
  { label: "Gafsa", value: "Gafsa" },
  { label: "Monastir", value: "Monastir" },
  { label: "Nabeul", value: "Nabeul" },
  { label: "Tataouine", value: "Tataouine" },
  { label: "Tozeur", value: "Tozeur" },
  { label: "Zaghouan", value: "Zaghouan" },
  { label: "Kasserine", value: "Kasserine" },
  { label: "Kébili", value: "Kébili" },
  { label: "Mahdia", value: "Mahdia" },
  { label: "Médenine", value: "Médenine" },
  { label: "Siliana", value: "Siliana" },
  { label: "Jendouba", value: "Jendouba" },
  { label: "Béja", value: "Béja" },
  { label: "Le Kef", value: "Le Kef" },
];

const General_Info = () => {
  const navigation = useNavigation();
  moment.locale("fr");
  const route = useRoute();
  const { vehicleName, accidentId, vehicleType } = route.params || {};

  const [selectedDate, setSelectedDate] = useState(null); // Initialisé à null
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  // Schema de validation avec Yup
  const validationSchema = Yup.object().shape({
    date: Yup.string().required("La date est obligatoire"),
    time: Yup.string().required("L'heure est obligatoire"),
    location: Yup.string().required("Le lieu est obligatoire"),
    injuries: Yup.boolean(),
    otherDamages: Yup.boolean(),
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>
            Informations générales pour {vehicleName || "l'accident"}
          </Text>

          <Formik
            initialValues={{
              date: "",
              time: "",
              location: "",
              injuries: false,
              otherDamages: false,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const accidentId =
                route.params.accidentId ||
                AsyncStorage.getItem("currentAccidentId");

              // Naviguer vers VehiculeA avec les données du formulaire
              navigation.navigate("VehiculeA", {
                generalData: values,
                accidentId: accidentId,
                vehicleType: route.params.vehicleType || "A",
              });
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
            }) => (
              <View>
                {/* Date */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.label}>Date de l’accident</Text>
                  <TouchableOpacity
                    onPress={() => setDatePickerVisibility(true)}
                    style={styles.touchableInput}
                  >
                    <View style={styles.inputContainer}>
                      <MaterialIcons
                        name="calendar-month"
                        size={25}
                        color="black"
                      />
                      <Text style={styles.inputText}>
                        {selectedDate
                          ? moment(selectedDate).format("DD/MM/YYYY")
                          : "Sélectionnez la date"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {touched.date && errors.date && (
                    <Text style={styles.errorText}>{errors.date}</Text>
                  )}

                  {/* Sélecteur de date */}
                  {isDatePickerVisible && (
                    <View style={styles.dateTimePickerContainer}>
                      <DateTimePicker
                        value={selectedDate || new Date()} // Utilisez new Date() comme valeur par défaut pour le sélecteur
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selectedDate) => {
                          setDatePickerVisibility(false);
                          if (selectedDate) {
                            setSelectedDate(selectedDate); // Mettre à jour selectedDate
                            setFieldValue(
                              "date",
                              moment(selectedDate).format("DD/MM/YYYY")
                            );
                          }
                        }}
                      />
                    </View>
                  )}
                </View>

                {/* Heure */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.label}>Heure de l’accident</Text>
                  <TouchableOpacity
                    onPress={() => setTimePickerVisibility(true)}
                    style={styles.touchableInput}
                  >
                    <View style={styles.inputContainer}>
                      <MaterialIcons
                        name="access-time-filled"
                        size={25}
                        color="black"
                      />
                      <Text style={styles.inputText}>
                        {values.time || "Sélectionnez l'heure"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {touched.time && errors.time && (
                    <Text style={styles.errorText}>{errors.time}</Text>
                  )}

                  {/* Sélecteur d'heure */}
                  {isTimePickerVisible && (
                    <View style={styles.dateTimePickerContainer}>
                      <DateTimePicker
                        value={selectedTime}
                        mode="time"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={(event, selectedTime) => {
                          setTimePickerVisibility(false);
                          if (selectedTime) {
                            setSelectedTime(selectedTime);
                            const formattedTime =
                              selectedTime.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              });
                            setFieldValue("time", formattedTime);
                          }
                        }}
                      />
                    </View>
                  )}
                </View>

                {/* Lieu */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.label}>Lieu de l’accident</Text>
                  <TouchableOpacity style={styles.touchableInput}>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons
                        name="map-marker-account"
                        size={25}
                        color="black"
                      />
                      <CustomPlacePicker
                        selectedValue={values.location}
                        onValueChange={(itemValue) => {
                          setFieldValue("location", itemValue);
                        }}
                        items={places}
                      />
                    </View>
                  </TouchableOpacity>

                  {touched.location && errors.location && (
                    <Text style={styles.errorText}>{errors.location}</Text>
                  )}
                </View>

                {/* Espacement entre les sections */}
                <View style={styles.sectionSpacer} />

                {/* Partie 3 : Blessés (même légers) */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>
                    Blessés (même légers) ?
                  </Text>
                  <View style={styles.checkboxContainer}>
                    <Text>Non</Text>
                    <CheckBox
                      isChecked={values.injuries === false}
                      onClick={() => setFieldValue("injuries", false)}
                    />
                    <Text>Oui</Text>
                    <CheckBox
                      isChecked={values.injuries === true}
                      onClick={() => setFieldValue("injuries", true)}
                    />
                  </View>
                </View>

                {/* Partie 4 : Dégâts matériels autres qu’aux véhicules A et B */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>
                    Dégâts matériels autres qu’aux véhicules A et B ?
                  </Text>
                  <View style={styles.checkboxContainer}>
                    <Text>Non</Text>
                    <CheckBox
                      isChecked={values.otherDamages === false}
                      onClick={() => setFieldValue("otherDamages", false)}
                    />
                    <Text>Oui</Text>
                    <CheckBox
                      isChecked={values.otherDamages === true}
                      onClick={() => setFieldValue("otherDamages", true)}
                    />
                  </View>
                </View>

                {/* Bouton Suivant */}
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleSubmit} // Soumettre le formulaire et naviguer
                >
                  <Text style={styles.nextButtonText}>Suivant</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 2,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 0 : 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
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
  inputText: {
    fontSize: 16,
    color: "#0c0c0c",
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
  },
  touchableInput: {
    width: "100%",
  },

  icon: {
    marginRight: 10,
    marginTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "white",
    height: 50,
    justifyContent: "center",
    overflow: "hidden",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  nextButton: {
    backgroundColor: "#de6442",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    width: "100%",
    marginVertical: 10,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  sectionSpacer: {
    height: 16,
  },
  dateTimePickerContainer: {
    marginBottom: 16,
  },
});

export default General_Info;
