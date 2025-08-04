import React, { useRef, useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";

const CameraScreen = ({ route, navigation }) => {
  const { onImageCapture, side } = route.params; // Récupérer les paramètres
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null);
  const [uri, setUri] = useState(null); // État pour l'image capturée
  const [facing, setFacing] = useState("back");
  const [flash, setFlash] = useState("off");

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          Nous avons besoin de votre permission pour utiliser la caméra
        </Text>
        <Button onPress={requestPermission} title="Autoriser" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();

    setUri(photo?.uri); // Stocker l'URI de l'image capturée
  };

  const validateImage = () => {
    if (uri) {
      onImageCapture(uri, side); // Renvoyer l'URI de l'image capturée et le côté
      navigation.goBack(); // Revenir à l'écran précédent
    }
  };

  const renderCamera = () => {
    return (
      <CameraView
        style={styles.camera}
        ref={ref}
        facing={facing}
        flash={flash}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      >
        <View style={styles.shutterContainer}>
          <Pressable onPress={() => setFlash(flash === "off" ? "on" : "off")}>
            <MaterialIcons
              name={flash === "off" ? "flash-off" : "flash-on"}
              size={32}
              color="white"
            />
          </Pressable>

          <Pressable onPress={takePicture}>
            <View style={styles.shutterBtn}>
              <View style={styles.shutterBtnInner} />
            </View>
          </Pressable>

          <Pressable onPress={() => navigation.goBack()}>
            <FontAwesome6 name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
      </CameraView>
    );
  };

  return (
    <View style={styles.container}>
      {uri ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri }}
            contentFit="cover"
            style={styles.fullScreenImage}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.redButton]}
              onPress={() => setUri(null)}
            >
              <Text style={styles.buttonText}>Reprendre</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.greenButton]}
              onPress={validateImage}
            >
              <Text style={styles.buttonText}>Valider</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        renderCamera()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  shutterContainer: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "white",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  redButton: {
    backgroundColor: "red",
  },
  greenButton: {
    backgroundColor: "green",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CameraScreen;
