import React from "react";
import { TextInput } from "react-native-paper";

export default function AppTextInput({
  label,
  value,
  onChangeText,
  disabled = false,
  multiline = false,
  keyboardType = "default",
  right = null,
  onSubmitEditing,
}) {
  return (
    <TextInput
      label={label}
      mode="outlined"
      value={value}
      onChangeText={onChangeText}
      disabled={disabled}
      multiline={multiline}
      keyboardType={keyboardType}
      autoCapitalize="none"
      right={right}
      returnKeyType={onSubmitEditing ? "done" : undefined}
      onSubmitEditing={onSubmitEditing}
    />
  );
}
