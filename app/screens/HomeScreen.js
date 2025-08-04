import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import AuthContext from "../auth/context";
import authStorage from "../../app/auth/storage";
import UsersApi from "../api/UsersApi";
import useModalVisibility from "../hooks/useModalVisibility";
import CustomNavBar from "../navigation/CustomNavBar";
import ActionList from "../components/ActionList";
import VehicleCardSlider from "../components/VehicleCardSlider";
import Header from "../components/Header";

const HomeScreen = () => {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { user, setUser } = useContext(AuthContext);
  const username = user ? user.name : "Invité";
  const [mesVehicules, setMesVehicules] = useState([]);

  const getMesVehicules = async () => {
    try {
      const response = await UsersApi.getMesVehicules();
      setMesVehicules(response?.data?.result || []);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const currentUser = async () => {
    const result = await UsersApi.CurrentUser();
    if (result.status !== 200) {
      setUser(null);
      await authStorage.removeToken();
    }
  };

  useEffect(() => {
    currentUser();
    getMesVehicules();
  }, []);

  useEffect(() => {
    if (!mesVehicules || mesVehicules.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % mesVehicules.length;

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex, mesVehicules]);

  const {
    bottomSheetRef,
    bottomSheetContent,
    handlePoliciesClick,
    handleAgentsClick,
    handleMapsClick,
  } = useModalVisibility();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#5e7ca5" />
      <LinearGradient
        colors={["#F1EFEC", "#F5F5F5"]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.container}>
          <Header />

          <ScrollView
            style={styles.content}
            showsHorizontalScrollIndicator={false}
          >
            <VehicleCardSlider vehicles={mesVehicules} />

            <Text style={styles.sectionTitle}>Que voulez-vous faire ?</Text>
            <ActionList />
          </ScrollView>
          <CustomNavBar />
        </View>
      </LinearGradient>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["25%", "50%", "88%"]}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetHandle}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          {bottomSheetContent}
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    position: "relative",
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },

  content: {
    marginTop: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 16,
  },

  bottomSheetBackground: {
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  bottomSheetHandle: {
    backgroundColor: "#ccc",
    width: 40,
    height: 5,
    borderRadius: 3,
    marginVertical: 10,
    alignSelf: "center",
  },
  bottomSheetContent: {
    padding: 16,
  },

  headerContainer: {
    backgroundColor: "#007bff",
    paddingBottom: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
});

export default HomeScreen;
