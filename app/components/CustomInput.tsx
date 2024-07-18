import React from "react";
import { Input, Icon, InputProps } from "@rneui/themed";
import { Pressable } from "react-native";

interface CustomTextInputProps extends InputProps {
  errorMessage?: string;
  label?: string;
  leftIcon?: {
    type: string;
    name: string;
    color: string;
  };
  rightIcon?: {
    type: string;
    name: string;
    color: string;
    onPress: () => void;
  };
  placeholder?: string;
  labelStyle: object;
  inputStyle: object;
  multiline?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  errorMessage,
  label,
  leftIcon,
  rightIcon,
  placeholder,
  labelStyle,
  inputStyle,
  multiline,
  ...rest
}) => {
  const defaultLabelStyle = { padding: 5, color: "#fff" };
  const defaultInputStyle = { color: "#fff" };
  return (
    <Input
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
      inputContainerStyle={{
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        height: multiline ? 100 : 50,
        width: "100%",
      }}
      errorMessage={errorMessage}
      errorStyle={{ fontSize: 14, color: "red" }}
      inputStyle={inputStyle ? { ...inputStyle.color } : defaultInputStyle}
      label={label}
      labelStyle={labelStyle ? { ...labelStyle } : defaultLabelStyle}
      leftIcon={
        leftIcon ? (
          <Icon
            type={leftIcon.type}
            name={leftIcon.name}
            color={leftIcon.color}
          />
        ) : null
      }
      rightIcon={
        rightIcon ? (
          <Pressable onPress={rightIcon.onPress}>
            <Icon
              type={rightIcon.type}
              name={rightIcon.name}
              color={rightIcon.color}
            />
          </Pressable>
        ) : null
      }
      placeholder={placeholder}
      {...rest}
    />
  );
};

export default CustomTextInput;
