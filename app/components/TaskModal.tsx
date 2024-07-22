import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import CustomButton from "./CustomButton";
import CustomTextInput from "./CustomInput";

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status: "pending" | "completed";
}

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  isEditing: boolean;
  initialTask: Task;
}

const TaskModal: React.FC<TaskModalProps> = ({
  visible,
  onClose,
  onSave,
  isEditing,
  initialTask,
}) => {
  const [currentTask, setCurrentTask] = useState<Task>({
    id: "",
    title: "",
    description: "",
    dueDate: "",
    dueTime: "",
    status: "pending",
  });
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [isTimePickerVisible, setTimePickerVisibility] =
    useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof Task, string>>
  >({});
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setCurrentTask(initialTask);
    setFormErrors({});
  }, [initialTask]);

  const handleConfirmDate = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setCurrentTask({
        ...currentTask,
        dueDate: moment(selectedDate).format("YYYY-MM-DD"),
      });
    }
    setDatePickerVisibility(false);
  };

  const handleConfirmTime = (event, selectedTime) => {
    if (selectedTime) {
      setTime(selectedTime);
      setCurrentTask({
        ...currentTask,
        dueTime: moment(selectedTime).format("hh:mm A"),
      });
    }
    setTimePickerVisibility(false);
  };

  const isPastDate = (date: string) => {
    return moment(date).isBefore(moment(), "day");
  };

  const isPastTime = (time: string) => {
    return moment(time, "hh:mm A").isBefore(moment(), "minute");
  };

  const handleValidation = () => {
    const errors: Partial<Record<keyof Task, string>> = {};

    if (!currentTask.title.trim()) {
      errors.title = "Title is required";
    }
    if (!currentTask.description.trim()) {
      errors.description = "Description is required";
    }
    if (!currentTask.dueDate) {
      errors.dueDate = "Due date is required";
    }
    if (!currentTask.dueTime) {
      errors.dueTime = "Due time is required";
    }
    if (currentTask.dueDate && isPastDate(currentTask.dueDate)) {
      errors.dueDate = "Due date cannot be in the past";
    }
    if (
      currentTask.dueDate === moment().format("YYYY-MM-DD") &&
      isPastTime(currentTask.dueTime)
    ) {
      errors.dueTime = "Due time cannot be in the past";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveWithValidation = () => {
    if (handleValidation()) {
      onSave(currentTask);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>
            {isEditing ? "Edit Task" : "Add Task"}
          </Text>
          <CustomTextInput
            label="Title *"
            placeholder="Title"
            value={currentTask.title}
            onChangeText={(text) =>
              setCurrentTask({ ...currentTask, title: text })
            }
            labelStyle={{ color: "#000", padding: 5 }}
            inputStyle={{ color: "#000" }}
            errorMessage={formErrors.title}
          />
          <CustomTextInput
            label="Description *"
            placeholder="Description"
            value={currentTask.description}
            onChangeText={(text) =>
              setCurrentTask({ ...currentTask, description: text })
            }
            labelStyle={{ color: "#000", padding: 5 }}
            inputStyle={{ color: "#000" }}
            errorMessage={formErrors.description}
            multiline={true}
          />
          <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
            <CustomTextInput
              label="Due Date *"
              placeholder="Due Date (YYYY-MM-DD)"
              value={currentTask.dueDate}
              editable={false}
              labelStyle={{ color: "#000", padding: 5 }}
              inputStyle={{ color: "#000" }}
              errorMessage={formErrors.dueDate}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTimePickerVisibility(true)}>
            <CustomTextInput
              label="Due Time *"
              placeholder="Due Time (HH:mm)"
              value={currentTask.dueTime}
              editable={false}
              labelStyle={{ color: "#000", padding: 5 }}
              inputStyle={{ color: "#000" }}
              errorMessage={formErrors.dueTime}
            />
          </TouchableOpacity>
          <View style={styles.buttons}>
            <CustomButton
              title={isEditing ? "Update Task" : "Save Task"}
              onPress={handleSaveWithValidation}
              mode="basic"
            />
            <CustomButton
              title="Cancel"
              onPress={onClose}
              mode="outline"
              buttonStyle={{ borderColor: "#EFE9E1" }}
              titleStyle={{ color: "#000" }}
            />
          </View>
        </ScrollView>
        {isDatePickerVisible && (
          <DateTimePicker
            testID="datePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleConfirmDate}
            minimumDate={new Date()}
          />
        )}
        {isTimePickerVisible && (
          <DateTimePicker
            testID="timePicker"
            value={time}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleConfirmTime}
          />
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    width: Dimensions.get("window").width - 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default TaskModal;
