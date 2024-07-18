import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomTextInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useRouter } from "expo-router";
import { FormRegisterData, FormRegisterErrors } from "../constants/types";
import { CustomHeader } from "../components/CustomHeader";

const Register: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormRegisterData>({
    user: "",
    email: "",
    phone: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormRegisterErrors>({});
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (name: keyof FormRegisterData, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validateForm = () => {
    const errors: FormRegisterErrors = {};
    if (!formData.user) {
      errors.user = "User name is required.";
    }
    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email address is invalid.";
    }
    if (!formData.phone) {
      errors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number is invalid.";
    }
    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkUserExistence = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const userExists = users.some(
        (user: FormRegisterData) =>
          user.email === formData.email || user.phone === formData.phone
      );
      return userExists;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  };

  const storeUserData = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const userData = { ...formData, loggedIn: true };
      users.push(userData);
      await AsyncStorage.setItem("users", JSON.stringify(users));
    } catch (error) {
      console.error("Error storing user data:", error);
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      const userExists = await checkUserExistence();
      if (userExists) {
        Alert.alert("Error", "Email or phone number already exists.");
      } else {
        await storeUserData();
        Alert.alert("Success", "Registration successful!");
        router.replace("dashboard");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"#2F5676"} barStyle="light-content" />
      <CustomHeader
        title="Register Form"
        style={{ backgroundColor: "#2F5676" }}
      />
      <KeyboardAvoidingView style={{ marginTop: 30, padding: 16 }}>
        <CustomTextInput
          label="Enter Name *"
          placeholder="Enter Full Name"
          value={formData.user}
          onChangeText={(text) => handleChange("user", text)}
          errorMessage={formErrors.user}
        />
        <CustomTextInput
          label="Enter Email *"
          placeholder="Enter Email"
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
          errorMessage={formErrors.email}
        />
        <CustomTextInput
          label="Phone Number *"
          placeholder="Enter the phone number"
          value={formData.phone}
          onChangeText={(text) => handleChange("phone", text)}
          errorMessage={formErrors.phone}
        />
        <CustomTextInput
          label="Password *"
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
          title="Register"
          mode="basic"
          onPress={handleSubmit}
          buttonStyle={styles.button}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2F5676",
  },
  button: {
    height: 50,
    width: "100%",
  },
});

export default Register;
