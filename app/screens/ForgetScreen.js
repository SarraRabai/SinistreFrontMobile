import React, { useState } from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Screen from "../components/Screen";
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  ErrorMessage,
  AppForm,
  AppFormField,
  SubmitButton,
} from "../components/forms";

import defaultStyles from "../config/styles";
import UsersApi from "../api/UsersApi";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
});

const ForgetScreen = ({ navigation }) => {
  const [resetFailed, setResetFailed] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false); // State for success message

  const handleSubmit = async ({ email }) => {
    try {
      const result = await UsersApi.forgotPassword(email);
      if (!result.ok || !result.data.success) {
        setResetFailed(true);
        setResetSuccess(false);
        return;
      }
      setResetFailed(false);
      setResetSuccess(true); // Show success message
      // Optionally navigate to a confirmation screen
      // navigation.navigate("ResetConfirmation");
    } catch (error) {
      setResetFailed(true);
      setResetSuccess(false);
    }
  };

  return (
    <Screen style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logo_ctama.png")} />
      <AppForm
        initialValues={{ email: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <ErrorMessage
          error="Adresse email invalide ou non reconnue."
          visible={resetFailed}
        />
        {resetSuccess && (
          <Text style={styles.successMessage}>
            Un nouveau mot de passe a été envoyé à votre email.
          </Text>
        )}
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="email"
          name="email"
          placeholder="Adresse Email"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <SubmitButton title="Envoyer" />
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.backToLogin}>Retour à la connexion</Text>
        </TouchableOpacity>
      </AppForm>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 80,
  },
  successMessage: {
    color: defaultStyles.colors.success || "#008000", // Green for success, adjust if needed
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
  backToLogin: {
    marginTop: 10,
    textAlign: "right",
    textDecorationLine: "underline",
    fontStyle: "italic",
    color: defaultStyles.colors.primary || "#0000FF", // Blue for link, adjust if needed
    fontSize: 16,
  },
});

export default ForgetScreen;
