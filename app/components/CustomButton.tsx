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
  height?: number;
  width?: number;
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
  height,
  width,
}) => {
  const mergedContainerStyle = [
    containerStyle,
    height && { height },
    width && { width },
  ];

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
            containerStyle={mergedContainerStyle}
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
            containerStyle={mergedContainerStyle}
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
            containerStyle={mergedContainerStyle}
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
            containerStyle={mergedContainerStyle}
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
            containerStyle={mergedContainerStyle}
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
            containerStyle={mergedContainerStyle}
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
    backgroundColor: "rgba(78, 116, 289, 1)",
    borderRadius: 3,
  },
  roundButton: {
    backgroundColor: "rgba(90, 154, 230, 1)",
    borderRadius: 30,
  },
  outlineButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(78, 116, 289, 1)",
  },
});

export default withTheme(CustomButton, "");
