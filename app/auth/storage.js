import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

const key = "authToken";

const storeToken = async (authToken) => {
  try {
    await SecureStore.setItemAsync(key, authToken);
    // console.log("Token stored successfully:", authToken);
  } catch (error) {
    console.log("Error storing the auth token", error);
  }
};

const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync(key);
    if (!token) {
      console.log("Aucun token trouvé");
      return null;
    }

    return token;
  } catch (error) {
    console.log("Erreur de récupération:", error);
    return null;
  }
};

const getUser = async () => {
  const token = await getToken();

  return token ? jwtDecode(token) : null;
};

// when the user logs out
const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log("Error removing the auth token", error);
  }
};

export default {
  getToken,
  getUser,
  storeToken,
  removeToken,
};
