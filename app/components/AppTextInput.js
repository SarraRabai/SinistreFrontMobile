import React from "react";
import { TextInput, View, StyleSheet, Platform } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import defaultStyles from "../config/styles";

function AppTextInput({ icon, rightIcon, width = "100%", ...otherProps }) {
  return (
    <View style={[styles.container, { width }]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={defaultStyles.colors.medium}
          style={styles.icon}
        />
      )}
      <TextInput
        style={[defaultStyles.text, styles.textInput]}
        {...otherProps}
      />
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center", // Center items vertically
    padding: 8,
    marginVertical: 5,
  },
  textInput: {
    flex: 1, // Take remaining space
    color: colors.dark,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
  },
  icon: {
    marginRight: 10,
    marginLeft: 10, // Add some left margin for consistency
  },
  rightIcon: {
    marginLeft: 10,
    marginRight: 10, // Add some right margin for consistency
  },
});

export default AppTextInput;
