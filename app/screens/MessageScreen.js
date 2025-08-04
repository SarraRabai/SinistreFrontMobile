import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { io } from "socket.io-client";
import { Audio } from "expo-av";
import { useRoute, useNavigation } from "@react-navigation/native";
import authStorage from "../../app/auth/storage";
import client from "../api/client";
import { FontAwesome } from "@expo/vector-icons";
const SOCKET_URL = "http://192.168.1.103:9000";

function MessageScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { reciverId, recivedName, role } = route.params;

  const [user, setUser] = useState();
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchText, setSearchText] = useState("");

  const flatListRef = useRef(null);
  const socketRef = useRef(null);

  const userModel = "User";
  const receiverModel = "Admin";

  const playNotificationSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/notification.mp3")
      );
      await sound.playAsync();
    } catch (error) {
      console.error("Erreur de lecture du son:", error);
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

  useEffect(() => {
    restoreUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, {
      query: {
        userId: user.userId,
        userModel: "User",
      },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connection", () => {
      console.log("Socket connecté", socket.id);
    });

    socket.on("newMessage", (newMsg) => {
      playNotificationSound();
      setMessages((prev) => [...prev, newMsg]);
      setFilteredMessages((prev) => [...prev, newMsg]);
    });

    socket.on("connect_error", (err) => {
      console.error("Erreur de connexion au socket :", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const getMesMessage = async () => {
    const token = await authStorage.getToken();

    try {
      const response = await client.post(
        "/message/message/conversations",
        { receiverId: reciverId },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      const data = response?.data?.messages || [];
      setMessages(data);
      setFilteredMessages(data);

      // Scroll vers le bas
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error("Erreur API non bloquante:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getMesMessage();
    }
  }, [user, reciverId]);

  const handleSend = async () => {
    const token = await authStorage.getToken();
    if (!messageInput.trim()) return;

    const payload = {
      message: messageInput,
      receiverModel,
    };

    const response = await client.post(
      "/message/send/" + reciverId,
      JSON.stringify(payload),
      {
        headers: {
          "x-auth-token": token,
        },
      }
    );

    if (response?.status === 201) {
      getMesMessage();
      setMessageInput("");
      socketRef.current.emit("newMessage", messageInput);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = messages.filter((msg) =>
      msg.message.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMessages(filtered);
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.senderModel === userModel;

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.messageRight : styles.messageLeft,
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="arrow-left" size={24} color="#007AFF" />
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <View style={styles.avatar}>
              <FontAwesome name="user" size={30} color="#333" />
            </View>
            <View style={styles.txt}>
              <Text style={styles.headerTitle}>{recivedName}</Text>
              <Text style={styles.role}>{role}</Text>
            </View>
          </View>
        </View>
        {/* Zone de recherche */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Rechercher un message..."
            value={searchText}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
        </View>

        {/* Liste des messages */}
        <FlatList
          ref={flatListRef}
          data={filteredMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 10 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* Zone d'envoi */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Écrire un message..."
            style={styles.input}
            value={messageInput}
            onChangeText={setMessageInput}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Envoyer</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  role: {
    fontSize: 14,
    color: "gray",

    fontWeight: "bold",
    marginLeft: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  txt: {
    flexDirection: "col",
    alignItems: "center",
  },

  searchContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  searchInput: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  messageContainer: {
    maxWidth: "75%",
    padding: 10,
    borderRadius: 15,
    marginVertical: 5,
  },
  messageLeft: {
    backgroundColor: "#222",
    alignSelf: "flex-start",
  },
  messageRight: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
  },
  input: {
    flex: 1,
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#007AFF",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MessageScreen;
