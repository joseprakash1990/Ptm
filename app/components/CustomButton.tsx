import React from "react";
import { StyleSheet } from "react-native";
import { Button, withTheme } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  mode:
    | "basic"
    | "round"
    | "iconLeft"
    | "iconRight"
    | "outline"
    | "linearGradient";
  buttonStyle?: object;
  titleStyle?: object;
  containerStyle?: object;
  icon?: object;
  iconRight?: boolean;
  linearGradientProps?: object;
};

const CustomButton: React.FunctionComponent<CustomButtonProps> = ({
  title,
  onPress,
  loading = false,
  mode,
  buttonStyle,
  titleStyle,
  containerStyle,
  icon,
  iconRight = false,
  linearGradientProps,
}) => {
  const renderButton = () => {
    switch (mode) {
      case "basic":
        return (
          <Button
            title={title}
            onPress={onPress}
            loading={loading}
            buttonStyle={[styles.basicButton, buttonStyle]}
            titleStyle={titleStyle}
            containerStyle={{
              margin: 10,
            }}
          />
        );
      case "round":
        return (
          <Button
            title={title}
            onPress={onPress}
            loading={loading}
            buttonStyle={[styles.roundButton, buttonStyle]}
            titleStyle={titleStyle}
          />
        );
      case "iconLeft":
        return (
          <Button
            title={title}
            onPress={onPress}
            loading={loading}
            buttonStyle={buttonStyle}
            titleStyle={titleStyle}
            icon={icon}
            iconRight={iconRight}
          />
        );
      case "iconRight":
        return (
          <Button
            title={title}
            onPress={onPress}
            loading={loading}
            buttonStyle={buttonStyle}
            titleStyle={titleStyle}
            icon={icon}
            iconRight
          />
        );
      case "outline":
        return (
          <Button
            title={title}
            onPress={onPress}
            loading={loading}
            type="outline"
            buttonStyle={[styles.outlineButton, buttonStyle]}
            titleStyle={titleStyle}
            containerStyle={{
              margin: 10,
            }}
          />
        );
      case "linearGradient":
        return (
          <Button
            title={title}
            onPress={onPress}
            loading={loading}
            buttonStyle={buttonStyle}
            titleStyle={titleStyle}
            ViewComponent={LinearGradient}
            linearGradientProps={linearGradientProps}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderButton()}</>;
};

const styles = StyleSheet.create({
  basicButton: {
    backgroundColor: "#4A4576",
    borderRadius: 10,
  },
  roundButton: {
    backgroundColor: "rgba(90, 154, 230, 1)",
    borderRadius: 30,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(78, 116, 289, 1)",
    borderRadius: 10,
  },
});

export default withTheme(CustomButton, "");
