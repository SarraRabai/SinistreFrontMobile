import React from "react";
import { StyleSheet, Text } from "react-native";
import defaultStyles from "../config/styles";

function AppText({ children, style, ...otherProps }) {
  return (
    <Text style={[defaultStyles.text, style]} {...otherProps}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "tomato",
    fontSize: 18,
    fontFamily: "Roboto",
  },
});
export default AppText;
