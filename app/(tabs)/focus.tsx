import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useApp } from "@/lib/app-context";
import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import { useKeepAwake } from "expo-keep-awake";

type PomodoroMode = "focus" | "break" | "idle";

const MINI_GOALS = [
  { id: "1", icon: "📖", title: "Ler 10 páginas", duration: 15, xp: 20 },
  { id: "2", icon: "✏️", title: "Resolver 5 questões", duration: 20, xp: 30 },
  { id: "3", icon: "🧠", title: "Revisar um tópico", duration: 25, xp: 35 },
  { id: "4", icon: "📝", title: "Fazer resumo", duration: 30, xp: 40 },
  { id: "5", icon: "🎯", title: "Simulado rápido", duration: 45, xp: 60 },
];

function PomodoroTimer({ tiredMode }: { tiredMode: boolean }) {
  const colors = useColors();
  const { addStudyTime } = useApp();
  const focusDuration = tiredMode ? 15 * 60 : 25 * 60;
  const breakDuration = tiredMode ? 5 * 60 : 5 * 60;

  const [mode, setMode] = useState<PomodoroMode>("idle");
  const [timeLeft, setTimeLeft] = useState(focusDuration);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useKeepAwake();

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const start = () => {
    if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMode("focus");
    setTimeLeft(focusDuration);
    progressAnim.setValue(0);
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        const total = mode === "focus" ? focusDuration : breakDuration;
        Animated.timing(progressAnim, {
          toValue: 1 - next / total,
          duration: 900,
          useNativeDriver: false,
        }).start();
        if (next <= 0) {
          clearInterval(intervalRef.current!);
          if (mode === "focus") {
            addStudyTime(focusDuration / 60);
            setCycles((c) => c + 1);
            setMode("break");
            setTimeLeft(breakDuration);
            if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } else {
            setMode("idle");
            if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }
          return 0;
        }
        return next;
      });
    }, 1000);
  };

  const pause = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMode("idle");
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMode("idle");
    setTimeLeft(focusDuration);
    progressAnim.setValue(0);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const modeColor = mode === "break" ? colors.success : colors.primary;

  return (
    <View style={{ alignItems: "center", paddingVertical: 24 }}>
      {/* Timer circle */}
      <View style={{ width: 200, height: 200, alignItems: "center", justifyContent: "center" }}>
        <View style={{
          width: 200, height: 200, borderRadius: 100,
          borderWidth: 8, borderColor: colors.border,
          alignItems: "center", justifyContent: "center",
          position: "absolute",
        }} />
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 14, color: colors.muted, fontWeight: "600", marginBottom: 4 }}>
            {mode === "idle" ? "PRONTO" : mode === "focus" ? "FOCO" : "PAUSA"}
          </Text>
          <Text style={{ fontSize: 48, fontWeight: "800", color: modeColor, fontVariant: ["tabular-nums"] }}>
            {formatTime(timeLeft)}
          </Text>
          {cycles > 0 && (
            <Text style={{ fontSize: 12, color: colors.muted, marginTop: 4 }}>
              🔥 {cycles} ciclo{cycles !== 1 ? "s" : ""} completo{cycles !== 1 ? "s" : ""}
            </Text>
          )}
        </View>
      </View>

      {/* Controls */}
      <View style={{ flexDirection: "row", gap: 16, marginTop: 24 }}>
        {mode === "idle" ? (
          <Pressable
            style={{ backgroundColor: colors.primary, borderRadius: 20, paddingHorizontal: 32, paddingVertical: 14 }}
            onPress={start}
          >
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
              {tiredMode ? "▶ Iniciar (15 min)" : "▶ Iniciar (25 min)"}
            </Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              style={{ backgroundColor: colors.warning + "20", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1.5, borderColor: colors.warning }}
              onPress={pause}
            >
              <Text style={{ color: colors.warning, fontWeight: "700" }}>⏸ Pausar</Text>
            </Pressable>
            <Pressable
              style={{ backgroundColor: colors.surface2, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1.5, borderColor: colors.border }}
              onPress={reset}
            >
              <Text style={{ color: colors.muted, fontWeight: "700" }}>↺ Reiniciar</Text>
            </Pressable>
          </>
        )}
      </View>

      {tiredMode && (
        <Text style={{ fontSize: 13, color: colors.warning, marginTop: 12, textAlign: "center" }}>
          😴 Modo Cansado: sessões de 15 minutos
        </Text>
      )}
    </View>
  );
}

