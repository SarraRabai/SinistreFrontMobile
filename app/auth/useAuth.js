import { useContext } from "react";
import AuthContext from "./context";
import authStorage from "./storage";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const { user, setUser, token, setToken } = useContext(AuthContext);

  const logIn = async (authToken) => {
    try {
      if (!authToken || typeof authToken !== "string") {
        console.error("Token invalide:", authToken);
        return;
      }

      const user = jwtDecode(authToken);
      setUser(user);
      setToken(authToken);
      await authStorage.storeToken(authToken);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    }
  };

  const logOut = async () => {
    setUser(null);
    setToken(null);
    await authStorage.removeToken();
    console.log("Déconnexion réussie");
  };

  return { token, user, logIn, logOut };
};

export default useAuth;
