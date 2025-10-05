
import { View } from 'react-native';
import { Button, Card, Text, useTheme } from 'react-native-paper';
import { useThemeContext } from '../contexts/themeContext';

export default function Index() {
  const theme = useTheme();
  const { toggleTheme } = useThemeContext();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: theme.colors.background }}>
      <Card style={{ width: '100%', backgroundColor: theme.colors.surface }}>
        <Card.Title title="Glass Journal" />
        <Card.Content>
          <Text variant="bodyMedium">Welcome to your Glass Journal. Start by writing a new entry.</Text>
        </Card.Content>
        <Card.Actions>
          <Button onPress={toggleTheme}>Toggle Theme</Button>
          <Button>New Entry</Button>
        </Card.Actions>
      </Card>
    </View>
  );
}
