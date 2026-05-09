import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useApp } from "@/lib/app-context";
import { DayTask } from "@/lib/store";
import { getRandomDailyPhrase, getRandomTaskCompletedPhrase, getRandomTiredPhrase } from "@/lib/warm-phrases";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

function TaskItem({
  task,
  onToggle,
}: {
  task: DayTask;
  onToggle: (id: string) => void;
}) {
  const colors = useColors();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(task.done ? 1 : 0)).current;

  const handlePress = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    Animated.timing(checkAnim, {
      toValue: task.done ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
    onToggle(task.id);
  };

  const s = StyleSheet.create({
    container: {
      flexDirection: "row", alignItems: "center", gap: 14,
      backgroundColor: colors.surface,
      borderRadius: 16, padding: 16, marginBottom: 10,
      borderWidth: 1.5,
      borderColor: task.done ? colors.success + "60" : colors.border,
    },
    checkBox: {
      width: 26, height: 26, borderRadius: 13,
      borderWidth: 2,
      borderColor: task.done ? colors.success : colors.border,
      backgroundColor: task.done ? colors.success : "transparent",
      alignItems: "center", justifyContent: "center",
    },
    title: {
      fontSize: 15, fontWeight: "600",
      color: task.done ? colors.muted : colors.foreground,
      textDecorationLine: task.done ? "line-through" : "none",
      flex: 1,
    },
    meta: { fontSize: 12, color: colors.muted, marginTop: 2 },
  });

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable style={s.container} onPress={handlePress}>
        <View style={s.checkBox}>
          {task.done && <IconSymbol name="checkmark.circle.fill" size={14} color="#fff" />}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>{task.title}</Text>
          <Text style={s.meta}>
            {task.isReview ? "📝 Revisão" : "📖 " + task.subject} · {task.durationMin} min
          </Text>
        </View>
        {task.done && (
          <Text style={{ fontSize: 18 }}>✅</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

export default function TodayScreen() {
  const colors = useColors();
  const router = useRouter();
  const { state, isLoading, toggleTask, toggleTiredMode } = useApp();
  const [phrase] = useState(
    state.tiredModeActive ? getRandomTiredPhrase() : getRandomDailyPhrase()
  );
  const [completedPhrase, setCompletedPhrase] = useState("");
  const completedAnim = useRef(new Animated.Value(0)).current;

  const tasks = state.todayTasks;
  const doneTasks = tasks.filter((t) => t.done).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? doneTasks / totalTasks : 0;
  const progressAnim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const handleToggle = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task && !task.done) {
      const phrase = getRandomTaskCompletedPhrase();
      setCompletedPhrase(phrase);
      completedAnim.setValue(0);
      Animated.sequence([
        Animated.timing(completedAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(completedAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start();
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    await toggleTask(id);
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  const s = StyleSheet.create({
    header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
    greeting: { fontSize: 14, color: colors.muted, fontWeight: "500" },
    name: { fontSize: 24, fontWeight: "800", color: colors.foreground, marginTop: 2 },
    phraseCard: {
      marginHorizontal: 20, marginTop: 12, marginBottom: 16,
      backgroundColor: colors.primary + "15",
      borderRadius: 16, padding: 16,
      borderLeftWidth: 4, borderLeftColor: colors.primary,
    },
    phraseText: { fontSize: 15, color: colors.primary, fontWeight: "600", lineHeight: 22 },
    progressSection: { paddingHorizontal: 20, marginBottom: 20 },
    progressHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
    progressLabel: { fontSize: 14, fontWeight: "700", color: colors.foreground },
    progressCount: { fontSize: 14, color: colors.muted },
    progressBar: { height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: "hidden" },
    progressFill: { height: "100%", borderRadius: 4, backgroundColor: colors.primary },
    sectionTitle: { fontSize: 17, fontWeight: "800", color: colors.foreground, paddingHorizontal: 20, marginBottom: 12 },
    tiredBtn: {
      marginHorizontal: 20, marginTop: 8, marginBottom: 16,
      flexDirection: "row", alignItems: "center", gap: 10,
      backgroundColor: state.tiredModeActive ? colors.warning + "20" : colors.surface2,
      borderRadius: 16, padding: 14,
      borderWidth: 1.5,
      borderColor: state.tiredModeActive ? colors.warning : colors.border,
    },
    tiredBtnText: {
      fontSize: 14, fontWeight: "700",
      color: state.tiredModeActive ? colors.warning : colors.muted,
      flex: 1,
    },
    allDoneCard: {
      marginHorizontal: 20, marginTop: 8,
      backgroundColor: colors.success + "15",
      borderRadius: 20, padding: 24,
      alignItems: "center",
      borderWidth: 1.5, borderColor: colors.success + "40",
    },
    streakBadge: {
      flexDirection: "row", alignItems: "center", gap: 6,
      backgroundColor: colors.warning + "20",
      borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6,
      marginHorizontal: 20, marginBottom: 16,
      alignSelf: "flex-start",
    },
    toastContainer: {
      position: "absolute", bottom: 100, left: 20, right: 20,
      backgroundColor: colors.success,
      borderRadius: 16, padding: 14,
      alignItems: "center",
    },
    toastText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  });

  if (!state.profile?.onboardingDone && !isLoading) {
    router.replace("/onboarding");
    return null;
  }

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.greeting}>{greeting()},</Text>
          <Text style={s.name}>
            {state.profile?.concurso
              ? `Candidato ao ${state.profile.concurso}`
              : "Candidato"}
          </Text>
        </View>

        {/* Streak badge */}
        {state.streak > 0 && (
          <View style={s.streakBadge}>
            <Text style={{ fontSize: 18 }}>🔥</Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: colors.warning }}>
              {state.streak} {state.streak === 1 ? "dia" : "dias"} seguidos
            </Text>
          </View>
        )}

        {/* Frase motivacional */}
        <View style={s.phraseCard}>
          <Text style={s.phraseText}>{phrase}</Text>
        </View>

        {/* Progresso do dia */}
        <View style={s.progressSection}>
          <View style={s.progressHeader}>
            <Text style={s.progressLabel}>Progresso de hoje</Text>
            <Text style={s.progressCount}>{doneTasks}/{totalTasks} tarefas</Text>
          </View>
          <View style={s.progressBar}>
            <Animated.View
              style={[
                s.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]}
            />
          </View>
        </View>

        {/* Modo Cansado */}
        <Pressable style={s.tiredBtn} onPress={toggleTiredMode}>
          <Text style={{ fontSize: 20 }}>{state.tiredModeActive ? "😴" : "😓"}</Text>
          <Text style={s.tiredBtnText}>
            {state.tiredModeActive
              ? "Modo Cansado ativo — tarefas reduzidas"
              : "Estou cansado hoje"}
          </Text>
          {state.tiredModeActive && (
            <IconSymbol name="xmark.circle.fill" size={18} color={colors.warning} />
          )}
        </Pressable>

        {/* Tarefas do dia */}
        {doneTasks === totalTasks && totalTasks > 0 ? (
          <View style={s.allDoneCard}>
            <Text style={{ fontSize: 48, marginBottom: 8 }}>🏆</Text>
            <Text style={{ fontSize: 20, fontWeight: "800", color: colors.success, marginBottom: 4 }}>
              Dia completo!
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted, textAlign: "center" }}>
              Você completou todas as tarefas de hoje. Seu futuro agradece! 💛
            </Text>
          </View>
        ) : (
          <>
            <Text style={s.sectionTitle}>Tarefas de hoje</Text>
            <View style={{ paddingHorizontal: 20 }}>
              {tasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={handleToggle} />
              ))}
            </View>
          </>
        )}

        {/* Comece Rápido */}
        {tasks.length === 0 && (
          <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
            <View style={{
              backgroundColor: colors.primary + "10",
              borderRadius: 20, padding: 20,
              borderWidth: 1.5, borderColor: colors.primary + "30",
            }}>
              <Text style={{ fontSize: 20, marginBottom: 8 }}>🚀</Text>
              <Text style={{ fontSize: 16, fontWeight: "800", color: colors.foreground, marginBottom: 4 }}>
                Não sabe por onde começar?
              </Text>
              <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 16 }}>
                Vamos montar sua rotina de estudos personalizada.
              </Text>
              <Pressable
                style={{ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 12, alignItems: "center" }}
                onPress={() => router.push("/focus" as any)}
              >
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>Montar minha rotina →</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Toast de conclusão */}
      <Animated.View
        style={[s.toastContainer, { opacity: completedAnim, transform: [{ translateY: completedAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}
        pointerEvents="none"
      >
        <Text style={s.toastText}>{completedPhrase}</Text>
      </Animated.View>
    </ScreenContainer>
  );
}
