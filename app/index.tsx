import * as React from "react";
import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { Card, Text, useTheme } from "react-native-paper";
import { Link } from "expo-router";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SLIDES = [
  {
    key: "record",
    title: "Record Feelings",
    desc: "Capture today’s mood in seconds.",
    icon: "notebook-plus",
    href: "/(tabs)/a",
  },
  {
    key: "journal",
    title: "Review Entries",
    desc: "Browse past notes and patterns.",
    icon: "notebook-multiple",
    href: "/(tabs)/b",
  },
  {
    key: "insights",
    title: "Understand Trends",
    desc: "See weekly and monthly insights.",
    icon: "chart-line",
    href: "/(tabs)/c",
  },
  {
    key: "profile",
    title: "Personalize",
    desc: "Themes, reminders, and privacy.",
    icon: "cog",
    href: "/(tabs)/d",
  },
];

export default function LandingPage() {
  const theme = useTheme();
  const [index, setIndex] = React.useState(0);
  const viewConfig = React.useRef({
    viewAreaCoveragePercentThreshold: 60,
  }).current;
  const onViewableItemsChanged = React.useRef(({ viewableItems }: any) => {
    if (viewableItems?.length) setIndex(viewableItems[0].index ?? 0);
  }).current;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <FlatList
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="center"
        decelerationRate="fast"
        viewabilityConfig={viewConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        contentContainerStyle={styles.carouselContainer}
        renderItem={({ item }) => (
          <Link href={item.href} asChild>
            <Pressable style={{ width: wp("100%") }}>
              <Card
                mode="elevated"
                style={[
                  styles.card,
                  {
                    backgroundColor:
                      theme.colors.surfaceVariant ?? theme.colors.surface,
                  },
                ]}
              >
                <Card.Content style={styles.cardContent}>
                  <View
                    style={[
                      styles.iconWrap,
                      {
                        backgroundColor:
                          theme.colors.surfaceVariant ??
                          theme.colors.surface,
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={item.icon as any}
                      size={wp("10%")}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text variant="headlineMedium" style={styles.title}>
                    {item.title}
                  </Text>
                  <Text variant="bodyMedium" style={styles.desc}>
                    {item.desc}
                  </Text>
                </Card.Content>
              </Card>
            </Pressable>
          </Link>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              {
                opacity: i === index ? 1 : 0.3,
                backgroundColor:
                  i === index ? theme.colors.primary : theme.colors.outline,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const CARD_MARGIN_H = wp("4%");
const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: wp("12%") },
  carouselContainer: { alignItems: "center" },
  card: {
    marginHorizontal: CARD_MARGIN_H,
    marginTop: wp("6%"),
    width: wp("100%") - CARD_MARGIN_H * 2,
    height: wp("60%"),
    borderRadius: wp("5%"),
    justifyContent: "center",
  },
  cardContent: {
    alignItems: "center",
    paddingVertical: wp("5%"),
    gap: wp("3%"),
  },
  iconWrap: {
    width: wp("20%"),
    height: wp("20%"),
    borderRadius: wp("5%"),
    alignItems: "center",
    justifyContent: "center",
  },
  title: { textAlign: "center" },
  desc: { textAlign: "center", opacity: 0.8, paddingHorizontal: wp("5%") },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: wp("2%"),
    paddingVertical: wp("4%"),
  },
  dot: {
    width: wp("2.2%"),
    height: wp("2.2%"),
    borderRadius: wp("1.1%"),
  },
});
