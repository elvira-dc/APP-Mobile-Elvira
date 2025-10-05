import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// Import screens
import {
  MessagesScreen,
  ChatScreen,
  RoomsScreen,
  MyTasksScreen,
  CalendarScreen,
  ProfileScreen,
} from "@screens";

// Import the messages screen reference getter
import { getMessagesScreenRef } from "@screens/MessagesScreen";

// Import hooks
import { useRooms } from "@hooks/useRooms";
import { useTasks } from "@hooks/useTasks";

// Import constants
import { COLORS } from "@constants/colors";

// Import header components
import {
  ElviraHeader,
  SearchButton,
  NotificationButton,
  SettingsButton,
  AddButton,
  PeopleButton,
  EyeButton,
  SortButton,
} from "@components/common";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Component wrapper for RoomsScreen that can use hooks and manage filter count
const RoomsScreenWithHeader = ({ navigation, route }) => {
  const { items: rooms } = useRooms();
  const [filteredCount, setFilteredCount] = React.useState(rooms.length || 0);

  // Store filtered room count in navigation params so it can be accessed by header
  React.useEffect(() => {
    navigation.setParams({ roomCount: filteredCount });
  }, [navigation, filteredCount]);

  // Function to update filtered count from RoomsScreen
  const updateFilteredCount = React.useCallback((count) => {
    setFilteredCount(count);
  }, []);

  return <RoomsScreen onFilteredCountChange={updateFilteredCount} />;
};

// Component wrapper for MyTasksScreen that can use hooks and manage filter count
const MyTasksScreenWithHeader = ({ navigation, route }) => {
  const { tasks } = useTasks();
  const [filteredCount, setFilteredCount] = React.useState(tasks.length || 0);

  // Store filtered task count in navigation params so it can be accessed by header
  React.useEffect(() => {
    navigation.setParams({ taskCount: filteredCount });
  }, [navigation, filteredCount]);

  // Function to update filtered count from MyTasksScreen
  const updateFilteredCount = React.useCallback((count) => {
    setFilteredCount(count);
  }, []);

  return <MyTasksScreen onFilteredCountChange={updateFilteredCount} />;
};

// Messages Stack Navigator
const MessagesStackNavigator = ({ navigation, route }) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MessagesList"
        component={MessagesScreen}
        options={{ headerShown: false }}
        initialParams={{ parentNavigation: navigation }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Rooms"
        screenOptions={({ route, navigation }) => {
          // Check if we're currently on a Chat screen (nested in Messages stack)
          const routeState = route.state;
          const isOnChatScreen =
            routeState?.routes?.[routeState?.index]?.name === "Chat";

          return {
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Messages") {
                iconName = focused ? "chatbubbles" : "chatbubbles-outline";
              } else if (route.name === "Rooms") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "MyTasks") {
                iconName = focused ? "checkbox" : "checkbox-outline";
              } else if (route.name === "Calendar") {
                iconName = focused ? "calendar" : "calendar-outline";
              } else if (route.name === "Profile") {
                iconName = focused ? "person" : "person-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.gray,
            tabBarStyle: isOnChatScreen
              ? { display: "none" }
              : {
                  backgroundColor: COLORS.white,
                  borderTopColor: COLORS.border,
                  paddingBottom: 20, // Increased to avoid overlap with bottom notch
                  paddingTop: 8,
                  height: 85, // Increased height to accommodate larger padding
                  paddingHorizontal: 10,
                },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: "500",
            },
            // Use custom header component
            header: ({ route }) => {
              // Define screen-specific configurations
              const getHeaderConfig = () => {
                switch (route.name) {
                  case "Messages":
                    return {
                      title: "Messages",
                      rightButton: (
                        <AddButton
                          onPress={() => {
                            console.log("Add button pressed in Messages");

                            // Try the ref-based approach first
                            const messagesRef = getMessagesScreenRef();
                            if (messagesRef && messagesRef.openNewChat) {
                              console.log("Calling via messagesRef");
                              messagesRef.openNewChat();
                            } else if (MessagesScreen.openNewChat) {
                              console.log(
                                "Calling MessagesScreen.openNewChat directly"
                              );
                              MessagesScreen.openNewChat();
                            } else {
                              console.log(
                                "No available method to open new chat"
                              );
                            }
                          }}
                        />
                      ),
                    };
                  case "Rooms":
                    const roomCount = route.params?.roomCount || 0;
                    return {
                      title: `Rooms (${roomCount})`,
                      rightButton: (
                        <AddButton onPress={() => console.log("Add room")} />
                      ),
                    };
                  case "MyTasks":
                    const taskCount = route.params?.taskCount || 0;
                    return {
                      title: `My Tasks (${taskCount})`,
                      rightButton: (
                        <View style={{ flexDirection: "row" }}>
                          <SortButton
                            onPress={() => {
                              if (MyTasksScreen.toggleSort) {
                                MyTasksScreen.toggleSort();
                              } else {
                                console.log("Sort function not available");
                              }
                            }}
                          />
                          <View style={{ marginLeft: 8 }}>
                            <PeopleButton
                              onPress={() => {
                                if (MyTasksScreen.openStaffModal) {
                                  MyTasksScreen.openStaffModal();
                                } else {
                                  console.log("Staff modal not available");
                                }
                              }}
                            />
                          </View>
                          <View style={{ marginLeft: 8 }}>
                            <AddButton
                              onPress={() => {
                                console.log("➕ Add button pressed in MyTasks");
                                console.log(
                                  "MyTasksScreen.openTaskModal exists:",
                                  !!MyTasksScreen.openTaskModal
                                );
                                if (MyTasksScreen.openTaskModal) {
                                  MyTasksScreen.openTaskModal();
                                } else {
                                  console.log("❌ Task modal not available");
                                }
                              }}
                            />
                          </View>
                        </View>
                      ),
                    };
                  case "Calendar":
                    return {
                      title: "Calendar",
                      rightButton: (
                        <View style={{ flexDirection: "row" }}>
                          <PeopleButton
                            onPress={() => {
                              if (CalendarScreen.openStaffModal) {
                                CalendarScreen.openStaffModal();
                              } else {
                                console.log(
                                  "Calendar staff modal not available"
                                );
                              }
                            }}
                          />
                          <View style={{ marginLeft: 8 }}>
                            <EyeButton
                              onPress={() => {
                                if (CalendarScreen.toggleCalendar) {
                                  CalendarScreen.toggleCalendar();
                                } else {
                                  console.log("Calendar toggle not available");
                                }
                              }}
                            />
                          </View>
                        </View>
                      ),
                    };
                  case "Profile":
                    return {
                      title: "Profile",
                      rightButton: (
                        <SettingsButton
                          onPress={() => console.log("Settings")}
                        />
                      ),
                    };
                  default:
                    return { title: "Elvira" };
                }
              };

              const config = getHeaderConfig();
              return <ElviraHeader {...config} />;
            },
          };
        }}
      >
        <Tab.Screen
          name="Messages"
          component={MessagesStackNavigator}
          options={{
            tabBarLabel: "Messages",
          }}
        />
        <Tab.Screen
          name="Rooms"
          component={RoomsScreenWithHeader}
          options={{
            tabBarLabel: "Rooms",
          }}
        />
        <Tab.Screen
          name="MyTasks"
          component={MyTasksScreenWithHeader}
          options={{
            tabBarLabel: "My Tasks",
          }}
        />
        <Tab.Screen
          name="Calendar"
          component={CalendarScreen}
          options={{
            tabBarLabel: "Calendar",
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profile",
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
