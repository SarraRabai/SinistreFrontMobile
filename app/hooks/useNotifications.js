import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import * as Device from "expo-device";
import expoPushTokensApi from "../api/expoPushTokens";

export default useNotifications = (notificationListener) => {
  useEffect(() => {
    registerForPushNotifications();

    if (notificationListener)
      Notifications.addPushTokenListener(notificationListener);
  }, []); //we call it only once

  const registerForPushNotifications = async () => {
    try {
      if (Device.isDevice) {
        // Vérifie les autorisations existantes
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // Demande des autorisations si elles ne sont pas déjà accordées
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          console.log(
            "Échec de l’obtention du jeton pour les notifications push"
          );
          return;
        }

        // Obtention du jeton d'exposition
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        expoPushTokensApi.register(token);
      } else {
        console.log(
          "Vous devez utiliser un appareil physique pour les notifications push"
        );
      }
    } catch (error) {
      console.log("Error getting a push token ", error);
    }
  };
};
