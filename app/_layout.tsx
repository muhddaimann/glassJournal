import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useThemeContext } from "../contexts/themeContext";
import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

function RootLayoutNav() {
  const { theme } = useThemeContext();

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaView>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <RootLayoutNav />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
