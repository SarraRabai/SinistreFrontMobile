import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, Button } from "react-native";
import * as Yup from "yup";
import { useFormikContext } from "formik";

import Screen from "../components/Screen";
import usersApi from "../api/users";
import authApi from "../api/auth";

import {
  AppForm as Form,
  AppFormField as FormField,
  SubmitButton,
  ErrorMessage,
} from "../components/forms";
import useApi from "../hooks/useApi";
import ActivityIndicator from "../components/ActivityIndicator";
import VehicleTypePicker from "../components/forms/VehicleTypePicker";
import DateRangePickerField from "./ConstatScreen/DateRangePickerField";
import FormFieldCheckbox from "../components/forms/FormFieldCheckbox";
import { TouchableOpacity } from "react-native";
import AssurePicker from "../components/forms/AssurePicker";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  cin: Yup.string().required().label("CIN"),
  password: Yup.string().required().min(4).label("Password"),
  numberOfvehicules: Yup.number()
    .required()
    .min(1)
    .label("Nombre de véhicules"),
  vehicules: Yup.array().of(
    Yup.object().shape({
      brand: Yup.string().required().label("Brand"),
      registration: Yup.string().required().label("Registration"),
      insuranceStartDate: Yup.string().required().label("Insurance Start Date"),
      insuranceEndDate: Yup.string().required().label("Insurance End Date"),
    })
  ),
});

const CATEGORIES = ["A1", "B", "BE", "C", "CE", "D", "DE", "G"];

function RegisterScreen() {
  const registerApi = useApi(usersApi.register);

  const [error, setError] = useState();
  const [vehicleCount, setVehicleCount] = useState(0);
  const [step, setStep] = useState(1); // 1: user info, 2: vehicle info

  const handleSubmit = async (userInfo) => {
    const {
      name,
      prenom,
      cin,
      password,
      numeroTelephone,
      adresse,
      numeroPermis,
      dateDelivrance,
      dateExpiration,
      categoriesPermis,
      vehicules,
    } = userInfo;

    const result = await registerApi.request({
      name,
      prenom,
      cin,
      password,
      vehicules,
      numeroTelephone,
      adresse,
      numeroPermis,
      dateDelivrance,
      dateExpiration,
      categoriesPermis,
    });

    if (!result.ok) {
      setError(result.data?.error || "Erreur d'enregistrement");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  };

  return (
    <>
      <ActivityIndicator visible={registerApi.loading} />
      <Screen style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Form
            initialValues={{
              name: "",
              prenom: "",
              cin: "",
              password: "",
              numeroTelephone: "",
              adresse: "",
              numeroPermis: "",
              dateDelivrance: "",
              dateExpiration: "",
              numberOfvehicules: "",
              vehicules: [],
              categoriesPermis: [],
            }}
            onSubmit={handleSubmit}
            // validationSchema={validationSchema}
          >
            {step === 1 && (
              <>
                <FormField
                  autoCorrect={false}
                  icon="account"
                  name="name"
                  placeholder="Nom"
                />

                <FormField
                  autoCorrect={false}
                  icon="account"
                  name="prenom"
                  placeholder="Prénom"
                />
                <FormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="id-card"
                  name="cin"
                  placeholder="N°CIN"
                  keyboardType="numeric"
                />
                <FormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="lock"
                  name="password"
                  placeholder="mot de passe"
                  secureTextEntry
                  textContentType="password"
                />
                <FormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="cellphone"
                  name="numeroTelephone"
                  placeholder="N°Téléphone"
                  keyboardType="numeric"
                />

                <FormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="map-marker-account"
                  name="adresse"
                  placeholder="Adresse"
                />

                <FormField
                  autoCapitalize="none"
                  autoCorrect={false}
                  icon="card-account-details-star"
                  name="numeroPermis"
                  placeholder="N°Permis"
                  keyboardType="numeric"
                />
                <DateRangeFormField label="validité de permis" />
                <Text style={styles.label}>Catégories de permis</Text>
                <View style={styles.checkboxContainer}>
                  {CATEGORIES.map((cat) => (
                    <FormFieldCheckbox
                      key={cat}
                      name="categoriesPermis"
                      value={cat}
                      label={cat}
                    />
                  ))}
                </View>
                <TouchableOpacity
                  style={[
                    styles.SuivantButton,
                    { backgroundColor: step === 1 ? "#de6442" : "#007bff" },
                  ]}
                  onPress={() => setStep(2)}
                >
                  <Text style={styles.backButtonText}>Suivant</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 2 && (
              <>
                <FormField
                  icon="car"
                  name="numberOfvehicules"
                  placeholder="Nombre de véhicules"
                  keyboardType="numeric"
                  onChangeText={(value) => setVehicleCount(Number(value))}
                />
                {Array.from({ length: vehicleCount }).map((_, index) => (
                  <View key={index} style={styles.vehicleForm}>
                    <Text style={styles.vehicleTitle}>
                      Véhicule {index + 1}
                    </Text>
                    <FormField
                      name={`vehicules[${index}].brand`}
                      placeholder="Brand"
                      icon="car"
                    />
                    <FormField
                      name={`vehicules[${index}].numeroSerie`}
                      placeholder="N° Serie"
                      keyboardType="numeric"
                      icon="car"
                    />

                    <VehicleTypePicker index={index} />
                    <FormField
                      name={`vehicules[${index}].numeroMatricule`}
                      placeholder="N° Matricule"
                      keyboardType="numeric"
                      icon="car"
                    />

                    <AssurePicker index={index} />

                    <FormField
                      name={`vehicules[${index}].numeroContrat`}
                      placeholder="Contrat d'Assurance N°"
                      icon="car"
                      keyboardType="phone-pad"
                    />

                    <FormField
                      name={`vehicules[${index}].agence`}
                      placeholder="Agence"
                      icon="home"
                    />
                    <FormField
                      name={`vehicules[${index}].insuranceStartDate`}
                      placeholder="Insurance Start Date"
                      icon="calendar"
                    />
                    <FormField
                      name={`vehicules[${index}].insuranceEndDate`}
                      placeholder="Insurance End Date"
                      icon="calendar"
                    />
                  </View>
                ))}
                <TouchableOpacity
                  style={[
                    styles.SuivantButton,
                    { backgroundColor: step === 1 ? "#de6442" : "#007bff" },
                  ]}
                  onPress={() => setStep(1)}
                >
                  <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
                <ErrorMessage error={error} visible={!!error} />
                <SubmitButton color="ctama1" title="Register" />
              </>
            )}
          </Form>
        </ScrollView>
      </Screen>
    </>
  );
}

function DateRangeFormField({ label }) {
  const { values, setFieldValue } = useFormikContext();
  return (
    <View style={{ marginVertical: 10 }}>
      <DateRangePickerField
        label={label}
        startDate={values.dateDelivrance}
        endDate={values.dateExpiration}
        onStartDateChange={(date) => setFieldValue("dateDelivrance", date)}
        onEndDateChange={(date) => setFieldValue("dateExpiration", date)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  vehicleForm: {
    marginTop: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
  },
  vehicleTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
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

export default RegisterScreen;
