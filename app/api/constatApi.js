import client from "./client"; // Importez votre client API (axios ou apisauce)
import authStorage from "../../app/auth/storage";

// Fonction pour parser les dates au format "dd/MM/yyyy" ou "YYYY-MM-DD"

const parseDate = (dateString) => {
  if (!dateString) return null; // Si la date est null, undefined ou une chaîne vide, retourne null

  let dateObject;

  // Vérifier si la date est au format "dd/MM/yyyy"
  const dateRegexDDMMYYYY = /^\d{2}\/\d{2}\/\d{4}$/;
  if (dateRegexDDMMYYYY.test(dateString)) {
    const [day, month, year] = dateString.split("/");
    dateObject = new Date(`${year}-${month}-${day}`);
  }
  // Vérifier si la date est au format "YYYY-MM-DD"
  else if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    dateObject = new Date(dateString);
  }
  // Si la date n'est dans aucun des formats attendus
  else {
    console.warn(`Date invalide : ${dateString}`);
    return null;
  }

  // Vérifier si la date est valide
  if (isNaN(dateObject.getTime())) {
    console.warn(`Date invalide après conversion : ${dateString}`);
    return null;
  }

  // Convertir la date en format ISO
  return dateObject.toISOString();
};

const endpoint = "/addConstat/addConstat";

// Uploader tous les fichiers en une seule requête
const uploadFiles = async (images = [], voices = []) => {
  try {
    const formData = new FormData();

    const imageFiles = images
      .filter((img) => img && !img.startsWith("http"))
      .map((uri, index) => ({
        uri,
        name: `image_${index}.jpg`,
        type: "image/jpeg",
      }));

    const voiceFiles = voices
      .filter((audio) => audio && !audio.startsWith("http"))
      .map((uri, index) => ({
        uri,
        name: `voice_${index}.m4a`,
        type: "audio/m4a",
      }));

    const allFiles = [...imageFiles, ...voiceFiles];

    if (allFiles.length === 0) {
      return { images: [], voices: [] };
    }

    allFiles.forEach((file) => {
      formData.append("files", file);
    });

    const response = await client.post("/upload/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.ok) {
      throw new Error(response.problem || "Upload échoué");
    }

    const uploadedUrls = response.data?.urls || [];

    const uploadedImages = uploadedUrls.slice(0, imageFiles.length);
    const uploadedVoices = uploadedUrls.slice(imageFiles.length);

    return {
      images: uploadedImages,
      voices: uploadedVoices,
    };
  } catch (error) {
    console.error("Erreur lors de l'upload :", error.message);
    throw error;
  }
};

// Fonction pour ajouter un constat
const addConstat = async (constat, onUploadProgress) => {
  try {
    if (!constat.accidentId) {
      throw new Error("L'ID d'accident est requis");
    }

    const token = await authStorage.getToken();

    // Convertir les dates en format ISO
    const isoDate = parseDate(constat.date) || new Date().toISOString();
    const isoValidFrom =
      parseDate(constat.validFrom) || new Date().toISOString();
    const isoValidTo = parseDate(constat.validTo) || new Date().toISOString();
    const isoLicenseIssueDate =
      parseDate(constat.licenseIssueDate) || new Date().toISOString();

    // Préparer les fichiers à uploader
    const imagesToUpload = [
      constat.frontImage,
      constat.backImage,
      constat.leftImage,
      constat.rightImage,
    ].filter(Boolean);
    //console.log("Nombre d’images envoyées :", uploadedImages.length);
    const voicesToUpload = (constat.voiceRecordings || []).map((r) => r.uri);

    // Uploader tous les fichiers en une seule fois
    const { images: uploadedImages, voices: uploadedVoices } =
      await uploadFiles(imagesToUpload, voicesToUpload);

    // Préparer les données du formulaire
    const data = {
      // Données de la partie 1 (General_Info)
      date: isoDate,
      time: constat.time || "",
      location: constat.location || "",
      injuries: constat.injuries || false,
      otherDamages: constat.otherDamages || false,

      // Données de la partie 2 (VehiculeA)
      insuredVehicle: constat?.insuredVehicle || "",
      contractNumber: constat?.contractNumber || "",
      agency: constat?.agency || "",
      validFrom: isoValidFrom,
      validTo: isoValidTo,
      driverLastName: constat?.driverLastName || "",
      driverFirstName: constat?.driverFirstName || "",
      driverAddress: constat.driverAddress || "",
      driverLicenseNumber: constat?.driverLicenseNumber || "",
      licenseIssueDate: isoLicenseIssueDate,
      insuredLastName: constat?.insuredLastName || "",
      insuredFirstName: constat?.insuredFirstName || "",
      insuredAddress: constat?.insuredAddress || "",
      insuredPhone: constat?.insuredPhone || "",
      vehicleBrand: constat?.vehicleBrand || "",
      vehicleRegistration: constat?.vehicleRegistration || "",
      vehicleType: constat?.vehicleType || "",
      face: constat?.face || "",
      direction: constat.direction || "",
      comingFrom: constat?.comingFrom || "",
      goingTo: constat?.goingTo || "",
      damageDescription: constat?.damageDescription || "",
      circumstances: constat?.circumstances || {},
      numberOfCheckedBoxes: constat?.numberOfCheckedBoxes || 0,
      // voiceRecordings: "",
      accidentId: constat?.accidentId,
      //vehicleLetter: constat.vehicleLetter,

      // URLs des images uploadées
      frontImage: uploadedImages[0].toString() || "",
      backImage: uploadedImages[1].toString() || "",
      leftImage: uploadedImages[2].toString() || "",
      rightImage: uploadedImages[3].toString() || "",
    };

    //Envoyer les données au backend
    return client.post(
      endpoint,
      JSON.stringify(data),
      {
        headers: {
          "x-auth-token": token,
        },
      },

      {
        onUploadProgress: (progress) =>
          onUploadProgress(progress.loaded / progress.total), // Suivre la progression de l'upload
      }
    );
  } catch (error) {
    console.log("errr", error);
    throw error; // Propager l'erreur pour la gérer dans le composant
  }
};

//Exporter les fonctions
export default {
  addConstat,
  //uploadImage,
  //uploadVoice,
};
