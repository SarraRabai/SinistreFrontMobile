import React, { useEffect, useState } from "react";
import { Modal } from "react-native";
import Screen from "../components/Screen";
import ListItem from "../components/ListItem";
import Icon from "../components/Icon";
import useAuth from "../auth/useAuth";
import UsersApi from "../api/UsersApi";
import UserInfoModal from "../components/UserInfoModal";
import colors from "../config/colors";
import CustomNavBar from "../navigation/CustomNavBar";

function AccountScreen({ navigation }) {
  const { logOut } = useAuth();
  const [user, setUser] = useState();
  const [modalVisible, setModalVisible] = useState(false);

  const currentUser = async () => {
    const result = await UsersApi.CurrentUser();
    if (result.status === 200) {
      setUser(result?.data?.data);
    } else {
      logOut();
    }
  };

  useEffect(() => {
    currentUser();
  }, []);

  return (
    <Screen>
      {/* Modal info utilisateur */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <UserInfoModal user={user} onClose={() => setModalVisible(false)} />
      </Modal>

      <ListItem
        title="Mes Informations"
        IconComponent={
          <Icon name="information-outline" backgroundColor={colors.ctama1} />
        }
        onPress={() => setModalVisible(true)}
      />
      <ListItem
        title="Mes Véhicules"
        IconComponent={<Icon name="car" backgroundColor={colors.ctama1} />}
        onPress={() => navigation.navigate("MesVehicules")}
      />
      <ListItem
        title="Se déconnecter"
        IconComponent={
          <Icon
            name="logout"
            iconColor={colors.ctama1}
            backgroundColor={colors.secondary}
          />
        }
        onPress={() => logOut()}
      />

      {/* backgroundColor="#ffe66d" */}

      <CustomNavBar />
    </Screen>
  );
}

export default AccountScreen;
