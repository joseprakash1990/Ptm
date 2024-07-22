import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import CustomTextInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router";
import { FormData, FormErrors } from "../constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    user: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    user: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleLogin = async () => {
    let valid = true;
    let errors: FormErrors = { user: "", password: "" };

    if (formData.user === "") {
      errors.user = "Email or phone number is required";
      valid = false;
    } else if (
      !validateEmail(formData.user) &&
      !validatePhoneNumber(formData.user)
    ) {
      errors.user = "Invalid email or phone number format";
      valid = false;
    }
    if (formData.password === "") {
      errors.password = "Password is required";
      valid = false;
    }

    setFormErrors(errors);

    if (valid) {
      const loggedIn = await checkLogin(formData);
      if (loggedIn) {
        router.push("dashboard");
      }
    }
  };

  const checkLogin = async (data: FormData): Promise<boolean> => {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const foundUserIndex = users.findIndex(
          (user: FormData) =>
            (validateEmail(data.user) && user.email === data.user) ||
            (validatePhoneNumber(data.user) && user.phone === data.user)
        );
        if (foundUserIndex !== -1) {
          const foundUser = users[foundUserIndex];
          if (foundUser.password === data.password) {
            foundUser.loggedIn = true;
            users[foundUserIndex] = foundUser;
            await AsyncStorage.setItem("users", JSON.stringify(users));
            return true;
          } else {
            Alert.alert("Error", "Incorrect password. Please try again.");
          }
        } else {
          Alert.alert("Error", "Email or phone number not found.");
        }
      } else {
        Alert.alert("Error", "No users registered yet.");
      }
      return false;
    } catch (error) {
      console.error("Error checking login:", error);
      return false;
    }
  };

  const handleChange = (name: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <View style={styles.innerContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Personal Task Management</Text>
        </View>
        <View style={styles.formContainer}>
          <CustomTextInput
            label="Email / Phone Number"
            placeholder="Enter Email / Phone Number"
            value={formData.user}
            onChangeText={(text) => handleChange("user", text)}
            errorMessage={formErrors.user}
          />
          <CustomTextInput
            label="Password"
            placeholder="Enter Password"
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry={!passwordVisible}
            errorMessage={formErrors.password}
            rightIcon={{
              type: "ionicon",
              name: passwordVisible ? "eye-outline" : "eye-off-outline",
              color: "#fff",
              onPress: togglePasswordVisibility,
            }}
          />
          <CustomButton
            title="Login"
            mode="basic"
            onPress={handleLogin}
            buttonStyle={styles.button}
          />
          <Pressable
            onPress={() => router.push("(authenticate)/register")}
            style={styles.link}
          >
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2F5676",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textDecorationLine: "underline",
  },
  formContainer: {
    justifyContent: "center",
  },
  button: {
    height: 50,
    width: "100%",
  },
  link: {
    marginTop: 15,
  },
  linkText: {
    textAlign: "center",
    fontSize: 15,
    color: "#fff",
  },
});

export default LoginScreen;
