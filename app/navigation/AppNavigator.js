import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, StyleSheet, Animated } from "react-native";

import HomeScreen from "../screens/HomeScreen";
import AccountScreen from "../screens/AccountScreen";
import MessageScreen from "../screens/MessageScreen";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const animatedValue = new Animated.Value(0);

  const animateTab = (toValue) => {
    Animated.spring(animatedValue, {
      toValue,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Main"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="home" color={color} size={size} />
            </View>
          ),
        }}
        listeners={{
          tabPress: () => animateTab(0),
        }}
      />

      <Tab.Screen
        name="Profil"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="account"
                color={color}
                size={size}
              />
            </View>
          ),
          headerShown: false,
        }}
        listeners={{
          tabPress: () => animateTab(2),
        }}
      />

      <Tab.Screen
        name="message"
        component={MessageScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name="facebook-messenger"
                color={color}
                size={size}
              />
            </View>
          ),
          headerShown: false,
        }}
        listeners={{
          tabPress: () => animateTab(2),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 25,
    height: 70,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default AppNavigator;
