import React from "react";
import { Slot } from "expo-router";
import { TasksProvider } from "../contexts/AuthContext";

export default function Layout() {
  return (
    <TasksProvider>
      <Slot />
    </TasksProvider>
  );
}
