import React, { useRef, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import ImageInput from "./ImageInput";

function ImageInputList({ imageUris = [], onRemoveImage, onAddImage }) {
  const scrollView = useRef();

  /*const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "You need to enable permission to access the library."
      );
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);
*/
  return (
    <View>
      <ScrollView
        ref={scrollView}
        //style={{ backgroundColor: "yellow" }}
        horizontal
        onContentSizeChange={() => scrollView.current.scrollToEnd()}
      >
        <View style={styles.container}>
          {imageUris.map((uri) => (
            <ImageInput
              imageUri={uri}
              key={uri}
              onChangeImage={() => onRemoveImage(uri)}
            />
          ))}
          <ImageInput onChangeImage={(uri) => onAddImage(uri)} />
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // our list is horizontal
    flexWrap: "wrap", // Allow wrapping to the next line
    padding: 10, // Optional: Add padding around the container
  },
});
export default ImageInputList;
