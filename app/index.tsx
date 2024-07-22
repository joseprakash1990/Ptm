import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

const AppRoot: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const storedUsers = await AsyncStorage.getItem("users");
      if (storedUsers) {
        const usersInfo = JSON.parse(storedUsers);
        const loggedInUser = usersInfo.find(
          (item: any) => item.loggedIn === true
        );

        if (loggedInUser) {
          setIsAuthenticated(true);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
    showDummyNotification();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      return;
    }
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return token;
  };

  const showDummyNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Dummy Notification",
        body: "This is a dummy local notification for testing purposes.",
      },
      trigger: {
        seconds: 4,
      },
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <>
      {isAuthenticated ? (
        <Redirect href="dashboard" />
      ) : (
        <Redirect href="login" />
      )}
    </>
  );
};

const App: React.FC = () => {
  return <AppRoot />;
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
