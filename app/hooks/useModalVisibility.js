import { useRef, useState } from "react";
import PoliciesContent from "../components/PoliciesContent";
import AgentsContent from "../components/AgentsContent";
import MapsContent from "../components/MapsContent";

const useModalVisibility = () => {
  const bottomSheetRef = useRef(null);
  const [bottomSheetContent, setBottomSheetContent] = useState(null); // État pour le contenu

  // Fonction pour ouvrir le Bottom Sheet
  const handlePoliciesClick = () => {
    //console.log("Bottom Sheet ouvert"); // Ajoute un log pour déboguer
    /*if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0);
    } // Ouvre le Bottom Sheet*/
    setBottomSheetContent(<PoliciesContent />); // Utilise le composant PoliciesContent
    bottomSheetRef.current?.snapToIndex(0); // Ouvre le Bottom Sheet
  };

  // Fonctions pour Agents et Maps (si nécessaire)
  const handleAgentsClick = () => {
    setBottomSheetContent(<AgentsContent />); // Utilise le composant PoliciesContent
    bottomSheetRef.current?.snapToIndex(0); // Ouvre le Bottom Sheet
  };

  const handleMapsClick = () => {
    setBottomSheetContent(<MapsContent />); // Utilise le composant PoliciesContent
    bottomSheetRef.current?.snapToIndex(0); // Ouvre le Bottom Sheet
  };
  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  };

  // Retourne la référence et les fonctions pour les gérer
  return {
    bottomSheetRef,
    bottomSheetContent,
    handlePoliciesClick,
    handleAgentsClick,
    handleMapsClick,
    closeBottomSheet,
  };
};

export default useModalVisibility;
