import { createStackNavigator } from "@react-navigation/stack";
import VehiculeA from "../screens/ConstatScreen/VehiculeA";
import CameraScreen from "../screens/ConstatScreen/CameraScreen";
import General_Info from "../screens/ConstatScreen/General_Info";
import HomeScreen from "../screens/HomeScreen";
import AccountScreen from "../screens/AccountScreen";
import VehicleInputScreen from "../screens/ConstatScreen/VehicleInputScreen";
import MessageScreen from "../screens/MessageScreen";
import MesConstatScreen from "../screens/ConstatScreen/MesConstatScreen";
import MesVehicules from "../screens/MesVehicules";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ListAdminScreen from "../screens/ListAdminScreen";
import { TouchableOpacity } from "react-native";

const Stack = createStackNavigator();

function ConstatNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VehicleInputScreen"
        component={VehicleInputScreen}
        options={({ navigation }) => ({
          title: " ",
        })}
      />
      <Stack.Screen
        name="General_Info"
        component={General_Info}
        options={({ navigation }) => ({
          title: "Info Generales ",
        })}
      />
      <Stack.Screen
        name="VehiculeA"
        component={VehiculeA}
        options={({ navigation }) => ({
          title: "Nv Constat ",
        })}
      />
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen
        name="Messages"
        component={MessageScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="listeAdmin" component={ListAdminScreen} />
      <Stack.Screen
        name="MesConstats"
        component={MesConstatScreen}
        options={({ navigation }) => ({
          title: "Mes constats",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("VehicleInputScreen")}
            >
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={28}
                color="black"
                style={{ marginRight: 15 }}
              />
            </TouchableOpacity>
          ),

          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={28}
                color="black"
                style={{ marginLeft: 15 }}
              />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen name="MesVehicules" component={MesVehicules} />
    </Stack.Navigator>
  );
}

export default ConstatNavigator;
