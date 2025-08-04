import React, { useContext } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AuthContext from "../auth/context";

const Header = () => {
  const { user } = useContext(AuthContext);
  const username = user ? user.name : "Invité";

  return (
    <View>
      <View style={styles.companyBar}>
        <Image
          source={require("../assets/logo_ctama.png")}
          style={styles.logo}
        />
        <Text style={styles.companyName}>Mon constat Ctama</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerText}>Bonjour, {username}</Text>
        <TouchableOpacity>
          <MaterialIcons name="settings" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  companyBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2B6CB0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    padding: 16,
    borderRadius: 10,
  },
  headerText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Header;
