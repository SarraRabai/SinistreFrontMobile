import React from "react";
import { Text } from "react-native";
import styles from "./styles";

function AppText({ children, style, ...otherProps }) {
  return (
    <Text style={[styles.text, style]} {...otherProps}>
      {children}
    </Text>
  );
}

/*const styles = StyleSheet.create({
  text: {
    color: "tomato",
    fontSize: 18,
    fontFamily: "Roboto",
  },
});*/

export default AppText;
