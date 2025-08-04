import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { Audio } from "expo-av";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

export default function VoiceRecording({ onRecordingsChange }) {
  const [recording, setRecording] = React.useState(null);
  const [recordings, setRecordings] = React.useState([]);
  const [recordingDuration, setRecordingDuration] = React.useState(0);
  const [intervalId, setIntervalId] = React.useState(null);
  const [timeoutId, setTimeoutId] = React.useState(null);

  async function startRecording() {
    try {
      // Demander la permission d'enregistrement
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert(
          "Permission requise",
          "L'accès au microphone est nécessaire"
        );
        return;
      }

      // Configurer le mode audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        playThroughEarpieceAndroid: false,
        shouldDuckAndroid: false,
      });

      // Démarrer un nouvel enregistrement
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );

      setRecording(newRecording);
      setRecordingDuration(0);

      // Timer pour la durée d'enregistrement
      const interval = setInterval(() => {
        setRecordingDuration((prev) => {
          if (prev >= 60) {
            stopRecording();
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
      setIntervalId(interval);

      // Timeout pour l'arrêt automatique après 60s
      const timeout = setTimeout(() => {
        stopRecording();
        Alert.alert(
          "Info",
          "Enregistrement automatiquement arrêté après 1 minute"
        );
      }, 60000);
      setTimeoutId(timeout);
    } catch (error) {
      console.error("Erreur lors du démarrage:", error);
      Alert.alert("Erreur", "Impossible de démarrer l'enregistrement");
    }
  }

  async function stopRecording() {
    if (!recording) return;

    try {
      // Sauvegarder la référence avant de nettoyer
      const recordingToStop = recording;

      // Nettoyer immédiatement les états et timers
      cleanUp();

      // Arrêter l'enregistrement si nécessaire
      if (recordingToStop._isDoneRecording === false) {
        await recordingToStop.stopAndUnloadAsync();
      }

      // Récupérer l'URI de l'enregistrement
      const uri = recordingToStop.getURI();
      if (!uri) throw new Error("Aucun enregistrement trouvé");

      // Ajouter le nouvel enregistrement à la liste
      const newRecording = {
        uri,
        duration: getDurationFormatted(recordingDuration * 1000),
      };

      const updatedRecordings = [...recordings, newRecording];
      setRecordings(updatedRecordings);

      // Notifier le composant parent si la prop existe
      if (onRecordingsChange) {
        onRecordingsChange(updatedRecordings);
      }
    } catch (error) {
      console.error("Erreur lors de l'arrêt:", error);
      Alert.alert("Erreur", "Problème lors de l'arrêt de l'enregistrement");
    }
  }

  function cleanUp() {
    // Nettoyer tous les timers et états
    if (intervalId) clearInterval(intervalId);
    if (timeoutId) clearTimeout(timeoutId);
    setRecording(null);
    setRecordingDuration(0);
    setIntervalId(null);
    setTimeoutId(null);
  }

  async function playRecording(uri) {
    try {
      // Configurer le mode audio pour la lecture
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
      });

      // Créer et jouer le son
      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();

      // Nettoyer automatiquement après la lecture
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Erreur de lecture:", error);
      Alert.alert("Erreur", "Impossible de lire l'enregistrement");
    }
  }

  function deleteRecording(index) {
    try {
      const updatedRecordings = [...recordings];
      updatedRecordings.splice(index, 1);

      setRecordings(updatedRecordings);

      // Notifier le composant parent si la prop existe
      if (onRecordingsChange) {
        onRecordingsChange(updatedRecordings);
        console.log("onRecordingsChange appelé avec :", updatedRecordings);
      }
    } catch (error) {
      console.error("Erreur de suppression:", error);
      Alert.alert("Erreur", "Impossible de supprimer l'enregistrement");
    }
  }

  function getDurationFormatted(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  // Nettoyage quand le composant est démonté
  React.useEffect(() => {
    return cleanUp;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.recordingHeader}>
        <TouchableOpacity
          onPress={recording ? stopRecording : startRecording}
          style={styles.recordButton}
        >
          {recording ? (
            <FontAwesome name="stop" size={24} color="white" />
          ) : (
            <MaterialIcons name="mic" size={24} color="white" />
          )}
        </TouchableOpacity>

        {recording && (
          <Text style={styles.durationText}>
            {getDurationFormatted(recordingDuration * 1000)}
          </Text>
        )}
      </View>

      <View style={styles.recordingsList}>
        {recordings.map((rec, index) => (
          <View key={index} style={styles.recordingItem}>
            <Text style={styles.recordingText}>
              Enregistrement #{index + 1} - {rec.duration}
            </Text>

            <View style={styles.actions}>
              <TouchableOpacity
                onPress={() => playRecording(rec.uri)}
                style={styles.actionButton}
              >
                <FontAwesome name="play" size={16} color="white" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => deleteRecording(index)}
                style={[styles.actionButton, { backgroundColor: "#ff4444" }]}
              >
                <MaterialIcons name="delete" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  recordingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 10,
  },
  recordButton: {
    backgroundColor: "#ff3d00",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  durationText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  recordingsList: {
    flex: 1,
  },
  recordingItem: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  recordingText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  actions: {
    flexDirection: "row",
    marginLeft: 10,
  },
  actionButton: {
    backgroundColor: "#6200ee",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});
