import React, {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useState,
} from "react";
import useAsyncStorageTasks from "../hooks/useAsyncStorageTasks";
import { TasksContextType } from "../constants/types";

const TasksContext = createContext<TasksContextType | undefined>(undefined);

interface TasksProviderProps {
  children: ReactNode;
}

export const TasksProvider = ({ children }: TasksProviderProps) => {
  const { tasks, addTask, updateTask, deleteTask } = useAsyncStorageTasks();

  const value = useMemo(
    () => ({ tasks, addTask, updateTask, deleteTask }),
    [tasks, addTask, updateTask, deleteTask]
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
};

export const useTasks = (): TasksContextType => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("error");
  }
  return context;
};