export default function FocusScreen() {
  const colors = useColors();
  const { state, addStudyTime } = useApp();
  const [completedGoals, setCompletedGoals] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"pomodoro" | "metas" | "desafios">("pomodoro");

  const handleCompleteGoal = (goalId: string, durationMin: number) => {
    if (completedGoals.includes(goalId)) return;
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCompletedGoals((prev) => [...prev, goalId]);
    addStudyTime(durationMin);
  };

  const s = StyleSheet.create({
    header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
    title: { fontSize: 26, fontWeight: "800", color: colors.foreground },
    subtitle: { fontSize: 14, color: colors.muted, marginTop: 4 },
    tabRow: { flexDirection: "row", paddingHorizontal: 20, gap: 8, marginVertical: 16 },
    tab: {
      flex: 1, paddingVertical: 10, borderRadius: 12,
      alignItems: "center",
      backgroundColor: colors.surface2,
      borderWidth: 1.5, borderColor: colors.border,
    },
    tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    tabText: { fontSize: 13, fontWeight: "700", color: colors.muted },
    tabTextActive: { color: "#fff" },
    goalCard: {
      flexDirection: "row", alignItems: "center", gap: 14,
      backgroundColor: colors.surface,
      borderRadius: 16, padding: 16, marginBottom: 10,
      borderWidth: 1.5, borderColor: colors.border,
    },
    goalCardDone: { borderColor: colors.success + "60", backgroundColor: colors.success + "08" },
    challengeCard: {
      backgroundColor: colors.surface,
      borderRadius: 20, padding: 20, marginBottom: 12,
      borderWidth: 1.5, borderColor: colors.border,
    },
  });

  return (
    <ScreenContainer containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.title}>Plano Anti-Procrastinação</Text>
          <Text style={s.subtitle}>Pequenos passos levam a grandes conquistas.</Text>
        </View>

        {/* Tabs */}
        <View style={s.tabRow}>
          {(["pomodoro", "metas", "desafios"] as const).map((tab) => (
            <Pressable
              key={tab}
              style={[s.tab, activeTab === tab && s.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>
                {tab === "pomodoro" ? "⏱ Foco" : tab === "metas" ? "🎯 Metas" : "⚡ Desafios"}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Pomodoro */}
        {activeTab === "pomodoro" && (
          <View style={{ paddingHorizontal: 20 }}>
            <View style={{ backgroundColor: colors.surface, borderRadius: 24, borderWidth: 1.5, borderColor: colors.border }}>
              <PomodoroTimer tiredMode={state.tiredModeActive} />
            </View>
            <View style={{ marginTop: 16, backgroundColor: colors.primary + "10", borderRadius: 16, padding: 16, borderWidth: 1.5, borderColor: colors.primary + "30" }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.primary, marginBottom: 4 }}>💡 Como funciona</Text>
              <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 20 }}>
                Estude por {state.tiredModeActive ? "15" : "25"} minutos sem distrações, depois descanse por 5 minutos. Repita o ciclo. Essa técnica aumenta o foco e reduz a procrastinação.
              </Text>
            </View>
          </View>
        )}

        {/* Mini Metas */}
        {activeTab === "metas" && (
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 16, lineHeight: 20 }}>
              Escolha uma mini meta para começar agora. Pequenas vitórias constroem grandes hábitos.
            </Text>
            {MINI_GOALS.map((goal) => {
              const done = completedGoals.includes(goal.id);
              return (
                <View key={goal.id} style={[s.goalCard, done && s.goalCardDone]}>
                  <Text style={{ fontSize: 28 }}>{goal.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: done ? colors.muted : colors.foreground }}>
                      {goal.title}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.muted }}>
                      {goal.duration} min · +{goal.xp} XP
                    </Text>
                  </View>
                  <Pressable
                    style={{
                      backgroundColor: done ? colors.success + "20" : colors.primary,
                      borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8,
                    }}
                    onPress={() => handleCompleteGoal(goal.id, goal.duration)}
                  >
                    <Text style={{ color: done ? colors.success : "#fff", fontWeight: "700", fontSize: 13 }}>
                      {done ? "✓ Feito" : "Iniciar"}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}

        {/* Desafios */}
        {activeTab === "desafios" && (
          <View style={{ paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 16, lineHeight: 20 }}>
              Desafios especiais para turbinar seus estudos e vencer a procrastinação.
            </Text>
            {[
              { icon: "🌅", title: "Madrugador", desc: "Estude antes das 8h por 3 dias seguidos", reward: "Badge especial", difficulty: "Médio" },
              { icon: "📵", title: "Modo Avião", desc: "Estude 1 hora sem tocar no celular", reward: "+100 XP", difficulty: "Difícil" },
              { icon: "🔁", title: "Revisão Relâmpago", desc: "Revise 3 tópicos em 30 minutos", reward: "+50 XP", difficulty: "Fácil" },
              { icon: "🎯", title: "Dia Perfeito", desc: "Complete todas as tarefas do dia", reward: "+200 XP", difficulty: "Médio" },
              { icon: "📚", title: "Maratona", desc: "Estude por 4 horas em um único dia", reward: "+300 XP", difficulty: "Difícil" },
            ].map((challenge) => (
              <View key={challenge.title} style={s.challengeCard}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <Text style={{ fontSize: 32 }}>{challenge.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "800", color: colors.foreground }}>{challenge.title}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 }}>
                      <View style={{
                        backgroundColor: challenge.difficulty === "Fácil" ? colors.success + "20" :
                                         challenge.difficulty === "Médio" ? colors.warning + "20" : colors.error + "20",
                        borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2,
                      }}>
                        <Text style={{
                          fontSize: 11, fontWeight: "700",
                          color: challenge.difficulty === "Fácil" ? colors.success :
                                 challenge.difficulty === "Médio" ? colors.warning : colors.error,
                        }}>
                          {challenge.difficulty}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 12, color: colors.muted }}>🏅 {challenge.reward}</Text>
                    </View>
                  </View>
                </View>
                <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 18 }}>{challenge.desc}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Comece Rápido */}
        <View style={{ paddingHorizontal: 20, marginTop: 16, marginBottom: 32 }}>
          <View style={{
            backgroundColor: colors.accent + "10",
            borderRadius: 20, padding: 20,
            borderWidth: 1.5, borderColor: colors.accent + "30",
          }}>
            <Text style={{ fontSize: 18 }}>🚀</Text>
            <Text style={{ fontSize: 16, fontWeight: "800", color: colors.foreground, marginTop: 8, marginBottom: 4 }}>
              Não sabe por onde começar?
            </Text>
            <Text style={{ fontSize: 14, color: colors.muted, marginBottom: 16, lineHeight: 20 }}>
              Comece com apenas 15 minutos. Uma sessão curta é infinitamente melhor do que nenhuma.
            </Text>
            <Pressable
              style={{ backgroundColor: colors.accent, borderRadius: 14, paddingVertical: 12, alignItems: "center" }}
              onPress={() => setActiveTab("metas")}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>Montar minha rotina →</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
