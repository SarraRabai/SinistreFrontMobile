import React from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import AppButton from "../components/AppButton";
import { LinearGradient } from "expo-linear-gradient";

function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={["#f3f9f9", "#5e7ca5"]} // Dégradé (couleurs personnalisables)
      start={{ x: 0, y: 0 }} // Début en haut
      end={{ x: 1, y: 1 }} // Fin en bas
      style={styles.background}
    >
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../assets/logo_ctama.png")}
        />
        <Text style={styles.tagline}>Mon Constat Ctama</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <AppButton
          title="Login"
          color="ctama2"
          onPress={() => {
            navigation.navigate("Login");
          }}
        />
        {/* <AppButton
          title="Register"
          color="ctama1"
          onPress={() => navigation.navigate("Register")}
        /> */}
      </View>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1, //take the entire screen
    justifyContent: "center", //"flex-end",
    alignItems: "center",
  },
  tagline: {
    fontSize: 25,
    fontWeight: "600",
    paddingVertical: 20,
    color: "#5e7ca5",
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
  },
  logo: {
    width: 100,
    height: 100,
  },
  logoContainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },
});
export default WelcomeScreen;
