//import "react-native-gesture-handler";
import React, { useState } from "react";
import { View, Text, TextInput, Switch, Button, Image } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import Screen from "./app/components/Screen";

/*import * as Permissions from "expo-permissions";*/

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, useNavigation } from "@react-navigation/native"; //main lib
import AuthNavigator from "./app/navigation/AuthNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
/*import AppNavigator from "./app/navigation/AppNavigator";*/

import OfflineNotice from "./app/components/OfflineNotice";
import AuthContext from "./app/auth/context";
import authStorage from "./app/auth/storage";
/*import AppLoading from "expo-app-loading";*/
import * as SplashScreen from "expo-splash-screen";
import { navigationRef } from "./app/navigation/rootNavigation";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import "react-native-reanimated";
import "react-native-gesture-handler";
import CameraScreen from "./app/screens/ConstatScreen/CameraScreen";
import ConstatNavigator from "./app/navigation/ConstatNavigator";
import * as Linking from "expo-linking";
import client from "./app/api/client";
/*const Link = () => {
  const navigation = useNavigation();
  return (
    <Button
      title="Click"
      onPress={() => navigation.navigate("TweetDetails", { id: 1 })} //second param
    /> //tap on the button to see the specific tweet
  );
};*/

const Account = () => (
  <Screen>
    <Text> Account</Text>
  </Screen>
);
const Tab = createBottomTabNavigator();
const TabNavigator = () => (
  <Tab.Navigator
    tabBarOptions={{
      activeBackgroundColor: "tomato",
      activeTintColor: "white",
      inactiveBackgroundColor: "#eee",
      inactiveTintColor: "#eee",
    }}
  >
    <Tab.Screen
      name="Feed"
      component={StackNavigator}
      options={{
        tabBarIcon: ({ size, color }) => (
          <MaterialCommunityIcons name="home" size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen name="Account" component={Account} />
  </Tab.Navigator>
);

SplashScreen.preventAutoHideAsync();

const linking = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      VehicleInputScreen: "vehicles",
      General_Info: "general-info",
      VehiculeA: "vehicule-form",
      CameraScreen: "camera",
      AccountScreen: "account",
    },
  },
};

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState(false);

  const [token, setToken] = useState(null);

  const getToken = async () => {
    try {
      const token = await authStorage.getToken();
      setToken(token);
      const response = await client.get("/users/currentUser", {
        headers: {
          "x-auth-token": token,
        },
      });

      if (response.status === 400) {
        setUser(null);
        await authStorage.removeToken();
      }
    } catch (error) {
      console.error("Error restoring user:", error);
    }
  };

  const restoreUser = async () => {
    try {
      const user = await authStorage.getUser();

      if (user) setUser(user);
    } catch (error) {
      console.error("Error restoring user:", error);
    }
  };

  /* useEffect(() => {
    restoreUser();
  }, []);*/

  const loadResources = async () => {
    await getToken();
    await restoreUser();
    setIsReady(true);
    await SplashScreen.hideAsync();
  };

  React.useEffect(() => {
    loadResources();
  }, []);

  if (!isReady) {
    return null; // Optionally render a custom loading component or keep the splash screen visible
  }

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken }}>
      <OfflineNotice />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <NavigationContainer
            ref={navigationRef}
            theme={navigationTheme}
            linking={linking}
          >
            {user && token ? <ConstatNavigator /> : <AuthNavigator />}
          </NavigationContainer>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </AuthContext.Provider>
  );
}
//take the update from the login screen of the user ans send it to the entire app
/* <View
style={{
  backgroundColor: "#f8f4f4",
  padding: 20,
  paddingTop: 100,
  }}
  >
  <Card
  title="Red jackeet for sale"
  subtitle="$100"
  image={require("./app/assets/logo travel.jpg")}
  />
  </View>*/
// <GestureHandlerRootView style={{ flex: 1 }}> </GestureHandlerRootView>;
/*

<GestureHandlerRootView style={{ flex: 1 }}>
  <NavigationContainer theme={navigationTheme}>
    <AppNavigator />
  </NavigationContainer>
</GestureHandlerRootView>
<AppNavigator />
*/
