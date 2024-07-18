import React from "react";
import { Stack } from "expo-router";
import { TasksProvider } from "../contexts/AuthContext.";

export default function Layout() {
  return (
    <TasksProvider>
      <Stack>
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="listTask" options={{ headerShown: false }} />
        <Stack.Screen name="createTask" options={{ headerShown: false }} />
      </Stack>
    </TasksProvider>
  );
}
