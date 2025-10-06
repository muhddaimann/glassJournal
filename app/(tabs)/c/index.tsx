import * as React from "react";
import { View, StyleSheet } from "react-native";
import {
  Card,
  Text,
  useTheme,
  Chip,
  Divider,
  ProgressBar,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

/** ---------- Types & Mock ---------- */
type Entry = { id: number; date: string; mood: string; note: string };

const MOCK: Entry[] = [
  { id: 1, date: "2025-10-03", mood: "joy", note: "Coffee with friends" },
  { id: 2, date: "2025-10-03", mood: "ok", note: "Wrapped sprint" },
  { id: 3, date: "2025-10-02", mood: "calm", note: "Evening walk" },
  { id: 4, date: "2025-09-30", mood: "low", note: "Long day" },
  { id: 5, date: "2025-09-28", mood: "joy", note: "Family dinner" },
];

/** ---------- Constants ---------- */
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const MOOD_SCORE: Record<string, number> = {
  joy: 2,
  calm: 1,
  ok: 0,
  low: -1,
  down: -2,
};
const MOOD_ICON: Record<string, string> = {
  joy: "emoticon-happy-outline",
  calm: "emoticon-cool-outline",
  ok: "emoticon-neutral-outline",
  low: "emoticon-sad-outline",
  down: "emoticon-cry-outline",
};

/** ---------- Utils ---------- */
function toDate(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function getLastNDays(n: number, from = new Date()) {
  const arr: Date[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(from);
    d.setDate(from.getDate() - i);
    arr.push(d);
  }
  return arr;
}
function weekdayIndexMon0(d: Date) {
  // Mon=0 ... Sun=6
  return (d.getDay() + 6) % 7;
}

/** ---------- Derivations from data ---------- */
function useInsights(entries: Entry[]) {
  // Sort by date asc for streak checks
  const sorted = React.useMemo(
    () => [...entries].sort((a, b) => (a.date < b.date ? -1 : 1)),
    [entries]
  );

  // Mood distribution
  const moodCounts = React.useMemo(() => {
    const m = new Map<string, number>();
    sorted.forEach((e) => m.set(e.mood, (m.get(e.mood) ?? 0) + 1));
    const total = sorted.length || 1;
    return Array.from(m.entries())
      .map(([mood, count]) => ({ mood, count, pct: count / total }))
      .sort((a, b) => b.count - a.count);
  }, [sorted]);

  // Weekday pattern (entries per weekday)
  const weekdayCounts = React.useMemo(() => {
    const arr = Array(7).fill(0);
    sorted.forEach((e) => {
      arr[weekdayIndexMon0(toDate(e.date))] += 1;
    });
    const max = Math.max(1, ...arr);
    return { arr, max };
  }, [sorted]);

  // 14-day trend of mood score (take average score per day if multiple)
  const trend14 = React.useMemo(() => {
    const last14 = getLastNDays(14);
    const byDate = new Map<string, Entry[]>();
    sorted.forEach((e) => {
      const k = e.date;
      if (!byDate.has(k)) byDate.set(k, []);
      byDate.get(k)!.push(e);
    });
    const points = last14.map((d) => {
      const key = formatDate(d);
      const list = byDate.get(key) ?? [];
      if (list.length === 0) return { date: key, score: 0 };
      const avg =
        list.reduce((sum, it) => sum + (MOOD_SCORE[it.mood] ?? 0), 0) /
        list.length;
      return { date: key, score: avg };
    });
    const maxAbs = Math.max(1, ...points.map((p) => Math.abs(p.score)));
    return { points, maxAbs };
  }, [sorted]);

  // Streaks
  const { currentStreak, bestStreak } = React.useMemo(() => {
    // Treat "had any entry that day" as streak day; track also positive streak
    const uniqueDays = Array.from(new Set(sorted.map((e) => e.date))).map(
      toDate
    );
    uniqueDays.sort((a, b) => +a - +b);

    let best = 0;
    let cur = 0;

    for (let i = 0; i < uniqueDays.length; i++) {
      if (i === 0) {
        cur = 1;
        best = 1;
        continue;
      }
      const prev = uniqueDays[i - 1];
      const now = uniqueDays[i];
      const diffDays = Math.round((+now - +prev) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        cur += 1;
      } else {
        best = Math.max(best, cur);
        cur = 1;
      }
    }
    best = Math.max(best, cur);
    // Check if current streak extends to today
    const todayKey = formatDate(new Date());
    const lastKey = uniqueDays.length
      ? formatDate(uniqueDays[uniqueDays.length - 1])
      : "";
    const isStillCurrent =
      lastKey === todayKey ||
      lastKey ===
        formatDate(new Date(new Date().setDate(new Date().getDate() - 1)));
    return { currentStreak: isStillCurrent ? cur : 0, bestStreak: best };
  }, [sorted]);

  // Frequent words from notes (simple)
  const frequentWords = React.useMemo(() => {
    const stop = new Set(
      "a an the and or to of for in on with at from by is are was were been be am pm i me my our we you your they them their it its this that these those had has have do did done not no yes very really just so like about around".split(
        " "
      )
    );
    const m = new Map<string, number>();
    sorted.forEach((e) => {
      e.note
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean)
        .forEach((w) => {
          if (stop.has(w)) return;
          if (w.length < 3) return;
          m.set(w, (m.get(w) ?? 0) + 1);
        });
    });
    return Array.from(m.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([w]) => w);
  }, [sorted]);

  return {
    moodCounts,
    weekdayCounts,
    trend14,
    currentStreak,
    bestStreak,
    frequentWords,
  };
}

/** ---------- UI ---------- */
export default function ReflectPage() {
  const theme = useTheme();
  const {
    moodCounts,
    weekdayCounts,
    trend14,
    currentStreak,
    bestStreak,
    frequentWords,
  } = useInsights(MOCK);

  // Mood legend ordering
  const moodOrder = ["joy", "calm", "ok", "low", "down"];
  const moodSeries = moodOrder
    .map((m) => moodCounts.find((x) => x.mood === m))
    .filter(Boolean) as { mood: string; count: number; pct: number }[];

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Card mode="elevated" style={styles.card}>
        <Card.Content style={styles.headerRow}>
          <Text variant="titleLarge">Patterns & Emotional Trends</Text>
          <MaterialCommunityIcons
            name="chart-timeline-variant"
            size={wp("7%")}
            color={theme.colors.primary}
          />
        </Card.Content>
      </Card>

      {/* Mood Mix */}
      <Card mode="elevated" style={styles.card}>
        <Card.Content style={{ gap: wp("3%") }}>
          <Text variant="titleMedium">Mood mix</Text>
          {moodSeries.length === 0 ? (
            <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
              No data
            </Text>
          ) : (
            moodSeries.map((m) => (
              <View key={m.mood} style={{ gap: wp("1%") }}>
                <View style={styles.rowBetween}>
                  <View style={styles.row}>
                    <MaterialCommunityIcons
                      name={MOOD_ICON[m.mood] as any}
                      size={wp("5.5%")}
                      color={theme.colors.primary}
                    />
                    <Text variant="bodyLarge" style={{ marginLeft: wp("2%") }}>
                      {m.mood.toUpperCase()}
                    </Text>
                  </View>
                  <Text variant="bodyLarge">{Math.round(m.pct * 100)}%</Text>
                </View>
                <ProgressBar progress={m.pct} />
              </View>
            ))
          )}
        </Card.Content>
      </Card>

      {/* Weekday pattern */}
      <Card mode="elevated" style={styles.card}>
        <Card.Content style={{ gap: wp("3%") }}>
          <Text variant="titleMedium">Weekday pattern</Text>
          <Text variant="bodySmall" style={{ opacity: 0.7 }}>
            Days you tend to journal more
          </Text>
          <View style={styles.barWrap}>
            {WEEKDAYS.map((w, i) => {
              const v = weekdayCounts.arr[i];
              const h = (v / Math.max(1, weekdayCounts.max)) * wp("20%");
              return (
                <View key={w} style={styles.barCol}>
                  <View
                    style={[
                      styles.bar,
                      { height: h, backgroundColor: theme.colors.primary },
                    ]}
                  />
                  <Text variant="labelSmall" style={{ marginTop: wp("1%") }}>
                    {w}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card.Content>
      </Card>

      {/* 14-day trend */}
      <Card mode="elevated" style={styles.card}>
        <Card.Content style={{ gap: wp("2%") }}>
          <Text variant="titleMedium">14-day mood trend</Text>
          <Text variant="bodySmall" style={{ opacity: 0.7 }}>
            Above line = brighter days, below = heavier days
          </Text>
          <View
            style={[styles.trendBox, { borderColor: theme.colors.outline }]}
          >
            {/* Zero line */}
            <View
              style={[
                styles.zeroLine,
                { backgroundColor: theme.colors.outline },
              ]}
            />

            {/* Bars */}
            <View style={styles.trendBars}>
              {trend14.points.map((p, idx) => {
                const sign = Math.sign(p.score);
                const magnitude = Math.abs(p.score) / trend14.maxAbs;
                const barH = magnitude * wp("18%"); // half-box height
                const isUp = sign >= 0;
                return (
                  <View key={idx} style={styles.trendBarCol}>
                    <View
                      style={[
                        styles.trendBar,
                        {
                          height: barH,
                          backgroundColor: isUp
                            ? theme.colors.primary
                            : theme.colors.error,
                          alignSelf: "center",
                          marginTop: isUp ? wp("18%") - barH : wp("18%"),
                        },
                      ]}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Streaks */}
      <Card mode="elevated" style={styles.card}>
        <Card.Content style={{ gap: wp("1.5%") }}>
          <Text variant="titleMedium">Streaks</Text>
          <Divider />
          <View style={styles.rowBetween}>
            <Text variant="bodyLarge">Current streak</Text>
            <Text variant="titleLarge">
              {currentStreak} day{currentStreak === 1 ? "" : "s"}
            </Text>
          </View>
          <View style={styles.rowBetween}>
            <Text variant="bodyLarge">Best streak</Text>
            <Text variant="titleLarge">
              {bestStreak} day{bestStreak === 1 ? "" : "s"}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Frequent words */}
      <Card mode="elevated" style={styles.card}>
        <Card.Content style={{ gap: wp("2%") }}>
          <Text variant="titleMedium">Frequent words</Text>
          {frequentWords.length === 0 ? (
            <Text variant="bodyMedium" style={{ opacity: 0.7 }}>
              No notes yet
            </Text>
          ) : (
            <View style={styles.wrapChips}>
              {frequentWords.map((w) => (
                <Chip
                  key={w}
                  style={{ marginRight: wp("1%"), marginBottom: wp("1%") }}
                >
                  {w}
                </Chip>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );
}

/** ---------- Styles ---------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: wp("4%"), gap: wp("3%") },
  card: { borderRadius: wp("4%") },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  row: { flexDirection: "row", alignItems: "center" },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  barWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: wp("2%"),
  },
  barCol: { alignItems: "center", width: `${100 / 7 - 1}%` },
  bar: {
    width: "100%",
    borderRadius: wp("1%"),
  },

  trendBox: {
    height: wp("36%"),
    borderWidth: 1,
    borderRadius: wp("2%"),
    overflow: "hidden",
    paddingHorizontal: wp("1%"),
    justifyContent: "center",
  },
  zeroLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: 1,
    opacity: 0.6,
  },
  trendBars: {
    flexDirection: "row",
    height: "100%",
    alignItems: "stretch",
  },
  trendBarCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  trendBar: {
    width: wp("2%"),
    borderRadius: wp("1%"),
  },

  wrapChips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
