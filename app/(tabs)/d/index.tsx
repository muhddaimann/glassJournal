import * as React from "react";
import { View, StyleSheet } from "react-native";
import {
  Card,
  Text,
  useTheme,
  Switch,
  List,
  Divider,
  Button,
  Chip,
  SegmentedButtons,
  Portal,
  Modal,
  TextInput,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

type Prefs = {
  language: "en" | "ms";
  tone: "formal" | "casual";
  dailyReminder: boolean;
  reminderTime: string;
  weeklySummary: boolean;
  sound: boolean;
  haptics: boolean;
  showCalendarDots: boolean;
  moodScale: "3" | "5";
  privacyLock: boolean;
};

export default function SettingPage() {
  const theme = useTheme();
  const [prefs, setPrefs] = React.useState<Prefs>({
    language: "en",
    tone: "casual",
    dailyReminder: true,
    reminderTime: "21:00",
    weeklySummary: true,
    sound: true,
    haptics: true,
    showCalendarDots: true,
    moodScale: "5",
    privacyLock: false,
  });
  const [timeOpen, setTimeOpen] = React.useState(false);
  const [timeBuf, setTimeBuf] = React.useState(prefs.reminderTime);

  const set = <K extends keyof Prefs>(k: K, v: Prefs[K]) =>
    setPrefs((p) => ({ ...p, [k]: v }));

  const reset = () =>
    setPrefs({
      language: "en",
      tone: "casual",
      dailyReminder: true,
      reminderTime: "21:00",
      weeklySummary: true,
      sound: true,
      haptics: true,
      showCalendarDots: true,
      moodScale: "5",
      privacyLock: false,
    });

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Card mode="elevated" style={styles.card}>
        <Card.Content style={styles.headerRow}>
          <Text variant="titleLarge">Personalize Experience & Settings</Text>
          <MaterialCommunityIcons
            name="tune-variant"
            size={wp("7%")}
            color={theme.colors.primary}
          />
        </Card.Content>
      </Card>

      <Card mode="elevated" style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Appearance</Text>
          <Divider />
          <Text
            style={{ marginTop: wp("2%"), marginBottom: wp("1%") }}
            variant="bodySmall"
          >
            Language
          </Text>
          <View style={styles.rowWrap}>
            {(["en", "ms"] as const).map((lang) => (
              <Chip
                key={lang}
                selected={prefs.language === lang}
                onPress={() => set("language", lang)}
                style={styles.chip}
              >
                {lang === "en" ? "English" : "Bahasa"}
              </Chip>
            ))}
          </View>
          <Text
            style={{ marginTop: wp("2%"), marginBottom: wp("1%") }}
            variant="bodySmall"
          >
            Tone
          </Text>
          <SegmentedButtons
            value={prefs.tone}
            onValueChange={(v) => set("tone", v as Prefs["tone"])}
            buttons={[
              { value: "formal", label: "Formal" },
              { value: "casual", label: "Casual" },
            ]}
          />
        </Card.Content>
      </Card>

      <Card mode="elevated" style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Journaling</Text>
          <List.Item
            title="Show dots on calendar for entries"
            left={(p) => <List.Icon {...p} icon="calendar-month-outline" />}
            right={() => (
              <Switch
                value={prefs.showCalendarDots}
                onValueChange={(v) => set("showCalendarDots", v)}
              />
            )}
          />
          <Divider />
          <Text
            style={{ marginTop: wp("2%"), marginBottom: wp("1%") }}
            variant="bodySmall"
          >
            Mood scale
          </Text>
          <SegmentedButtons
            value={prefs.moodScale}
            onValueChange={(v) => set("moodScale", v as Prefs["moodScale"])}
            buttons={[
              { value: "3", label: "3-point" },
              { value: "5", label: "5-point" },
            ]}
          />
        </Card.Content>
      </Card>

      <Card mode="elevated" style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Notifications</Text>
          <List.Item
            title="Daily reminder"
            description={prefs.reminderTime}
            left={(p) => <List.Icon {...p} icon="bell-outline" />}
            onPress={() => setTimeOpen(true)}
            right={() => (
              <Switch
                value={prefs.dailyReminder}
                onValueChange={(v) => set("dailyReminder", v)}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Weekly summary"
            left={(p) => <List.Icon {...p} icon="calendar-week-outline" />}
            right={() => (
              <Switch
                value={prefs.weeklySummary}
                onValueChange={(v) => set("weeklySummary", v)}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Sound"
            left={(p) => <List.Icon {...p} icon="volume-high" />}
            right={() => (
              <Switch
                value={prefs.sound}
                onValueChange={(v) => set("sound", v)}
              />
            )}
          />
          <Divider />
          <List.Item
            title="Haptics"
            left={(p) => <List.Icon {...p} icon="vibrate" />}
            right={() => (
              <Switch
                value={prefs.haptics}
                onValueChange={(v) => set("haptics", v)}
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card mode="elevated" style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Privacy & Security</Text>
          <List.Item
            title="Lock with passcode"
            left={(p) => <List.Icon {...p} icon="lock-outline" />}
            right={() => (
              <Switch
                value={prefs.privacyLock}
                onValueChange={(v) => set("privacyLock", v)}
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card mode="elevated" style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Data</Text>
          <View style={styles.row}>
            <Button mode="outlined" style={styles.button} icon="download">
              Export
            </Button>
            <Button mode="outlined" style={styles.button} icon="upload">
              Import
            </Button>
          </View>
          <Divider style={{ marginVertical: wp("2%") }} />
          <Button
            mode="contained"
            buttonColor={theme.colors.error}
            textColor={theme.colors.onError}
            onPress={reset}
            icon="backup-restore"
          >
            Reset to defaults
          </Button>
        </Card.Content>
      </Card>

      <Portal>
        <Modal
          visible={timeOpen}
          onDismiss={() => setTimeOpen(false)}
          contentContainerStyle={[
            styles.modal,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Text variant="titleMedium">Reminder time (24h)</Text>
          <TextInput
            mode="outlined"
            value={timeBuf}
            onChangeText={setTimeBuf}
            left={<TextInput.Icon icon="clock-outline" />}
            placeholder="HH:MM"
            keyboardType="numbers-and-punctuation"
            style={{ marginTop: wp("2%") }}
          />
          <View style={styles.row}>
            <Button
              style={styles.button}
              mode="text"
              onPress={() => setTimeOpen(false)}
            >
              Cancel
            </Button>
            <Button
              style={styles.button}
              mode="contained"
              onPress={() => {
                set("reminderTime", timeBuf);
                setTimeOpen(false);
              }}
            >
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: wp("4%"), gap: wp("3%") },
  card: { borderRadius: wp("4%") },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: wp("2%"),
    gap: wp("2%"),
  },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: wp("2%") },
  chip: { height: wp("8%") },
  button: { flex: 1 },
  modal: { margin: wp("6%"), borderRadius: wp("4%"), padding: wp("4%") },
});
