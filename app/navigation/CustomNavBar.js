import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const CustomNavBar = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    {
      name: "Home",
      icon: <MaterialIcons name="home" size={24} />,
      label: "Home",
    },
    {
      name: "listeAdmin",
      icon: <MaterialCommunityIcons name="facebook-messenger" size={24} />,
      label: "messages",
    },
    {
      name: "AccountScreen",
      icon: <MaterialIcons name="person" size={24} />,
      label: "Profile",
    },
  ];

  return (
    <View style={styles.navBarContainer}>
      {tabs.map((tab, index) => {
        const isActive = route.name === tab.name;

        return (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(tab.name)}
            activeOpacity={0.7}
            style={styles.tabButton}
          >
            <View
              style={isActive ? styles.activeWrapper : styles.inactiveWrapper}
            >
              {isActive && (
                <View style={styles.circleBehindIcon}>
                  {React.cloneElement(tab.icon, { color: "#7A3FFF" })}
                </View>
              )}
              {!isActive && (
                <View style={styles.iconOnly}>
                  {React.cloneElement(tab.icon, { color: "#bbb" })}
                </View>
              )}
            </View>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navBarContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 1,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    height: 70,
    width: width,
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activeWrapper: {
    position: "absolute",
    top: -25,
    alignItems: "center",
    justifyContent: "center",
  },
  inactiveWrapper: {
    position: "absolute",
    top: -25,
    alignItems: "center",
    justifyContent: "center",
  },
  circleBehindIcon: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 35,
    elevation: 8,
    shadowColor: "#7A3FFF",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  iconOnly: {
    padding: 14,
  },
  label: {
    fontSize: 12,
    color: "#bbb",
    marginTop: 30,
  },
  activeLabel: {
    color: "#7A3FFF",
    fontWeight: "bold",
  },
});

export default CustomNavBar;
