import { Alert, StyleSheet, TouchableNativeFeedback, View } from "react-native";
import React from "react";
import colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";

function ImageInput({ imageUri, onChangeImage }) {
  const handlePress = () => {
    if (!imageUri) selectImage();
    else
      Alert.alert("Delete", "Are you sure you want to delete this image?", [
        { text: "Yes", onPress: () => onChangeImage(null) },
        { text: "No" },
      ]);
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      console.log(result); // Log the result to see its structure
      if (!result.canceled) onChangeImage(result.assets[0].uri);
    } catch (error) {
      console.log("Error getting the permission", error);
    }
  };

  return (
    <TouchableNativeFeedback onPress={handlePress}>
      <View style={styles.container}>
        {!imageUri && (
          <MaterialCommunityIcons
            color={colors.medium}
            name="camera"
            size={40}
          />
        )}
        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.light,
    borderRadius: 15,
    overflow: "hidden",
    height: 100,
    width: 100,
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
export default ImageInput;
