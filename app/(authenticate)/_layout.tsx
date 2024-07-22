import { Stack } from "expo-router";
import { StatusBar, SafeAreaView, View, StyleSheet } from "react-native";

export default function Layout() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"#2F5676"} barStyle="light-content" />
      <View style={styles.innerContainer}>
        <Stack>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
});
