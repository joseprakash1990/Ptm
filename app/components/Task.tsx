import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "@rneui/themed";
import { formatDateTime } from "../utils/dates";

interface TaskProps {
  item: {
    id: string;
    title: string;
    dueDate: string;
    dueTime: string;
    description: string;
    status: string;
  };
  onEdit: (item: TaskProps["item"]) => void;
  onDelete: (id: string) => void;
}

const Task: React.FC<TaskProps> = ({ item, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Title:</Text>
          <Text style={styles.headerTitle}>{item.title}</Text>
        </View>
        <View style={styles.headerIcons}>
          <Icon
            name="edit"
            type="font-awesome"
            color="#fff"
            onPress={() => onEdit(item)}
            containerStyle={styles.icon}
          />
          <Icon
            name="trash"
            type="font-awesome"
            color="#fff"
            onPress={() => onDelete(item.id)}
            containerStyle={styles.icon}
          />
        </View>
      </View>
      <View style={styles.dateTimeRow}>
        <View>
          <Text style={styles.label}>Due Date and Time:</Text>
          <Text style={styles.headerSubtitle}>
            {formatDateTime(item.dueDate, item.dueTime)}
          </Text>
        </View>
        <View>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.statusValue}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#2F5676",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 16,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#ffffff",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 10,
  },
  dateTimeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  body: {
    marginTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgb(206, 192, 192)",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#ffffff",
  },
  statusValue: {
    fontSize: 14,
    color: "#ffffff",
  },
});

export default Task;
