import React, { useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import ImageViewing from "react-native-image-viewing";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

const ConstatModal = ({ visible, onClose, selectedItem, client }) => {
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const imageKeys = [
    { key: "frontImage", label: "Image de face" },
    { key: "backImage", label: "Image de dos" },
    { key: "leftImage", label: "Image de gauche" },
    { key: "rightImage", label: "Image de droite" },
  ];

  if (!selectedItem) return null;

  const imageList = imageKeys
    .filter(({ key }) => selectedItem[key])
    .map(({ key }) => ({
      uri: client?.getBaseURL() + `/${selectedItem[key]}`,
    }));

  const openImageViewer = (index) => {
    setCurrentImageIndex(index);
    setIsImageVisible(true);
  };

  const downloadImage = async () => {
    try {
      const uri = imageList[currentImageIndex].uri;
      const filename = uri.split("/").pop();
      const fileUri = FileSystem.documentDirectory + filename;

      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "L'accès à la galerie est requis pour télécharger."
        );
        return;
      }

      const downloadedFile = await FileSystem.downloadAsync(uri, fileUri);
      await MediaLibrary.saveToLibraryAsync(downloadedFile.uri);

      Alert.alert("Succès", "Image téléchargée dans la galerie !");
    } catch (error) {
      console.error("Erreur téléchargement:", error);
      Alert.alert("Erreur", "Échec du téléchargement de l'image.");
    }
  };

  const isValidDateField = (key, value) => {
    const dateKeys = ["validFrom", "validTo", "licenseIssueDate", "date"];
    return dateKeys.includes(key) && !isNaN(Date.parse(value));
  };

  const getIconForField = (key) => {
    switch (key) {
      case "date":
      case "validFrom":
      case "validTo":
      case "licenseIssueDate":
        return "calendar-outline";
      case "location":
        return "location-outline";
      case "time":
        return "time-outline";
      default:
        return "information-circle-outline";
    }
  };

  const scrollLeft = () => {
    scrollViewRef.current?.scrollTo({
      x: -150,
      animated: true,
    });
  };

  const scrollRight = () => {
    scrollViewRef.current?.scrollTo({
      x: 200,
      animated: true,
    });
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Détails du constat</Text>

              <View style={styles.imageWrapper}>
                <TouchableOpacity
                  onPress={scrollLeft}
                  style={styles.arrowButton}
                >
                  <Ionicons
                    name="chevron-back-circle"
                    size={28}
                    color={colors.ctama1}
                  />
                </TouchableOpacity>

                <ScrollView
                  horizontal
                  ref={scrollViewRef}
                  style={styles.imageScroll}
                  showsHorizontalScrollIndicator={false}
                >
                  {imageKeys.map(({ key, label }, index) =>
                    selectedItem[key] ? (
                      <TouchableOpacity
                        key={key}
                        onLongPress={() => openImageViewer(index)}
                        delayLongPress={300}
                      >
                        <View style={styles.imageContainer}>
                          <Text style={styles.modalLabel}>{label}</Text>
                          <Image
                            source={{
                              uri:
                                client?.getBaseURL() + `/${selectedItem[key]}`,
                            }}
                            style={styles.constatImage}
                          />
                        </View>
                      </TouchableOpacity>
                    ) : null
                  )}
                </ScrollView>

                <TouchableOpacity
                  onPress={scrollRight}
                  style={styles.arrowButton}
                >
                  <Ionicons
                    name="chevron-forward-circle"
                    size={28}
                    color={colors.ctama1}
                  />
                </TouchableOpacity>
              </View>

              {Object.entries(selectedItem)
                .filter(
                  ([key]) =>
                    ![
                      "_id",
                      "__v",
                      "userId",
                      "accidentId",
                      "frontImage",
                      "backImage",
                      "leftImage",
                      "rightImage",
                    ].includes(key)
                )
                .map(([key, value]) => (
                  <View key={key} style={styles.modalRow}>
                    <Ionicons
                      name={getIconForField(key)}
                      size={20}
                      color={colors.black}
                      style={styles.modalIcon}
                    />
                    <Text style={styles.modalLabel}>{key}:</Text>
                    <Text style={styles.modalValue}>
                      {typeof value === "boolean"
                        ? value
                          ? "Oui"
                          : "Non"
                        : isValidDateField(key, value)
                        ? new Date(value).toLocaleDateString()
                        : String(value)}
                    </Text>
                  </View>
                ))}

              <Pressable style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>Fermer</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <ImageViewing
        images={imageList}
        imageIndex={currentImageIndex}
        visible={isImageVisible}
        onRequestClose={() => setIsImageVisible(false)}
        FooterComponent={() => (
          <TouchableOpacity
            onPress={downloadImage}
            style={styles.downloadButton}
          >
            <Ionicons name="download-outline" size={24} color="white" />
            <Text style={styles.downloadText}>Télécharger</Text>
          </TouchableOpacity>
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: colors.ctama1,
    textAlign: "center",
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  modalIcon: {
    marginRight: 8,
  },
  modalLabel: {
    fontWeight: "bold",
    color: colors.dark,
    marginRight: 5,
  },
  modalValue: {
    color: colors.medium,
    flexShrink: 1,
  },
  imageWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  arrowButton: {
    padding: 2,
  },
  imageScroll: {
    flexGrow: 0,
  },
  imageContainer: {
    marginRight: 10,
    alignItems: "center",
  },
  constatImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 5,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: colors.ctama1,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  downloadButton: {
    backgroundColor: colors.ctama1,
    padding: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 10,
    margin: 20,
  },
  downloadText: {
    color: "white",
    marginLeft: 8,
    fontWeight: "bold",
  },
});

export default ConstatModal;
