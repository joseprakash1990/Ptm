import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { CustomHeader } from "../components/CustomHeader";
import useAsyncStorageTasks from "../hooks/useAsyncStorageTasks";
import {
  convert12To24,
  formatDateTime,
  getCurrentDate,
  getCurrentTime,
} from "../utils/dates";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Dashboard = () => {
  const { tasks, updateTask } = useAsyncStorageTasks();
  const [userInfo, setUserInfo] = useState({});
  const router = useRouter();
  const navigation = useNavigation();
  const focused = navigation.isFocused();
  const currentDate = useMemo(() => getCurrentDate(), []);
  const currentTime = useMemo(() => getCurrentTime(), []);

  // useEffect(() => {
  // if (focused) {

  // }
  // }focused)
  // console.log(tasks);
  // console.log(userInfo);

  const tasksToday = useMemo(() => {
    return tasks.filter((task) => {
      const taskDueDate = task.dueDate;
      const taskDueTime = task?.dueTime;

      return (
        taskDueDate === currentDate &&
        taskDueTime &&
        convert12To24(taskDueTime) >= currentTime
      );
    });
  }, [focused, currentDate, currentTime]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem("users");
        if (storedUsers) {
          const usersInfo = JSON.parse(storedUsers);
          const loggedInUser = usersInfo.find((user) => user.loggedIn);
          if (loggedInUser) setUserInfo(loggedInUser);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, []);

  const upcomingTasks = useMemo(() => {
    return tasks.filter((task) => task.dueDate > currentDate);
  }, [tasks, currentDate]);

  const data = useMemo(
    () => [
      { id: 1, title: "Tasks Due Today", data: tasksToday, dateType: "Today" },
      {
        id: 2,
        title: "Upcoming Tasks",
        data: upcomingTasks,
        dateType: "Upcoming",
      },
    ],
    [tasksToday, upcomingTasks]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <TaskCard title={item.title} data={item.data} dateType={item.dateType} />
    ),
    []
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={"#2F5676"} barStyle="light-content" />
      <CustomHeader
        title="Dashboard"
        name={userInfo?.user}
        onPress={() => router.push("/createTask")}
        style={styles.header}
      />
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

const TaskCard = ({ title, data, dateType }) => (
  <View style={[styles.taskCard, data?.length >= 4 && styles.taskCardExpanded]}>
    <Text style={styles.heading}>{title}</Text>
    <ScrollView>
      <FlatList
        data={data}
        renderItem={({ item }) => <TaskItem task={item} dateType={dateType} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </ScrollView>
  </View>
);

const TaskItem = ({ task, dateType }) => (
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
  safeArea: {
    flex: 1,
    backgroundColor: "#2F5676",
  },
  header: {
    backgroundColor: "#2F5676",
    marginTop: 10,
  },
  container: {
    padding: 20,
    backgroundColor: "#2F5676",
  },
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
    color: "#333",
  },
  taskItem: {
    padding: 10,
    backgroundColor: "#c3c2c8",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 5,
    elevation: 1,
    marginBottom: 20,
    marginVertical: 10,
    borderWidth: 1,
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

export default Dashboard;
