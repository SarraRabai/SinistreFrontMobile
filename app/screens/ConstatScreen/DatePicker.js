import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import DatePicker from "react-native-date-picker";

const DateP = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Button title="Open Date Picker" onPress={() => setOpen(true)} />
      <Text style={{ marginTop: 20, textAlign: "center" }}>
        Selected Date: {date.toLocaleDateString()}
      </Text>

      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(selectedDate) => {
          setOpen(false);
          setDate(selectedDate);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
};

export default DateP;
