import * as React from "react";
import { View, StyleSheet, FlatList, TextInput } from "react-native";
import {
  Card,
  Text,
  useTheme,
  Button,
  Chip,
  Snackbar,
  ProgressBar,
} from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MOODS = [
  { key: "joy", label: "Joy", icon: "emoticon-happy-outline", score: 5 },
  { key: "calm", label: "Calm", icon: "emoticon-cool-outline", score: 4 },
  { key: "ok", label: "OK", icon: "emoticon-neutral-outline", score: 3 },
  { key: "low", label: "Low", icon: "emoticon-sad-outline", score: 2 },
  { key: "down", label: "Down", icon: "emoticon-cry-outline", score: 1 },
];

const SAMPLE = [
  { id: 1, mood: "joy", label: "Joy", date: "Today", note: "Great workout" },
  { id: 2, mood: "ok", label: "OK", date: "Yesterday", note: "Busy but fine" },
  {
    id: 3,
    mood: "calm",
    label: "Calm",
    date: "2 days ago",
    note: "Read a book",
  },
];

export default function HomePage() {
  const theme = useTheme();
  const [selected, setSelected] = React.useState<string | null>(null);
  const [note, setNote] = React.useState("");
  const [toast, setToast] = React.useState<string | null>(null);
  const avgScore = 3.8;
  const streak = 4;

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={styles.heading} variant="headlineSmall">
        Daily Check-In
      </Text>

      <Card mode="elevated" style={styles.card}>
        <Card.Content style={{ gap: wp("3%") }}>
          <Text variant="titleMedium">How do you feel?</Text>
          <FlatList
            data={MOODS}
            keyExtractor={(i) => i.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: wp("2.5%") }}
            renderItem={({ item }) => {
              const active = selected === item.key;
              return (
                <Chip
                  selected={active}
                  onPress={() => setSelected(item.key)}
                  mode={active ? "flat" : "outlined"}
                  style={{ height: wp("10%") }}
                  icon={() => (
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={wp("5.5%")}
                      color={
                        active ? theme.colors.onPrimary : theme.colors.primary
                      }
                    />
                  )}
                >
                  {item.label}
                </Chip>
              );
            }}
          />
          <View style={styles.noteBox}>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Add a short note (optional)"
              placeholderTextColor={theme.colors.outline}
              style={[
                styles.input,
                {
                  color: theme.colors.onSurface,
                  backgroundColor:
                    theme.colors.elevation?.level1 ??
                    theme.colors.surfaceVariant,
                },
              ]}
              multiline
            />
          </View>
          <Button
            mode="contained"
            onPress={() => {
              if (!selected) return setToast("Select a mood to save");
              setToast("Saved today’s check-in");
              setNote("");
              setSelected(null);
            }}
            disabled={!selected}
            contentStyle={{ height: wp("12%") }}
            style={{ borderRadius: wp("3%") }}
          >
            Save today’s check-in
          </Button>
        </Card.Content>
      </Card>

      <Text style={styles.subheading} variant="titleMedium">
        At a glance
      </Text>

      <View style={styles.kpis}>
        <Card mode="elevated" style={styles.kpiCard}>
          <Card.Content style={{ gap: wp("2%") }}>
            <Text variant="labelLarge">Weekly Average</Text>
            <Text variant="headlineSmall">{avgScore.toFixed(1)} / 5</Text>
            <ProgressBar progress={avgScore / 5} />
          </Card.Content>
        </Card>
        <Card mode="elevated" style={styles.kpiCard}>
          <Card.Content style={{ gap: wp("2%") }}>
            <Text variant="labelLarge">Streak</Text>
            <Text variant="headlineSmall">{streak} days</Text>
            <Text variant="bodySmall">Keep it going</Text>
          </Card.Content>
        </Card>
      </View>

      <Card mode="elevated" style={styles.listCard}>
        <Card.Content style={{ gap: wp("3%") }}>
          <Text variant="titleMedium">Recent entries</Text>
          <View style={{ gap: wp("2%") }}>
            {SAMPLE.map((it) => (
              <View
                key={it.id}
                style={[
                  styles.row,
                  {
                    backgroundColor:
                      theme.colors.elevation?.level1 ?? theme.colors.surface,
                  },
                ]}
              >
                <View style={styles.rowLeft}>
                  <MaterialCommunityIcons
                    name={MOODS.find((m) => m.key === it.mood)?.icon as any}
                    size={wp("6%")}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.rowBody}>
                  <Text variant="bodyLarge">{it.label}</Text>
                  <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                    {it.note}
                  </Text>
                </View>
                <Text variant="labelMedium" style={styles.rowRight}>
                  {it.date}
                </Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Snackbar
        visible={!!toast}
        onDismiss={() => setToast(null)}
        duration={1800}
      >
        {toast ?? ""}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp("4%"),
    paddingTop: wp("4%"),
    gap: wp("3%"),
  },
  heading: { marginBottom: wp("1%") },
  subheading: { marginTop: wp("2%"), marginBottom: wp("1%") },
  card: { borderRadius: wp("4%") },
  noteBox: { borderRadius: wp("3%"), overflow: "hidden" },
  input: { padding: wp("3%"), minHeight: wp("20%"), borderRadius: wp("3%") },
  kpis: { flexDirection: "row", gap: wp("3%") },
  kpiCard: { flex: 1, borderRadius: wp("4%") },
  listCard: { borderRadius: wp("4%") },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: wp("3%"),
    borderRadius: wp("3%"),
  },
  rowLeft: { width: wp("10%"), alignItems: "center" },
  rowBody: { flex: 1 },
  rowRight: { marginLeft: wp("2%") },
});
