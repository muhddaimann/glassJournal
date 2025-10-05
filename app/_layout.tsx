
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider, useThemeContext } from '../contexts/themeContext';

function RootLayoutNav() {
  const { theme } = useThemeContext();
  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}
