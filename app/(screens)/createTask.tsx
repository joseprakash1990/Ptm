import React, { useCallback, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  SafeAreaView,
  Alert,
  StatusBar,
} from "react-native";
import { FAB as Fab, Icon, SearchBar } from "@rneui/themed";
import { Dropdown } from "react-native-element-dropdown";
import useAsyncStorageTasks from "../hooks/useAsyncStorageTasks";
import TaskModal from "../components/TaskModal";
import Task from "../components/Task";
import { CustomHeader } from "../components/CustomHeader";

const TaskManagementScreen = () => {
  const { tasks, addTask, updateTask, deleteTask } = useAsyncStorageTasks();

  const [filter, setFilter] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    id: "",
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    status: "pending",
  });
  const [search, setSearch] = useState("");

  const handleSave = useCallback(
    (task) => {
      try {
        if (isEditing) {
          updateTask({ ...task, status: "pending" });
        } else {
          addTask({ ...task, id: Date.now() });
        }
        resetTask();
      } catch (error) {
        console.error("Error saving task:", error);
        Alert.alert("Error", "An error occurred while saving the task.");
      }
    },
    [isEditing, addTask, updateTask]
  );

  const handleEdit = useCallback((task) => {
    setCurrentTask(task);
    setIsEditing(true);
    setModalVisible(true);
  }, []);

  const handleDelete = useCallback(
    (taskId) => {
      Alert.alert(
        "Delete Task",
        "Are you sure you want to delete this task?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Delete",
            onPress: () => {
              try {
                deleteTask(taskId);
              } catch (error) {
                console.error("Error deleting task:", error);
                Alert.alert(
                  "Error",
                  "An error occurred while deleting the task."
                );
              }
            },
            style: "destructive",
          },
        ],
        { cancelable: false }
      );
    },
    [deleteTask]
  );

  const resetTask = useCallback(() => {
    setCurrentTask({
      id: "",
      title: "",
      description: "",
      dueDate: "",
      dueTime: "",
      status: "pending",
    });
    setIsEditing(false);
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "all") return true;
      if (filter === "pending") return task.status === "pending";
      if (filter === "completed") return task.status === "completed";
      return true;
    });
  }, [tasks, filter]);

  const filterOptions = useMemo(
    () => [
      { label: "All", value: "all" },
      { label: "Pending", value: "pending" },
      { label: "Completed", value: "completed" },
    ],
    []
  );

  const updateSearch = useCallback((search) => {
    setSearch(search);
  }, []);

  const searchFilter = useCallback(
    (item) => {
      const query = search.toLowerCase();
      return item?.title.toLowerCase().includes(query);
    },
    [search]
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={"#2F5676"} barStyle="light-content" />
      <CustomHeader title="Task List" style={{ backgroundColor: "#2F5676" }} />
      <View style={styles.container}>
        {tasks.length > 0 && (
          <View style={styles.filterContainer}>
            <SearchBar
              placeholder="Search Task"
              onChangeText={updateSearch}
              value={search}
              containerStyle={styles.searchContainer}
              inputContainerStyle={styles.searchInputContainer}
              inputStyle={styles.searchInput}
            />
            <Dropdown
              style={styles.dropdown}
              data={filterOptions}
              labelField="label"
              valueField="value"
              value={filter}
              onChange={(item) => setFilter(item.value)}
              itemTextStyle={{ color: "#000" }}
              containerStyle={{ backgroundColor: "#fff" }}
            />
          </View>
        )}
        {filteredTasks.length === 0 ? (
          <View style={styles.noTasksContainer}>
            <Image
              source={require("../../assets/noTask.jpg")}
              style={styles.noTasksImage}
            />
            <Text style={styles.noTasksText}>No tasks available</Text>
          </View>
        ) : (
          <FlatList
            data={filteredTasks.filter(searchFilter).reverse()}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Task item={item} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          />
        )}
        <Fab
          icon={<Icon name="add" color="#fff" />}
          placement="right"
          color="#4A4576"
          onPress={() => setModalVisible(true)}
          style={styles.fab}
        />
      </View>
      <TaskModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          resetTask();
        }}
        onSave={handleSave}
        isEditing={isEditing}
        initialTask={currentTask}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  searchContainer: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1.5,
    borderRadius: 5,
    height: 60,
    flex: 1,
  },
  searchInputContainer: {
    backgroundColor: "#fff",
    height: 50,
  },
  searchInput: {
    color: "#000",
    height: 50,
  },
  dropdown: {
    flex: 0.6,
    height: 60,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  noTasksContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTasksImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  noTasksText: {
    fontSize: 18,
    color: "#888",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
});

export default TaskManagementScreen;
