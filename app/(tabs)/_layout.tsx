import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from "react-native-paper";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarLabelStyle: { fontSize: wp("3.4%"), fontWeight: "600" },
        tabBarItemStyle: { paddingVertical: wp("1.6%") },
        tabBarStyle: {
          position: "absolute",
          left: wp("4%"),
          right: wp("4%"),
          bottom: wp("6%"),
          height: wp("15%"),
          borderRadius: wp("8%"),
          borderTopWidth: 0,
          backgroundColor: theme.colors.surface,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 6,
        },
      }}
    >
      <Tabs.Screen
        name="a"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="notebook-plus"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="b"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="notebook-multiple"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="c"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-line"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="d"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
