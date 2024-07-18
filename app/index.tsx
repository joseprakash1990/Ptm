import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";

const AppRoot: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <Redirect href="dashboard" />
      ) : (
        <Redirect href="login" />
      )}
    </View>
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
