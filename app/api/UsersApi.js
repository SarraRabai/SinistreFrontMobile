import client from "./client"; // Importez votre client API (axios ou apisauce)
import authStorage from "../../app/auth/storage";

const CurrentUser = async () => {
  try {
    const token = await authStorage.getToken();
    return client.get(
      "/users/currentUser",

      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};
//  if (currentIndex >= mesVehicules.length - 1) return; // Ne pas aller plus loin que le dernier

const getMesVehicules = async () => {
  const token = await authStorage.getToken();
  try {
    return client.get(
      "/users/getAllVehicule",

      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

const getListAdmin = async () => {
  try {
    const token = await authStorage.getToken();
    return client.get(
      "/admin/getListAdminSidBar",

      {
        headers: {
          "x-auth-token": token,
        },
      }
    );
  } catch (error) {
    throw error;
  }
};

// Forgot Password function
const forgotPassword = (email) => {
  return client.post("/user/resetpassword", { email });
};
export default {
  CurrentUser,
  getMesVehicules,
  getListAdmin,
  forgotPassword,
};
