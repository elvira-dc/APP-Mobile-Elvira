import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { SPACING, SHADOWS, BORDER_RADIUS } from "@styles/globalStyles";
import Input from "./Input";

const SearchBox = ({
  placeholder = "Search...",
  value,
  onChangeText,
  onSubmitEditing,
  style,
  containerStyle,
  showClearButton = true,
  autoFocus = false,
  ...props
}) => {
  // Enhanced debug logging for SearchBox styles
  console.log("🔍 SearchBox Debug Info:", {
    containerStyle,
    defaultContainerStyle: styles.container,
    mergedContainerStyle: [styles.container, containerStyle],
    inputContainerStyle: styles.inputContainer,
    searchInputStyle: styles.searchInput,
    finalInputContainerStyle: [styles.inputContainer, { marginVertical: 0 }],
  });

  console.log("🔍 SearchBox Spacing Values:", {
    "SPACING.md (paddingHorizontal)": 16,
    "Input default marginVertical": "overridden to 0",
    backgroundColor: "COLORS.background",
  });

  const handleClear = () => {
    if (onChangeText) {
      onChangeText("");
    }
  };

  const getRightIcon = () => {
    if (showClearButton && value && value.length > 0) {
      return (
        <Ionicons
          name="close-circle"
          size={20}
          color={COLORS.textSecondary}
          onPress={handleClear}
        />
      );
    }
    return null;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Input
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        autoFocus={autoFocus}
        returnKeyType="search"
        leftIcon={
          <Ionicons name="search" size={20} color={COLORS.textSecondary} />
        }
        rightIcon={getRightIcon()}
        style={[styles.searchInput, style]}
        containerStyle={[styles.inputContainer, { marginVertical: 0 }]}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    zIndex: 1,
  },

  inputContainer: {
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.xl,
    borderWidth: 0,
  },

  searchInput: {
    marginVertical: 0,
    borderRadius: BORDER_RADIUS.md,
  },
});

export default SearchBox;
