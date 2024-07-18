import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
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
  const [currentTask, setCurrentTask] = useState<Task>(initialTask);
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);
  const [isTimePickerVisible, setTimePickerVisibility] =
    useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof Task, string>>
  >({});

  useEffect(() => {
    setCurrentTask(initialTask);
    setFormErrors({});
  }, [initialTask]);

  const handleConfirmDate = (date: Date) => {
    setCurrentTask({
      ...currentTask,
      dueDate: moment(date).format("YYYY-MM-DD"),
    });
    setDatePickerVisibility(false);
  };

  const handleConfirmTime = (time: Date) => {
    setCurrentTask({
      ...currentTask,
      dueTime: moment(time).format("hh:mm A"),
    });
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
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
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
          <View style={styles.modalButtons}>
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
        </View>
      </KeyboardAvoidingView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisibility(false)}
        minimumDate={new Date()}
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={() => setTimePickerVisibility(false)}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: Dimensions.get("window").width - 40,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default TaskModal;
