import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TASKS_STORAGE_KEY = "tasks";

const useAsyncStorageTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasksString = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        if (tasksString) {
          setTasks(JSON.parse(tasksString));
        }
      } catch (error) {
        console.error("Failed to load tasks", error);
      }
    };

    loadTasks();
  }, []);

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      setTasks(tasks);
    } catch (error) {
      console.error("Failed to save tasks", error);
    }
  };

  const addTask = useCallback((task) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, task];
      saveTasks(updatedTasks);
      return updatedTasks;
    });
  }, []);

  const updateTask = useCallback((updatedTask) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task
      );
      saveTasks(updatedTasks);
      return updatedTasks;
    });
  }, []);

  const deleteTask = useCallback((taskId) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((task) => task.id !== taskId);
      saveTasks(updatedTasks);
      return updatedTasks;
    });
  }, []);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
  };
};

export default useAsyncStorageTasks;
