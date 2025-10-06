import * as React from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { Card, Text, useTheme, Chip, Divider } from "react-native-paper";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Entry = { id: number; date: string; mood: string; note: string };

const MOCK: Entry[] = [
  { id: 1, date: "2025-10-03", mood: "joy", note: "Coffee with friends" },
  { id: 2, date: "2025-10-03", mood: "ok", note: "Wrapped sprint" },
  { id: 3, date: "2025-10-02", mood: "calm", note: "Evening walk" },
  { id: 4, date: "2025-09-30", mood: "low", note: "Long day" },
  { id: 5, date: "2025-09-28", mood: "joy", note: "Family dinner" },
];

const MOOD_ICON: Record<string, string> = {
  joy: "emoticon-happy-outline",
  calm: "emoticon-cool-outline",
  ok: "emoticon-neutral-outline",
  low: "emoticon-sad-outline",
  down: "emoticon-cry-outline",
};

function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function monthLabel(d: Date) {
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

function getMonthMatrix(d: Date) {
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const startWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++)
    cells.push(new Date(d.getFullYear(), d.getMonth(), day));
  while (cells.length % 7 !== 0) cells.push(null);
  const rows: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
  return rows;
}

export default function TimelinePage() {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(
    new Date()
  );
  const [filter, setFilter] = React.useState<"date" | "month">("date");

  const rows = getMonthMatrix(currentMonth);
  const selectedKey = selectedDate ? formatDate(selectedDate) : null;

  const monthEntries = React.useMemo(
    () =>
      MOCK.filter((e) =>
        e.date.startsWith(
          `${currentMonth.getFullYear()}-${String(
            currentMonth.getMonth() + 1
          ).padStart(2, "0")}`
        )
      ),
    [currentMonth]
  );
  const dateEntries = React.useMemo(
    () => (selectedKey ? MOCK.filter((e) => e.date === selectedKey) : []),
    [selectedKey]
  );

  const data = filter === "date" ? dateEntries : monthEntries;
  const grouped = React.useMemo(() => {
    const map = new Map<string, Entry[]>();
    data.forEach((e) => {
      if (!map.has(e.date)) map.set(e.date, []);
      map.get(e.date)!.push(e);
    });
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [data]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Card mode="elevated" style={styles.headerCard}>
        <Card.Content style={styles.headerRow}>
          <Pressable
            onPress={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() - 1,
                  1
                )
              )
            }
            style={styles.navBtn}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={wp("7%")}
              color={theme.colors.primary}
            />
          </Pressable>
          <Text variant="titleLarge">{monthLabel(currentMonth)}</Text>
          <Pressable
            onPress={() =>
              setCurrentMonth(
                new Date(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth() + 1,
                  1
                )
              )
            }
            style={styles.navBtn}
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={wp("7%")}
              color={theme.colors.primary}
            />
          </Pressable>
        </Card.Content>
        <Divider />
        <Card.Content style={styles.weekHeader}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <Text
              key={d}
              variant="labelSmall"
              style={{
                opacity: 0.7,
                width: `${100 / 7}%`,
                textAlign: "center",
              }}
            >
              {d}
            </Text>
          ))}
        </Card.Content>
        <Card.Content style={styles.grid}>
          {rows.map((row, rIdx) => (
            <View key={rIdx} style={styles.gridRow}>
              {row.map((cell, cIdx) => {
                const isSelected = cell && selectedKey === formatDate(cell);
                const hasEntry =
                  cell && MOCK.some((e) => e.date === formatDate(cell));
                return (
                  <Pressable
                    key={cIdx}
                    style={[
                      styles.dayCell,
                      isSelected && {
                        backgroundColor: theme.colors.primary,
                        borderColor: theme.colors.primary,
                      },
                    ]}
                    onPress={() => cell && setSelectedDate(cell)}
                    disabled={!cell}
                  >
                    <Text
                      variant="bodyMedium"
                      style={{
                        color: isSelected
                          ? theme.colors.onPrimary
                          : theme.colors.onSurface,
                        opacity: cell ? 1 : 0,
                        textAlign: "center",
                      }}
                    >
                      {cell ? cell.getDate() : ""}
                    </Text>
                    {hasEntry && (
                      <View
                        style={[
                          styles.dot,
                          {
                            backgroundColor: isSelected
                              ? theme.colors.onPrimary
                              : theme.colors.primary,
                          },
                        ]}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          ))}
        </Card.Content>
        <Card.Content style={styles.filterRow}>
          <Chip
            selected={filter === "date"}
            onPress={() => setFilter("date")}
            style={styles.chip}
          >
            Selected date
          </Chip>
          <Chip
            selected={filter === "month"}
            onPress={() => setFilter("month")}
            style={styles.chip}
          >
            Whole month
          </Chip>
        </Card.Content>
      </Card>

      <Card mode="elevated" style={styles.listCard}>
        <Card.Content style={{ gap: wp("3%") }}>
          <Text variant="titleMedium">
            {filter === "date" ? selectedKey ?? "" : monthLabel(currentMonth)}
          </Text>
          <FlatList
            data={grouped}
            keyExtractor={([k]) => k}
            ItemSeparatorComponent={() => <View style={{ height: wp("2%") }} />}
            renderItem={({ item: [date, items] }) => (
              <View style={styles.section}>
                <Text
                  variant="labelLarge"
                  style={{ opacity: 0.7, marginBottom: wp("1.5%") }}
                >
                  {date}
                </Text>
                {items.map((it) => (
                  <View key={it.id} style={styles.row}>
                    <View style={styles.rowIcon}>
                      <MaterialCommunityIcons
                        name={MOOD_ICON[it.mood] as any}
                        size={wp("6%")}
                        color={theme.colors.primary}
                      />
                    </View>
                    <View style={styles.rowBody}>
                      <Text variant="bodyLarge">{it.mood.toUpperCase()}</Text>
                      <Text variant="bodySmall" style={{ opacity: 0.7 }}>
                        {it.note}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
            ListEmptyComponent={
              <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
                No entries
              </Text>
            }
          />
        </Card.Content>
      </Card>
    </View>
  );
}

const CELL = wp("11.5%");
const GAP = wp("1.8%");

const styles = StyleSheet.create({
  container: { flex: 1, padding: wp("4%"), gap: wp("3%") },
  headerCard: { borderRadius: wp("4%") },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: wp("2%"),
  },
  navBtn: { padding: wp("1%") },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: wp("2%"),
  },
  grid: { gap: GAP, marginTop: GAP },
  gridRow: { flexDirection: "row", justifyContent: "space-between", gap: GAP },
  dayCell: {
    width: CELL,
    height: CELL,
    borderRadius: wp("2%"),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    width: wp("1.8%"),
    height: wp("1.8%"),
    borderRadius: wp("0.9%"),
    marginTop: wp("0.8%"),
  },
  filterRow: { flexDirection: "row", gap: wp("2%"), marginTop: wp("2%") },
  chip: { height: wp("8%") },
  listCard: { borderRadius: wp("4%") },
  section: { paddingVertical: wp("1%") },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: wp("2.5%"),
    paddingHorizontal: wp("2%"),
    borderRadius: wp("3%"),
  },
  rowIcon: { width: wp("10%"), alignItems: "center" },
  rowBody: { flex: 1 },
});
