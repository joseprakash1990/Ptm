export interface FormData {
  user: string;
  email: string;
  phone: string;
  password: string;
}

export interface FormErrors {
  user: string;
  email: string;
  phone: string;
  password: string;
}
interface FormRegisterData {
  user: string;
  email: string;
  phone: string;
  password: string;
}

interface FormRegisterErrors {
  user?: string;
  email?: string;
  phone?: string;
  password?: string;
}
export interface Task {
  id: number;
  title: string;
  status: "pending" | "completed";
  dueDate: string;
  dueTime: string;
}

export interface TasksContextType {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskId: number) => void;
}
