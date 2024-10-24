import { Tabs } from "expo-router";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const HomeIcon: React.FC<{ color: string; focused: boolean }> = ({
  color,
  focused,
}) => <TabBarIcon name={focused ? "home" : "home-outline"} color={color} />;

const AvatarIcon: React.FC<{ color: string; focused: boolean }> = ({
  color,
  focused,
}) => (
  <MaterialIcons
    name={focused ? "person" : "person-outline"}
    size={24}
    color={color}
  />
);

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: HomeIcon,
        }}
      />
      <Tabs.Screen
        name="(avatar)"
        options={{
          title: "Avatar",
          tabBarIcon: AvatarIcon,
        }}
      />
    </Tabs>
  );
}
