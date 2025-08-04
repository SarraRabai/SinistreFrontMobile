import React, { useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Modal,
  Button,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../config/colors";
import defaultStyles from "../config/styles";
import AppText from "./AppText.android";
import Screen from "./Screen";
//import CategoryPickerItem from "./CategoryPickerItem";
// import PickerItem from "./PickerItem";

function AppPicker({
  icon,
  items = [],
  numberOfColumns = 1,
  onSelectItem,
  // PickerItemComponent,
  selectedItem,
  placeholder,
  width = "100%",
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const onPressHandler = (item) => {
    onSelectItem(item); // Call the function with the selected item
    setModalVisible(false); // Close the modal
  };
  return (
    <>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={[styles.container, { width }]}>
          {icon && (
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={defaultStyles.colors.medium}
              style={styles.icon}
            />
          )}

          {selectedItem ? (
            <>
              {console.log("Selected item:", selectedItem)}
              <AppText>{selectedItem.label}</AppText>
            </>
          ) : (
            <AppText style={styles.placeholder}>{placeholder}</AppText>
          )}

          <MaterialCommunityIcons
            name="chevron-down"
            size={20}
            color={defaultStyles.colors.medium}
            style={styles.icon}
          />
        </View>
      </TouchableWithoutFeedback>
      <Modal visible={modalVisible} animationType="slide">
        <Screen>
          <Button title="Close" onPress={() => setModalVisible(false)} />
          <FlatList
            data={items}
            keyExtractor={(item) => item.value.toString()} //it returns a
            //nbr we have convert it to a string
            numColumns={numberOfColumns}
            renderItem={({ item }) => {
              console.log("Rendering item:", item); // Debug item
              return (
                <CategoryPickerItem
                  item={item}
                  label={item.label}
                  OnPress={() => onPressHandler(item)}
                />
              );
            }}
          />
        </Screen>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 25,
    flexDirection: "row",
    padding: 15,
    marginVertical: 15,
  },
  textInput: {
    color: colors.dark,
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Avenir",
  },
  icon: {
    marginRight: 10,
    marginTop: 4,
  },
  text: {
    flex: 1,
  },
  placeholder: {
    color: defaultStyles.colors.medium,
    flex: 1, //take the available free space
  },
});
export default AppPicker;
