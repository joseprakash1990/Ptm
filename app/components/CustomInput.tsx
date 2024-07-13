import React from "react";
import { Input, Icon, InputProps } from "@rneui/themed";

interface CustomTextInputProps extends InputProps {
  errorMessage?: string;
  label?: string;
  leftIcon?: {
    type: string;
    name: string;
  };
  placeholder?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  errorMessage,
  label,
  leftIcon,
  placeholder,
  ...rest
}) => {
  return (
    <Input
      containerStyle={{}}
      inputContainerStyle={{ borderWidth: 1, borderRadius: 10 }}
      errorMessage={errorMessage}
      errorStyle={{}}
      errorProps={{}}
      inputStyle={{}}
      label={label}
      labelStyle={{}}
      labelProps={{}}
      leftIcon={leftIcon && { type: leftIcon.type, name: leftIcon.name }}
      leftIconContainerStyle={{}}
      rightIcon={<Icon name="close" size={20} />}
      rightIconContainerStyle={{}}
      placeholder={placeholder}
      {...rest}
    />
  );
};

export default CustomTextInput;
