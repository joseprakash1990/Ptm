import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { formatDateTime } from "../utils/dates";

interface Task {
  id: number;
  title: string;
  dueDate: string;
  dueTime: string;
  status: string;
}

interface TaskItemProps {
  task: Task;
  dateType: "Today" | "Upcoming";
}

const TodoItems: React.FC<TaskItemProps> = ({ task, dateType }) => (
  <View style={styles.taskItem}>
    <View style={styles.taskHeader}>
      <View style={styles.headerContent}>
        <MaterialIcons name="pending-actions" size={24} color="#1c9466" />
        <Text style={styles.taskTitle}>{task.title}</Text>
      </View>
      <Text style={styles.taskStatus}>
        {task.status === "pending" ? "Pending" : "Completed"}
      </Text>
    </View>
    <View style={styles.taskDetails}>
      <Entypo name="clock" size={24} color="#3380eb" />
      <Text style={styles.taskDateTime}>
        {dateType === "Today"
          ? `Today ${
              formatDateTime(task?.dueDate, task?.dueTime).split(", ")[1]
            }`
          : formatDateTime(task?.dueDate, task?.dueTime)}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  taskItem: {
    padding: 10,
    backgroundColor: "#c3c2c8",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 1,
    // marginBottom: 20,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  taskHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskTitle: {
    marginLeft: 10,
    fontSize: 18,
    color: "#555",
  },
  taskStatus: {
    fontSize: 16,
    color: "#888",
    fontStyle: "italic",
  },
  taskDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskDateTime: {
    marginLeft: 5,
    fontSize: 16,
    color: "#666",
  },
});

export default TodoItems;
