import React from "react";
import { View, Text, FlatList, ScrollView, StyleSheet } from "react-native";
import TaskItem from "./TaskItem";
import TodoItems from "./TodoItems";

interface Task {
  id: number;
  title: string;
  dueDate: string;
  dueTime: string;
  status: string;
}

interface TaskCardProps {
  title: string;
  data: Task[];
  dateType: "Today" | "Upcoming";
}

const ListTask: React.FC<TaskCardProps> = ({ title, data, dateType }) => (
  <>
    <Text style={styles.heading}>{title}</Text>
    <FlatList
      data={data}
      renderItem={({ item }) => <TodoItems task={item} dateType={dateType} />}
      keyExtractor={(item) => item.id.toString()}
    />
    <View style={{ marginBottom: dateType === "Today" ? 10 : 100 }}></View>
  </>
);

const styles = StyleSheet.create({
  taskCard: {
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 3,
  },
  taskCardExpanded: {
    height: 400,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#fff",
  },
});

export default ListTask;
