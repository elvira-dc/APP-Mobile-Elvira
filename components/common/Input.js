import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { SPACING, BORDER_RADIUS } from "@styles/globalStyles";
import { componentThemes } from "@constants/theme";

const Input = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  helperText,
  leftIcon,
  rightIcon,
  secureTextEntry = false,
  multiline = false,
  editable = true,
  keyboardType = "default",
  autoCapitalize = "sentences",
  returnKeyType = "done",
  onSubmitEditing,
  style,
  inputStyle,
  containerStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  const inputContainerStyles = [
    styles.inputContainer,
    isFocused && styles.inputContainerFocused,
    error && styles.inputContainerError,
    !editable && styles.inputContainerDisabled,
    containerStyle,
  ];

  const inputStyles = [
    styles.input,
    multiline && styles.inputMultiline,
    leftIcon && styles.inputWithLeftIcon,
    rightIcon && styles.inputWithRightIcon,
    inputStyle,
  ];

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={inputContainerStyles}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={inputStyles}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isSecure}
          multiline={multiline}
          editable={editable}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={secureTextEntry ? toggleSecureEntry : undefined}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && !error && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },

  label: {
    ...TEXT_STYLES.label,
    marginBottom: SPACING.xs,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: componentThemes.inputs.default.backgroundColor,
    borderWidth: 1,
    borderColor: componentThemes.inputs.default.borderColor,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
  },

  inputContainerFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  inputContainerError: {
    borderColor: COLORS.error,
    borderWidth: 2,
  },

  inputContainerDisabled: {
    backgroundColor: COLORS.gray100,
    borderColor: COLORS.gray200,
    opacity: 0.7,
  },

  input: {
    flex: 1,
    ...TEXT_STYLES.body,
    color: componentThemes.inputs.default.textColor,
    paddingVertical: SPACING.md,
    minHeight: 48,
  },

  inputMultiline: {
    minHeight: 100,
    textAlignVertical: "top",
    paddingTop: SPACING.md,
  },

  inputWithLeftIcon: {
    paddingLeft: 0,
  },

  inputWithRightIcon: {
    paddingRight: 0,
  },

  leftIcon: {
    marginRight: SPACING.sm,
  },

  rightIcon: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },

  errorText: {
    ...TEXT_STYLES.caption,
    color: COLORS.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },

  helperText: {
    ...TEXT_STYLES.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});

export default Input;
