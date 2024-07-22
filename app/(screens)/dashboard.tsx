import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
  Image,
} from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { CustomHeader } from "../components/CustomHeader";
import useAsyncStorageTasks from "../hooks/useAsyncStorageTasks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  convert12To24,
  getCurrentDate,
  addMinutesToTime,
} from "../utils/dates";
import ListTask from "../components/ListTask";
import * as Notifications from "expo-notifications";

const Dashboard: React.FC = () => {
  const { tasks, updateTask } = useAsyncStorageTasks();
  const [userInfo, setUserInfo] = useState({});
  const router = useRouter();
  const navigation = useNavigation();
  const focused = navigation.isFocused();
  const currentDate = useMemo(() => getCurrentDate(), []);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const schedulePushNotification = async (task) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Task Due",
        body: `Task "${task.title}" is due now.`,
        data: { taskId: task.id },
      },
      trigger: { seconds: 1 },
    });
  };

  useEffect(() => {
    const checkDueTasks = () => {
      const currentFormattedTime = currentTime.toTimeString().slice(0, 5);
      tasksToday.forEach((item) => {
        const taskTime24 = `${convert12To24(item.dueTime)}`;
        if (
          item.dueDate === currentDate &&
          item.status === "pending" &&
          taskTime24 <= currentFormattedTime
        ) {
          Alert.alert(
            "Task Due",
            `Task "${item.title}" is due now.`,
            [
              {
                text: "OK",
                onPress: () => {
                  closeTask(item);
                },
              },
              {
                text: "Snooze",
                onPress: () => {
                  snoozeTask(item);
                },
              },
            ],
            { cancelable: false }
          );
          schedulePushNotification(item);
        }
      });
    };

    checkDueTasks();
  }, [currentTime]);

  const closeTask = (item) => {
    updateTask({ ...item, status: "completed" });
  };

  const snoozeTask = async (item) => {
    updateTask({
      ...item,
      dueTime: addMinutesToTime(item.dueTime.split(" ")[0], 5),
    });
  };

  const tasksToday = useMemo(() => {
    return tasks
      .filter(
        (task) => task.dueDate === currentDate && task.status === "pending"
      )
      .reverse();
  }, [tasks, currentDate, focused]);

  const upcomingTasks = useMemo(() => {
    return tasks.filter((task) => task.dueDate > currentDate).reverse();
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
      <ListTask title={item.title} data={item.data} dateType={item.dateType} />
    ),
    []
  );
  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../../assets/noTask.jpg")}
        style={styles.emptyImage}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={"#2F5676"} barStyle="light-content" />
      <CustomHeader
        title="Dashboard"
        name={userInfo?.user}
        onPress={() => router.navigate("/createTask")}
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
  listFooter: {
    marginBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});

export default Dashboard;
