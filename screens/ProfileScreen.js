import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@constants/colors";
import { TEXT_STYLES } from "@constants/typography";
import { globalStyles, SPACING, BORDER_RADIUS } from "@styles/globalStyles";
import { Button, ListItem } from "@components/common";
import {
  POSITIONS,
  DEPARTMENTS,
  DEPARTMENT_COLORS,
  getDepartmentDisplayName,
  getPositionDisplayName,
  getRolePermissions,
} from "@constants/userTypes";

const ProfileScreen = () => {
  // Mock user data (will be replaced with real data from Supabase)
  const mockUser = {
    id: "1",
    email: "john.doe@hotel.com",
    full_name: "John Doe",
    position: POSITIONS.HOTEL_STAFF,
    department: DEPARTMENTS.RECEPTION,
    employee_id: "EMP001",
    shift_start: "09:00",
    shift_end: "17:00",
    permissions: getRolePermissions(
      POSITIONS.HOTEL_STAFF,
      DEPARTMENTS.RECEPTION
    ),
  };

  const profileOptions = [
    {
      id: 1,
      title: "Personal Information",
      icon: "person-outline",
      onPress: () => console.log("Personal Info"),
    },
    {
      id: 2,
      title: "My Schedule",
      icon: "time-outline",
      onPress: () => console.log("Schedule"),
    },
    {
      id: 3,
      title: "Department Settings",
      icon: "business-outline",
      onPress: () => console.log("Department"),
    },
    {
      id: 4,
      title: "Notifications",
      icon: "notifications-outline",
      onPress: () => console.log("Notifications"),
    },
    {
      id: 5,
      title: "Help & Support",
      icon: "help-circle-outline",
      onPress: () => console.log("Support"),
    },
  ];

  return (
    <ScrollView
      style={globalStyles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={globalStyles.padding}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://via.placeholder.com/120x120/FF5A5F/FFFFFF?text=User",
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="camera" size={20} color={COLORS.textInverse} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@example.com</Text>
        </View>

        {/* Role Information */}
        <View style={styles.roleContainer}>
          <Text style={styles.roleTitle}>Role Information</Text>
          <View style={styles.roleInfo}>
            <View style={styles.roleItem}>
              <Text style={styles.roleLabel}>Position:</Text>
              <Text style={styles.roleValue}>{mockUser.position}</Text>
            </View>
            <View style={styles.roleItem}>
              <Text style={styles.roleLabel}>Department:</Text>
              <Text style={styles.roleValue}>{mockUser.department}</Text>
            </View>
            <View style={styles.roleItem}>
              <Text style={styles.roleLabel}>Permissions:</Text>
              <View style={styles.permissionsList}>
                {mockUser.permissions && mockUser.permissions.length > 0 ? (
                  mockUser.permissions.map((permission, index) => (
                    <View key={index} style={styles.permissionTag}>
                      <Text style={styles.permissionText}>{permission}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.roleValue}>No permissions assigned</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Profile Options */}
        <View style={styles.optionsContainer}>
          {profileOptions.map((option) => (
            <ListItem
              key={option.id}
              title={option.title}
              leftIcon={option.icon}
              onPress={option.onPress}
              showBorder={true}
              variant="simple"
            />
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            title="Sign Out"
            variant="outline"
            onPress={() => console.log("Sign out")}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },

  avatarContainer: {
    position: "relative",
    marginBottom: SPACING.lg,
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gray200,
  },

  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: COLORS.surface,
  },

  userName: {
    ...TEXT_STYLES.h2,
    marginBottom: SPACING.xs,
  },

  userEmail: {
    ...TEXT_STYLES.body,
    color: COLORS.textSecondary,
  },

  roleContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  roleTitle: {
    ...TEXT_STYLES.h3,
    marginBottom: SPACING.md,
  },

  roleInfo: {
    gap: SPACING.sm,
  },

  roleItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  roleLabel: {
    ...TEXT_STYLES.bodyMedium,
    color: COLORS.textSecondary,
    flex: 1,
  },

  roleValue: {
    ...TEXT_STYLES.bodyMedium,
    color: COLORS.textPrimary,
    flex: 2,
  },

  permissionsList: {
    flex: 2,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.xs,
  },

  permissionTag: {
    backgroundColor: COLORS.primary + "20",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.primary + "40",
  },

  permissionText: {
    ...TEXT_STYLES.caption,
    color: COLORS.primary,
    fontWeight: "600",
  },

  optionsContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
  },

  logoutContainer: {
    paddingBottom: SPACING.xl,
  },
});

export default ProfileScreen;
