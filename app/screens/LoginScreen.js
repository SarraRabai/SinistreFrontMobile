import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, Text } from "react-native"; // Added Text
import Screen from "../components/Screen";
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  ErrorMessage,
  AppForm,
  AppFormField,
  SubmitButton,
} from "../components/forms";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import defaultStyles from "../config/styles";
import colors from "../config/colors";

const validationSchema = Yup.object().shape({
  cin: Yup.string().required().label("CIN"),
  password: Yup.string().required().min(4).label("Password"),
});

function LoginScreen(props) {
  const auth = useAuth();
  const [loginFailed, setLoginFailed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async ({ cin, password }) => {
    const result = await authApi.login(cin, password);

    if (!result.ok || !result?.data?.data?.token) {
      return setLoginFailed(true);
    }

    await auth.logIn(result?.data?.data?.token);
    setLoginFailed(false);
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle forgotten password click
  const handleForgotPassword = () => {
    props.navigation.navigate("Forget");
  };

  return (
    <Screen style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logo_ctama.png")} />
      <AppForm
        initialValues={{ cin: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <ErrorMessage
          error="CIN ou mot de passe invalide."
          visible={loginFailed}
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="id-card"
          name="cin"
          placeholder="CIN"
          keyboardType="numeric"
        />
        <AppFormField
          autoCapitalize="none"
          autoCorrect={false}
          icon="lock"
          name="password"
          placeholder="Password"
          secureTextEntry={!showPassword}
          textContentType="password"
          rightIcon={
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <MaterialCommunityIcons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color={defaultStyles.colors.medium}
              />
            </TouchableOpacity>
          }
        />
        <SubmitButton title="Login" />
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
        </TouchableOpacity>
      </AppForm>
    </Screen>
  );
}

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
  forgotPassword: {
    marginTop: 10,
    textAlign: "right",
    textDecorationLine: "underline",
    fontStyle: "italic",
    color: colors.primary,
    fontSize: 16,
  },
});

export default LoginScreen;
