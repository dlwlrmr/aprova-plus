import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING = {
  // Navigation
  "house.fill": "home",
  "chart.bar.fill": "bar-chart",
  "timer": "timer",
  "person.fill": "person",
  // Actions
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "checkmark.circle.fill": "check-circle",
  "checkmark.circle": "radio-button-unchecked",
  "xmark.circle.fill": "cancel",
  "xmark": "close",
  "plus": "add",
  "minus": "remove",
  // Study
  "book.fill": "menu-book",
  "clock.fill": "access-time",
  "flame.fill": "local-fire-department",
  "star.fill": "star",
  "trophy.fill": "emoji-events",
  "bolt.fill": "bolt",
  "moon.fill": "bedtime",
  "sun.max.fill": "wb-sunny",
  "brain.head.profile": "psychology",
  "target": "gps-fixed",
  // Progress
  "chart.line.uptrend.xyaxis": "trending-up",
  "calendar": "calendar-today",
  "hourglass": "hourglass-empty",
  // Settings
  "gearshape.fill": "settings",
  "bell.fill": "notifications",
  "speaker.wave.2.fill": "volume-up",
  "speaker.slash.fill": "volume-off",
  "arrow.clockwise": "refresh",
  "info.circle": "info",
  // Misc
  "play.fill": "play-arrow",
  "pause.fill": "pause",
  "stop.fill": "stop",
  "arrow.right": "arrow-forward",
  "arrow.left": "arrow-back",
  "heart.fill": "favorite",
  "lock.fill": "lock",
  "shield.fill": "shield",
} as IconMapping;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
