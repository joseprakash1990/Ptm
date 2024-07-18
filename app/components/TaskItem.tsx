import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Icon } from "@rneui/themed";

const TaskItem = ({
  item,
  handleEdit,
  handleDelete,
  formatDateTime,
  styles,
}) => {
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
            onPress={() => handleEdit(item)}
            containerStyle={styles.icon}
          />
          <Icon
            name="trash"
            type="font-awesome"
            color="#fff"
            onPress={() => handleDelete(item.id)}
            containerStyle={styles.icon}
          />
        </View>
      </View>
      <View>
        <Text style={styles.label}>Due Date and Time:</Text>
        <Text style={styles.headerSubtitle}>
          {formatDateTime(item.dueDate, item.dueTime)}
        </Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

export default TaskItem;
