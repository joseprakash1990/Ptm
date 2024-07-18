import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { FontAwesome5, Ionicons, Fontisto } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CustomHeaderProps {
  title?: string;
  name?: string;
  style?: object;
  onPress?: () => void;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  name,
  style,
  onPress,
}) => {
  const router = useRouter();
  const navigation = useNavigation();
  const logOut = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Log Out",
          onPress: () => {
            UpdateUser(), router.replace("/login");
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  const UpdateUser = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      if (storedUsers) {
        const usersInfo = JSON.parse(storedUsers);
        const updatedUsers = usersInfo.map((user: any) => {
          if (user.loggedIn === true) {
            return { ...user, loggedIn: false };
          }
          return user;
        });

        await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  return (
    <View style={[styles.header, style]}>
      {name ? (
        <>
          <Text style={styles.greetingText}>Hello, {name}</Text>
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.iconContainer} onPress={onPress}>
              <FontAwesome5 name="list-alt" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                logOut();
              }}
            >
              <Fontisto name="more-v" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {navigation.canGoBack() && (
            <TouchableOpacity
              onPress={router.back}
              style={[styles.iconContainer, { height: 40 }]}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{title}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 20,
  },
  greetingText: {
    fontSize: 22,
    color: "white",
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  iconContainer: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  rightIcons: {
    height: 40,
    gap: 10,
    flexDirection: "row",
  },
});

export default CustomHeader;
